package com.facturaia.api.controller;

import com.facturaia.api.model.Cliente;
import com.facturaia.api.model.Usuario;
import com.facturaia.api.repository.ClienteRepository;
import com.facturaia.api.repository.UsuarioRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Cliente> listar(@RequestAttribute("usuarioId") Long usuarioId) {
        return clienteRepository.findByUsuarioIdOrderByNombreAsc(usuarioId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cliente crear(@RequestAttribute("usuarioId") Long usuarioId,
                          @Valid @RequestBody Cliente cliente) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        cliente.setUsuario(usuario);
        return clienteRepository.save(cliente);
    }

    @GetMapping("/{id}")
    public Cliente obtener(@RequestAttribute("usuarioId") Long usuarioId,
                            @PathVariable Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado"));
        if (!cliente.getUsuario().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este cliente");
        }
        return cliente;
    }

    @PutMapping("/{id}")
    public Cliente actualizar(@RequestAttribute("usuarioId") Long usuarioId,
                               @PathVariable Long id,
                               @Valid @RequestBody Cliente datos) {
        Cliente existente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado"));
        if (!existente.getUsuario().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este cliente");
        }
        existente.setNombre(datos.getNombre());
        existente.setNif(datos.getNif());
        existente.setDireccion(datos.getDireccion());
        existente.setCodigoPostal(datos.getCodigoPostal());
        existente.setCiudad(datos.getCiudad());
        existente.setProvincia(datos.getProvincia());
        existente.setEmail(datos.getEmail());
        existente.setTelefono(datos.getTelefono());
        return clienteRepository.save(existente);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@RequestAttribute("usuarioId") Long usuarioId,
                          @PathVariable Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado"));
        if (!cliente.getUsuario().getId().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No tienes acceso a este cliente");
        }
        clienteRepository.deleteById(id);
    }
}
