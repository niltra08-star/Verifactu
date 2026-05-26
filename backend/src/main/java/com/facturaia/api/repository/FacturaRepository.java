package com.facturaia.api.repository;

import com.facturaia.api.model.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {

    List<Factura> findByUsuarioIdOrderByFechaEmisionDesc(Long usuarioId);

    Optional<Factura> findByUsuarioIdAndId(Long usuarioId, Long id);

    @Query("SELECT f FROM Factura f WHERE f.usuario.id = :usuarioId AND f.estado = :estado ORDER BY f.fechaEmision DESC")
    List<Factura> findByUsuarioIdAndEstado(Long usuarioId, Factura.EstadoFactura estado);

    long countByUsuarioId(Long usuarioId);

    @Query("SELECT COALESCE(SUM(f.total), 0) FROM Factura f WHERE f.usuario.id = :usuarioId AND f.estado IN ('EMITIDA', 'COBRADA')")
    BigDecimal sumTotalFacturadoByUsuarioId(Long usuarioId);

    @Query("SELECT COALESCE(SUM(f.ivaImporte), 0) FROM Factura f WHERE f.usuario.id = :usuarioId AND f.estado IN ('EMITIDA', 'COBRADA')")
    BigDecimal sumIVAByUsuarioId(Long usuarioId);

    @Query("SELECT COALESCE(SUM(f.irpfImporte), 0) FROM Factura f WHERE f.usuario.id = :usuarioId AND f.estado IN ('EMITIDA', 'COBRADA')")
    BigDecimal sumIRPFByUsuarioId(Long usuarioId);

    @Query("SELECT f FROM Factura f WHERE f.usuario.id = :usuarioId ORDER BY f.huella ASC NULLS FIRST")
    List<Factura> findForHashChainByUsuarioId(Long usuarioId);

    Optional<Factura> findTopByUsuarioIdOrderByHuellaDesc(Long usuarioId);
}
