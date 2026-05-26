package com.facturaia.api.repository;

import com.facturaia.api.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByUsuarioIdOrderByNombreAsc(Long usuarioId);

    List<Cliente> findByUsuarioIdAndNombreContainingIgnoreCase(Long usuarioId, String nombre);

    long countByUsuarioId(Long usuarioId);
}
