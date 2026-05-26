package com.facturaia.verifactu.qr;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

@Service
@Slf4j
public class QRCodeService {

    private static final int QR_WIDTH = 300;
    private static final int QR_HEIGHT = 300;

    public String generarQRBase64(String nifEmisor, String numeroFactura, String fechaExpedicion,
                                   String importeTotal, String huella) {
        try {
            String qrData = String.join("|",
                    "VERIFACTU",
                    nifEmisor,
                    numeroFactura,
                    fechaExpedicion,
                    importeTotal,
                    huella != null ? huella.substring(0, Math.min(huella.length(), 16)) : ""
            );

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, QR_WIDTH, QR_HEIGHT);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
            byte[] pngBytes = baos.toByteArray();

            return Base64.getEncoder().encodeToString(pngBytes);
        } catch (Exception e) {
            log.error("Error generando QR Verifactu para factura {}", numeroFactura, e);
            throw new RuntimeException("Error generando codigo QR Verifactu", e);
        }
    }

    public String generarUrlVerificacion(String nifEmisor, String numeroFactura, String fechaExpedicion) {
        return String.format("https://sede.agenciatributaria.gob.es/verifactu/verificar?nif=%s&factura=%s&fecha=%s",
                nifEmisor, numeroFactura, fechaExpedicion);
    }
}
