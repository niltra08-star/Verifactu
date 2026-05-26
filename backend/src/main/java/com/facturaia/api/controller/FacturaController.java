package com.facturaia.api.controller;

import com.facturaia.api.dto.FacturaRequest;
import com.facturaia.api.dto.FacturaResponse;
import com.facturaia.api.dto.DashboardResponse;
import com.facturaia.api.service.FacturaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/facturas")
@RequiredArgsConstructor
public class FacturaController {

    private final FacturaService facturaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FacturaResponse crear(@RequestAttribute("usuarioId") Long usuarioId,
                                  @Valid @RequestBody FacturaRequest request) {
        return facturaService.crearFactura(usuarioId, request);
    }

    @GetMapping
    public List<FacturaResponse> listar(@RequestAttribute("usuarioId") Long usuarioId) {
        return facturaService.listarFacturas(usuarioId);
    }

    @GetMapping("/{id}")
    public FacturaResponse obtener(@RequestAttribute("usuarioId") Long usuarioId,
                                    @PathVariable Long id) {
        return facturaService.obtenerFactura(usuarioId, id);
    }

    @PostMapping("/{id}/anular")
    public FacturaResponse anular(@RequestAttribute("usuarioId") Long usuarioId,
                                   @PathVariable Long id) {
        return facturaService.anularFactura(usuarioId, id);
    }
}
