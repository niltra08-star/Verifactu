package com.facturaia.api.controller;

import com.facturaia.api.dto.DashboardResponse;
import com.facturaia.api.service.FacturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final FacturaService facturaService;

    @GetMapping
    public DashboardResponse dashboard(@RequestAttribute("usuarioId") Long usuarioId) {
        return facturaService.getDashboard(usuarioId);
    }
}
