package com.facturaia.verifactu.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroFacturacion {

    private String idRegistro;
    private String nifEmisor;
    private String nombreEmisor;
    private String numeroFactura;
    private String serieFactura;
    private LocalDateTime fechaExpedicion;
    private LocalDateTime fechaOperacion;

    private String nifReceptor;
    private String nombreReceptor;

    @Builder.Default
    private BigDecimal baseImponible = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal tipoImpositivo = new BigDecimal("21.00");
    @Builder.Default
    private BigDecimal cuotaIVA = BigDecimal.ZERO;
    @Builder.Default
    private BigDecimal totalFactura = BigDecimal.ZERO;

    private String descripcionOperacion;

    private TipoRegistro tipoRegistro;
    private String huella;
    private String huellaAnterior;
    private String firmaElectronica;
    private LocalDateTime timestamp;

    private String codigoQR;
    private String xmlContent;

    public enum TipoRegistro {
        ALTA, ANULACION
    }
}
