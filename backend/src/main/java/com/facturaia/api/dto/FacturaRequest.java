package com.facturaia.api.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class FacturaRequest {

    @NotNull
    private Long clienteId;

    @NotBlank
    private String numeroFactura;

    private String serie;

    @NotNull
    private LocalDate fechaEmision;

    private LocalDate fechaOperacion;

    @NotNull
    private LocalDate fechaVencimiento;

    private String observaciones;

    private BigDecimal ivaPorcentaje = new BigDecimal("21.00");
    private BigDecimal irpfPorcentaje = new BigDecimal("15.00");

    @NotEmpty
    private List<LineaFacturaRequest> lineas;

    @Data
    public static class LineaFacturaRequest {
        @NotBlank
        private String concepto;
        private BigDecimal cantidad = BigDecimal.ONE;
        private BigDecimal precioUnitario = BigDecimal.ZERO;
        private BigDecimal ivaPorcentaje = new BigDecimal("21.00");
    }
}
