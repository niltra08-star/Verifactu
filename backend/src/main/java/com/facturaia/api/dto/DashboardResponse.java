package com.facturaia.api.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardResponse {

    private long totalFacturas;
    private long totalClientes;
    private BigDecimal totalFacturado;
    private BigDecimal ivaPendiente;
    private BigDecimal irpfPendiente;
    private long facturasEsteMes;
    private BigDecimal facturadoEsteMes;
}
