const crypto = require('crypto');

function calcularHuella(datosRegistro, huellaAnterior) {
  const concatenado = huellaAnterior ? datosRegistro + huellaAnterior : datosRegistro;
  return crypto.createHash('sha256').update(concatenado, 'utf8').digest('hex').toUpperCase();
}

function generarXML(registro) {
  const d = (v) => v || '';
  const f = (v) => v ? v.toISOString().split('T')[0] : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<RegistroFacturacion xmlns="https://www.aeat.es/Verifactu/RegistroFacturacion">
  <IDRegistro>${d(registro.idRegistro)}</IDRegistro>
  <NIFEmisor>${d(registro.nifEmisor)}</NIFEmisor>
  <NombreEmisor>${d(registro.nombreEmisor)}</NombreEmisor>
  <NumeroFactura>${d(registro.numeroFactura)}</NumeroFactura>
  <SerieFactura>${d(registro.serieFactura)}</SerieFactura>
  <FechaExpedicion>${f(registro.fechaExpedicion)}</FechaExpedicion>
  <Receptor>
    <NIFReceptor>${d(registro.nifReceptor)}</NIFReceptor>
    <NombreReceptor>${d(registro.nombreReceptor)}</NombreReceptor>
  </Receptor>
  <Importes>
    <BaseImponible>${registro.baseImponible || 0}</BaseImponible>
    <CuotaIVA>${registro.cuotaIVA || 0}</CuotaIVA>
    <TotalFactura>${registro.totalFactura || 0}</TotalFactura>
  </Importes>
  <TipoRegistro>ALTA</TipoRegistro>
  <CadenaHuella>
    <Huella>${d(registro.huella)}</Huella>
    <HuellaAnterior>${d(registro.huellaAnterior)}</HuellaAnterior>
  </CadenaHuella>
  <Timestamp>${new Date().toISOString()}</Timestamp>
</RegistroFacturacion>`;
}

function generarQRData(nifEmisor, numeroFactura, fechaExpedicion, importeTotal, huella) {
  const h = huella ? huella.substring(0, 16) : '';
  return `VERIFACTU|${nifEmisor}|${numeroFactura}|${fechaExpedicion}|${importeTotal}|${h}`;
}

function generarCadenaDatos(nifEmisor, numeroFactura, fechaExpedicion, importeTotal) {
  return [nifEmisor, numeroFactura, fechaExpedicion, importeTotal, 'ALTA'].join('|');
}

function firmarRSA(datos) {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  const sign = crypto.createSign('SHA256');
  sign.update(datos, 'utf8');
  sign.end();
  const firma = sign.sign(privateKey, 'base64');
  return { firma, publicKey };
}

module.exports = {
  calcularHuella,
  generarXML,
  generarQRData,
  generarCadenaDatos,
  firmarRSA,
};
