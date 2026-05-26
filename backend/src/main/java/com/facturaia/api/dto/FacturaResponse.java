package com.facturaia.api.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class FacturaResponse {

    private Long id;
    private String numeroFactura;
    private String serie;
    private LocalDate fechaEmision;
    private LocalDate fechaOperacion;
    private LocalDate fechaVencimiento;
    private String estado;

    private Long clienteId;
    private String clienteNombre;
    private String clienteNif;

    private BigDecimal baseImponible;
    private BigDecimal ivaPorcentaje;
    private BigDecimal ivaImporte;
    private BigDecimal irpfPorcentaje;
    private BigDecimal irpfImporte;
    private BigDecimal total;

    private String observaciones;
    private String formato;
    private Boolean verifactuEnviada;
    private String huella;
    private String qrBase64;

    private List<LineaResponse> lineas;
    private LocalDateTime createdAt;

    @Data
    @Builder
    public static class LineaResponse {
        private Integer orden;
        private String concepto;
        private BigDecimal cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal importe;
        private BigDecimal ivaPorcentaje;
    }
}
