package com.facturaia.verifactu.xml;

import com.facturaia.verifactu.model.RegistroFacturacion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamWriter;
import java.io.StringWriter;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class VerifactuXmlGenerator {

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    public String generarXml(RegistroFacturacion registro) {
        try {
            StringWriter sw = new StringWriter();
            XMLOutputFactory factory = XMLOutputFactory.newInstance();
            XMLStreamWriter w = factory.createXMLStreamWriter(sw);

            w.writeStartDocument("UTF-8", "1.0");
            w.writeStartElement("RegistroFacturacion");
            w.writeNamespace("", "https://www.aeat.es/Verifactu/RegistroFacturacion");

            writeElement(w, "IDRegistro", registro.getIdRegistro());
            writeElement(w, "NIFEmisor", registro.getNifEmisor());
            writeElement(w, "NombreEmisor", registro.getNombreEmisor());
            writeElement(w, "NumeroFactura", registro.getNumeroFactura());
            writeElement(w, "SerieFactura", registro.getSerieFactura());
            writeElement(w, "FechaExpedicion", registro.getFechaExpedicion() != null
                    ? registro.getFechaExpedicion().format(DATE_FMT) : null);
            writeElement(w, "FechaOperacion", registro.getFechaOperacion() != null
                    ? registro.getFechaOperacion().format(DATE_FMT) : null);

            w.writeStartElement("Receptor");
            writeElement(w, "NIFReceptor", registro.getNifReceptor());
            writeElement(w, "NombreReceptor", registro.getNombreReceptor());
            w.writeEndElement();

            w.writeStartElement("Importes");
            writeElement(w, "BaseImponible", registro.getBaseImponible().toPlainString());
            writeElement(w, "TipoImpositivo", registro.getTipoImpositivo().toPlainString());
            writeElement(w, "CuotaIVA", registro.getCuotaIVA().toPlainString());
            writeElement(w, "TotalFactura", registro.getTotalFactura().toPlainString());
            w.writeEndElement();

            writeElement(w, "DescripcionOperacion", registro.getDescripcionOperacion());
            writeElement(w, "TipoRegistro", registro.getTipoRegistro() != null
                    ? registro.getTipoRegistro().name() : "ALTA");

            w.writeStartElement("CadenaHuella");
            writeElement(w, "Huella", registro.getHuella());
            writeElement(w, "HuellaAnterior", registro.getHuellaAnterior());
            w.writeEndElement();

            writeElement(w, "FirmaElectronica", registro.getFirmaElectronica());
            writeElement(w, "Timestamp", registro.getTimestamp() != null
                    ? registro.getTimestamp().format(DATETIME_FMT) : null);

            writeElement(w, "CodigoQR", registro.getCodigoQR());

            w.writeEndElement();
            w.writeEndDocument();
            w.flush();
            w.close();

            return sw.toString();
        } catch (Exception e) {
            log.error("Error generando XML Verifactu para factura {}", registro.getNumeroFactura(), e);
            throw new RuntimeException("Error generando XML Verifactu", e);
        }
    }

    private void writeElement(XMLStreamWriter w, String name, String value) throws Exception {
        if (value != null) {
            w.writeStartElement(name);
            w.writeCharacters(value);
            w.writeEndElement();
        }
    }
}
