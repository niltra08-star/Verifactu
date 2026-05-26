package com.facturaia.verifactu.client;

import com.facturaia.verifactu.model.RegistroFacturacion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class VerifactuSoapClient {

    private final String wsdlUrl;
    private final boolean testMode;

    public VerifactuSoapClient(
            @Value("${facturaia.verifactu.aeat.wsdl-url:}") String wsdlUrl,
            @Value("${facturaia.verifactu.aeat.test-mode:true}") boolean testMode) {
        this.wsdlUrl = wsdlUrl;
        this.testMode = testMode;
        log.info("VerifactuSoapClient inicializado. Modo prueba: {}. WSDL: {}", testMode, wsdlUrl);
    }

    public EnvioResponse enviarRegistro(RegistroFacturacion registro) {
        if (testMode) {
            log.info("[MODO PRUEBA] Simulando envio de registro Verifactu: {}", registro.getNumeroFactura());
            return EnvioResponse.success(
                    "TEST-" + System.currentTimeMillis(),
                    "Registro simulado en modo prueba"
            );
        }

        log.info("Enviando registro Verifactu a AEAT: {}", registro.getNumeroFactura());
        log.warn("SOAP client no implementado completamente. Usar Portal de Pruebas AEAT: preportal.aeat.es");

        return EnvioResponse.error("SOAP_CLIENT_NOT_READY",
                "Cliente SOAP pendiente de configurar con certificado real. " +
                "Usar preportal.aeat.es para pruebas manuales.");
    }

    public record EnvioResponse(
            String codigoRespuesta,
            String mensaje,
            String idTransaccion,
            boolean exitoso
    ) {
        public static EnvioResponse success(String id, String msg) {
            return new EnvioResponse("OK", msg, id, true);
        }

        public static EnvioResponse error(String code, String msg) {
            return new EnvioResponse(code, msg, null, false);
        }
    }
}
