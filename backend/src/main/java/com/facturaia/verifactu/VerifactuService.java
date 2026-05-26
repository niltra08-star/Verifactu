package com.facturaia.verifactu;

import com.facturaia.verifactu.hash.HashChainService;
import com.facturaia.verifactu.model.RegistroFacturacion;
import com.facturaia.verifactu.qr.QRCodeService;
import com.facturaia.verifactu.signature.DigitalSignatureService;
import com.facturaia.verifactu.xml.VerifactuXmlGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerifactuService {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final HashChainService hashChainService;
    private final VerifactuXmlGenerator xmlGenerator;
    private final DigitalSignatureService signatureService;
    private final QRCodeService qrCodeService;

    public RegistroFacturacion generarRegistroFacturacion(FacturaData factura, String huellaAnterior) {
        String fechaExpedicionStr = factura.fechaExpedicion() != null
                ? factura.fechaExpedicion().format(DATE_FMT) : "";

        String datosCadena = hashChainService.calcularCadenaDatos(
                new HashChainService.RegistroFacturacionData(
                        factura.nifEmisor(),
                        factura.numeroFactura(),
                        fechaExpedicionStr,
                        factura.importeTotal(),
                        "ALTA"
                )
        );

        String huella = hashChainService.calcularHuella(datosCadena, huellaAnterior);

        RegistroFacturacion registro = RegistroFacturacion.builder()
                .idRegistro(UUID.randomUUID().toString())
                .nifEmisor(factura.nifEmisor())
                .nombreEmisor(factura.nombreEmisor())
                .numeroFactura(factura.numeroFactura())
                .serieFactura(factura.serieFactura())
                .fechaExpedicion(factura.fechaExpedicion())
                .fechaOperacion(factura.fechaOperacion())
                .nifReceptor(factura.nifReceptor())
                .nombreReceptor(factura.nombreReceptor())
                .baseImponible(factura.baseImponible())
                .tipoImpositivo(factura.tipoImpositivo())
                .cuotaIVA(factura.cuotaIVA())
                .totalFactura(factura.totalFactura())
                .descripcionOperacion(factura.descripcionOperacion())
                .tipoRegistro(RegistroFacturacion.TipoRegistro.ALTA)
                .huella(huella)
                .huellaAnterior(huellaAnterior)
                .timestamp(LocalDateTime.now())
                .build();

        String xml = xmlGenerator.generarXml(registro);
        registro.setXmlContent(xml);

        String firma = signatureService.firmar(xml);
        registro.setFirmaElectronica(firma);

        String qr = qrCodeService.generarQRBase64(
                factura.nifEmisor(),
                factura.numeroFactura(),
                fechaExpedicionStr,
                factura.importeTotal(),
                huella
        );
        registro.setCodigoQR(qr);

        log.info("Registro Verifactu generado: factura={}, huella={}", factura.numeroFactura(), huella);
        return registro;
    }

    public record FacturaData(
            String nifEmisor,
            String nombreEmisor,
            String numeroFactura,
            String serieFactura,
            LocalDateTime fechaExpedicion,
            LocalDateTime fechaOperacion,
            String nifReceptor,
            String nombreReceptor,
            BigDecimal baseImponible,
            BigDecimal tipoImpositivo,
            BigDecimal cuotaIVA,
            BigDecimal totalFactura,
            String importeTotal,
            String descripcionOperacion
    ) {}
}
