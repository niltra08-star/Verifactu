package com.facturaia.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "facturas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String numeroFactura;

    @Column(length = 20)
    private String serie;

    @NotNull
    @Column(nullable = false)
    private LocalDate fechaEmision;

    private LocalDate fechaOperacion;

    @Column(nullable = false)
    private LocalDate fechaVencimiento;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @NotNull
    private EstadoFactura estado;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal baseImponible = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal ivaPorcentaje = new BigDecimal("21.00");

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal ivaImporte = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal irpfPorcentaje = new BigDecimal("15.00");

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal irpfImporte = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(length = 8)
    @Builder.Default
    private FormatoFactura formato = FormatoFactura.FACTURAE;

    @Column(length = 255)
    private String observaciones;

    @Column(nullable = false)
    @Builder.Default
    private Boolean verifactuEnviada = false;

    @Column(length = 128)
    private String huella;

    private String huellaAnterior;

    @Column(columnDefinition = "TEXT")
    private String xmlRegistro;

    @Column(columnDefinition = "TEXT")
    private String qrBase64;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LineaFactura> lineas = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @PreUpdate
    void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addLinea(LineaFactura linea) {
        lineas.add(linea);
        linea.setFactura(this);
    }

    public void removeLinea(LineaFactura linea) {
        lineas.remove(linea);
        linea.setFactura(null);
    }

    public enum EstadoFactura {
        BORRADOR, EMITIDA, COBRADA, ANULADA, VERIFICADA
    }

    public enum FormatoFactura {
        FACTURAE, PDF, VERIFACTU
    }
}
