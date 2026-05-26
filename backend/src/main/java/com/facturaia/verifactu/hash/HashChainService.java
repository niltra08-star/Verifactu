package com.facturaia.verifactu.hash;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;

@Service
@Slf4j
public class HashChainService {

    private final String algorithm;

    public HashChainService(@Value("${facturaia.verifactu.hash.algorithm:SHA-256}") String algorithm) {
        this.algorithm = algorithm;
    }

    public String calcularHuella(String datosRegistro, String huellaAnterior) {
        try {
            String concatenado;
            if (huellaAnterior != null && !huellaAnterior.isEmpty()) {
                concatenado = datosRegistro + huellaAnterior;
            } else {
                concatenado = datosRegistro;
            }

            MessageDigest digest = MessageDigest.getInstance(algorithm);
            byte[] hashBytes = digest.digest(concatenado.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashBytes).toUpperCase();
        } catch (Exception e) {
            log.error("Error calculando huella Verifactu con algoritmo {}", algorithm, e);
            throw new RuntimeException("Error en calculo de huella Verifactu", e);
        }
    }

    public String calcularCadenaDatos(RegistroFacturacionData data) {
        return String.join("|",
                data.nifEmisor() != null ? data.nifEmisor() : "",
                data.numeroFactura() != null ? data.numeroFactura() : "",
                data.fechaExpedicion() != null ? data.fechaExpedicion() : "",
                data.importeTotal() != null ? data.importeTotal() : "",
                data.tipoRegistro() != null ? data.tipoRegistro() : "ALTA"
        );
    }

    public record RegistroFacturacionData(
            String nifEmisor,
            String numeroFactura,
            String fechaExpedicion,
            String importeTotal,
            String tipoRegistro
    ) {}

    public boolean verificarCadena(String huella, String datosRegistro, String huellaAnterior) {
        String huellaCalculada = calcularHuella(datosRegistro, huellaAnterior);
        return huella.equalsIgnoreCase(huellaCalculada);
    }
}
