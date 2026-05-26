package com.facturaia.api.service;

import com.facturaia.api.dto.DashboardResponse;
import com.facturaia.api.dto.FacturaRequest;
import com.facturaia.api.dto.FacturaResponse;
import com.facturaia.api.model.Cliente;
import com.facturaia.api.model.Factura;
import com.facturaia.api.model.LineaFactura;
import com.facturaia.api.model.Usuario;
import com.facturaia.api.repository.ClienteRepository;
import com.facturaia.api.repository.FacturaRepository;
import com.facturaia.api.repository.UsuarioRepository;
import com.facturaia.verifactu.VerifactuService;
import com.facturaia.verifactu.model.RegistroFacturacion;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class FacturaService {

    private final FacturaRepository facturaRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final VerifactuService verifactuService;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Long usuarioId) {
        long totalFacturas = facturaRepository.countByUsuarioId(usuarioId);
        long totalClientes = clienteRepository.countByUsuarioId(usuarioId);
        BigDecimal totalFacturado = facturaRepository.sumTotalFacturadoByUsuarioId(usuarioId);
        BigDecimal iva = facturaRepository.sumIVAByUsuarioId(usuarioId);
        BigDecimal irpf = facturaRepository.sumIRPFByUsuarioId(usuarioId);

        var inicioMes = LocalDate.now().withDayOfMonth(1);
        var facturas = facturaRepository.findByUsuarioIdOrderByFechaEmisionDesc(usuarioId);
        long facturasEsteMes = facturas.stream()
                .filter(f -> !f.getFechaEmision().isBefore(inicioMes))
                .count();
        BigDecimal facturadoEsteMes = facturas.stream()
                .filter(f -> !f.getFechaEmision().isBefore(inicioMes)
                        && f.getEstado() != Factura.EstadoFactura.BORRADOR
                        && f.getEstado() != Factura.EstadoFactura.ANULADA)
                .map(Factura::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return DashboardResponse.builder()
                .totalFacturas(totalFacturas)
                .totalClientes(totalClientes)
                .totalFacturado(totalFacturado != null ? totalFacturado : BigDecimal.ZERO)
                .ivaPendiente(iva != null ? iva : BigDecimal.ZERO)
                .irpfPendiente(irpf != null ? irpf : BigDecimal.ZERO)
                .facturasEsteMes(facturasEsteMes)
                .facturadoEsteMes(facturadoEsteMes)
                .build();
    }

    public FacturaResponse crearFactura(Long usuarioId, FacturaRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (!cliente.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Cliente no pertenece a este usuario");
        }

        Factura factura = Factura.builder()
                .usuario(usuario)
                .cliente(cliente)
                .numeroFactura(request.getNumeroFactura())
                .serie(request.getSerie())
                .fechaEmision(request.getFechaEmision())
                .fechaOperacion(request.getFechaOperacion() != null ? request.getFechaOperacion() : request.getFechaEmision())
                .fechaVencimiento(request.getFechaVencimiento())
                .estado(Factura.EstadoFactura.EMITIDA)
                .observaciones(request.getObservaciones())
                .ivaPorcentaje(request.getIvaPorcentaje())
                .irpfPorcentaje(request.getIrpfPorcentaje())
                .formato(Factura.FormatoFactura.FACTURAE)
                .build();

        BigDecimal baseTotal = BigDecimal.ZERO;
        int index = 1;
        for (FacturaRequest.LineaFacturaRequest lineaReq : request.getLineas()) {
            BigDecimal cantidad = lineaReq.getCantidad() != null ? lineaReq.getCantidad() : BigDecimal.ONE;
            BigDecimal precio = lineaReq.getPrecioUnitario() != null ? lineaReq.getPrecioUnitario() : BigDecimal.ZERO;
            BigDecimal importe = cantidad.multiply(precio).setScale(2, RoundingMode.HALF_UP);

            LineaFactura linea = LineaFactura.builder()
                    .factura(factura)
                    .orden(index++)
                    .concepto(lineaReq.getConcepto())
                    .cantidad(cantidad)
                    .precioUnitario(precio)
                    .importe(importe)
                    .ivaPorcentaje(lineaReq.getIvaPorcentaje() != null ? lineaReq.getIvaPorcentaje() : request.getIvaPorcentaje())
                    .build();
            factura.addLinea(linea);
            baseTotal = baseTotal.add(importe);
        }

        factura.setBaseImponible(baseTotal);
        BigDecimal iva = baseTotal.multiply(factura.getIvaPorcentaje())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        factura.setIvaImporte(iva);

        BigDecimal irpf = baseTotal.multiply(factura.getIrpfPorcentaje())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        factura.setIrpfImporte(irpf);

        BigDecimal total = baseTotal.add(iva);
        factura.setTotal(total);

        factura = generarRegistroVerifactu(factura);

        factura = facturaRepository.save(factura);
        log.info("Factura {} creada para usuario {}", factura.getNumeroFactura(), usuarioId);
        return toResponse(factura);
    }

    @Transactional(readOnly = true)
    public List<FacturaResponse> listarFacturas(Long usuarioId) {
        return facturaRepository.findByUsuarioIdOrderByFechaEmisionDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FacturaResponse obtenerFactura(Long usuarioId, Long facturaId) {
        Factura factura = facturaRepository.findByUsuarioIdAndId(usuarioId, facturaId)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        return toResponse(factura);
    }

    public FacturaResponse anularFactura(Long usuarioId, Long facturaId) {
        Factura factura = facturaRepository.findByUsuarioIdAndId(usuarioId, facturaId)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));

        if (factura.getEstado() == Factura.EstadoFactura.ANULADA) {
            throw new RuntimeException("La factura ya esta anulada");
        }

        factura.setEstado(Factura.EstadoFactura.ANULADA);
        factura = facturaRepository.save(factura);
        return toResponse(factura);
    }

    private Factura generarRegistroVerifactu(Factura factura) {
        try {
            String huellaAnterior = null;
            var ultimaFactura = facturaRepository.findTopByUsuarioIdOrderByHuellaDesc(factura.getUsuario().getId());
            if (ultimaFactura.isPresent() && ultimaFactura.get().getHuella() != null) {
                huellaAnterior = ultimaFactura.get().getHuella();
            }

            VerifactuService.FacturaData data = new VerifactuService.FacturaData(
                    factura.getUsuario().getNif() != null ? factura.getUsuario().getNif() : "",
                    factura.getUsuario().getNombre(),
                    factura.getNumeroFactura(),
                    factura.getSerie(),
                    factura.getFechaEmision().atStartOfDay(),
                    factura.getFechaOperacion() != null ? factura.getFechaOperacion().atStartOfDay() : null,
                    factura.getCliente().getNif() != null ? factura.getCliente().getNif() : "",
                    factura.getCliente().getNombre(),
                    factura.getBaseImponible(),
                    factura.getIvaPorcentaje(),
                    factura.getIvaImporte(),
                    factura.getTotal(),
                    factura.getTotal().toPlainString(),
                    factura.getObservaciones() != null ? factura.getObservaciones() : ""
            );

            RegistroFacturacion registro = verifactuService.generarRegistroFacturacion(data, huellaAnterior);

            factura.setHuella(registro.getHuella());
            factura.setHuellaAnterior(registro.getHuellaAnterior());
            factura.setXmlRegistro(registro.getXmlContent());
            factura.setQrBase64(registro.getCodigoQR());
            factura.setVerifactuEnviada(true);

        } catch (Exception e) {
            log.error("Error generando registro Verifactu para factura {}: {}", factura.getNumeroFactura(), e.getMessage());
            factura.setVerifactuEnviada(false);
        }

        return factura;
    }

    private FacturaResponse toResponse(Factura f) {
        return FacturaResponse.builder()
                .id(f.getId())
                .numeroFactura(f.getNumeroFactura())
                .serie(f.getSerie())
                .fechaEmision(f.getFechaEmision())
                .fechaOperacion(f.getFechaOperacion())
                .fechaVencimiento(f.getFechaVencimiento())
                .estado(f.getEstado().name())
                .clienteId(f.getCliente().getId())
                .clienteNombre(f.getCliente().getNombre())
                .clienteNif(f.getCliente().getNif())
                .baseImponible(f.getBaseImponible())
                .ivaPorcentaje(f.getIvaPorcentaje())
                .ivaImporte(f.getIvaImporte())
                .irpfPorcentaje(f.getIrpfPorcentaje())
                .irpfImporte(f.getIrpfImporte())
                .total(f.getTotal())
                .observaciones(f.getObservaciones())
                .formato(f.getFormato().name())
                .verifactuEnviada(f.getVerifactuEnviada())
                .huella(f.getHuella())
                .qrBase64(f.getQrBase64())
                .lineas(f.getLineas().stream()
                        .map(l -> FacturaResponse.LineaResponse.builder()
                                .orden(l.getOrden())
                                .concepto(l.getConcepto())
                                .cantidad(l.getCantidad())
                                .precioUnitario(l.getPrecioUnitario())
                                .importe(l.getImporte())
                                .ivaPorcentaje(l.getIvaPorcentaje())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(f.getCreatedAt())
                .build();
    }
}
