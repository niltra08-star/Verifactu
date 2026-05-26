package com.facturaia.verifactu.signature;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;

@Service
@Slf4j
public class DigitalSignatureService {

    private final KeyPair keyPair;

    public DigitalSignatureService(
            @Value("${facturaia.verifactu.certificate.path:classpath:certificates/test-cert.pfx}")
            String certPath,
            @Value("${facturaia.verifactu.certificate.password:changeit}")
            String certPassword) {

        Security.addProvider(new BouncyCastleProvider());
        this.keyPair = generateTestKeyPair();
        log.info("DigitalSignatureService inicializado con clave de prueba ({} bits)",
                ((java.security.interfaces.RSAKey) keyPair.getPublic()).getModulus().bitLength());
    }

    public String firmar(String datos) {
        try {
            Signature signature = Signature.getInstance("SHA256withRSA", "BC");
            signature.initSign(keyPair.getPrivate());
            signature.update(datos.getBytes(StandardCharsets.UTF_8));
            byte[] firmaBytes = signature.sign();
            return Base64.getEncoder().encodeToString(firmaBytes);
        } catch (Exception e) {
            log.error("Error firmando datos Verifactu", e);
            throw new RuntimeException("Error en firma digital Verifactu", e);
        }
    }

    public boolean verificarFirma(String datos, String firmaBase64) {
        try {
            Signature signature = Signature.getInstance("SHA256withRSA", "BC");
            signature.initVerify(keyPair.getPublic());
            signature.update(datos.getBytes(StandardCharsets.UTF_8));
            byte[] firmaBytes = Base64.getDecoder().decode(firmaBase64);
            return signature.verify(firmaBytes);
        } catch (Exception e) {
            log.error("Error verificando firma Verifactu", e);
            return false;
        }
    }

    public String getPublicKeyBase64() {
        return Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
    }

    private KeyPair generateTestKeyPair() {
        try {
            KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA", "BC");
            keyGen.initialize(2048, new SecureRandom());
            return keyGen.generateKeyPair();
        } catch (Exception e) {
            log.error("Error generando par de claves de prueba", e);
            throw new RuntimeException("No se pudo generar clave de prueba", e);
        }
    }
}
