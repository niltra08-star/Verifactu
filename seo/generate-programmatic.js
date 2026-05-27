'use strict';

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const AUTONOMO_DIR = path.join(BASE_DIR, 'autonomo');
const PLANTILLAS_DIR = path.join(BASE_DIR, 'plantillas');

// ─────────────────── DATA ───────────────────

const provinces = [
  { slug: 'alava', name: 'Alava' },
  { slug: 'albacete', name: 'Albacete' },
  { slug: 'alicante', name: 'Alicante' },
  { slug: 'almeria', name: 'Almeria' },
  { slug: 'asturias', name: 'Asturias' },
  { slug: 'avila', name: 'Avila' },
  { slug: 'badajoz', name: 'Badajoz' },
  { slug: 'baleares', name: 'Baleares' },
  { slug: 'barcelona', name: 'Barcelona' },
  { slug: 'burgos', name: 'Burgos' },
  { slug: 'caceres', name: 'Caceres' },
  { slug: 'cadiz', name: 'Cadiz' },
  { slug: 'cantabria', name: 'Cantabria' },
  { slug: 'castellon', name: 'Castellon' },
  { slug: 'ceuta', name: 'Ceuta' },
  { slug: 'ciudad-real', name: 'Ciudad Real' },
  { slug: 'cordoba', name: 'Cordoba' },
  { slug: 'cuenca', name: 'Cuenca' },
  { slug: 'girona', name: 'Girona' },
  { slug: 'granada', name: 'Granada' },
  { slug: 'guadalajara', name: 'Guadalajara' },
  { slug: 'guipuzcoa', name: 'Guipuzcoa' },
  { slug: 'huelva', name: 'Huelva' },
  { slug: 'huesca', name: 'Huesca' },
  { slug: 'jaen', name: 'Jaen' },
  { slug: 'la-coruna', name: 'La Coruna' },
  { slug: 'la-rioja', name: 'La Rioja' },
  { slug: 'las-palmas', name: 'Las Palmas' },
  { slug: 'leon', name: 'Leon' },
  { slug: 'lerida', name: 'Lerida' },
  { slug: 'lugo', name: 'Lugo' },
  { slug: 'madrid', name: 'Madrid' },
  { slug: 'malaga', name: 'Malaga' },
  { slug: 'melilla', name: 'Melilla' },
  { slug: 'murcia', name: 'Murcia' },
  { slug: 'navarra', name: 'Navarra' },
  { slug: 'orense', name: 'Orense' },
  { slug: 'palencia', name: 'Palencia' },
  { slug: 'pontevedra', name: 'Pontevedra' },
  { slug: 'salamanca', name: 'Salamanca' },
  { slug: 'segovia', name: 'Segovia' },
  { slug: 'sevilla', name: 'Sevilla' },
  { slug: 'soria', name: 'Soria' },
  { slug: 'tarragona', name: 'Tarragona' },
  { slug: 'tenerife', name: 'Tenerife' },
  { slug: 'teruel', name: 'Teruel' },
  { slug: 'toledo', name: 'Toledo' },
  { slug: 'valencia', name: 'Valencia' },
  { slug: 'valladolid', name: 'Valladolid' },
  { slug: 'vizcaya', name: 'Vizcaya' },
  { slug: 'zamora', name: 'Zamora' },
  { slug: 'zaragoza', name: 'Zaragoza' }
];

const professions = [
  { slug: 'disenador-grafico', name: 'Disenador Grafico', fem: false },
  { slug: 'programador-informatico', name: 'Programador Informatico', fem: false },
  { slug: 'abogado', name: 'Abogado', fem: false },
  { slug: 'arquitecto', name: 'Arquitecto', fem: false },
  { slug: 'consultor', name: 'Consultor', fem: false },
  { slug: 'traductor', name: 'Traductor', fem: false },
  { slug: 'fotografo', name: 'Fotografo', fem: false },
  { slug: 'community-manager', name: 'Community Manager', fem: false },
  { slug: 'profesor-particular', name: 'Profesor Particular', fem: false },
  { slug: 'entrenador-personal', name: 'Entrenador Personal', fem: false },
  { slug: 'fontanero', name: 'Fontanero', fem: false },
  { slug: 'electricista', name: 'Electricista', fem: false },
  { slug: 'psicologo', name: 'Psicologo', fem: false },
  { slug: 'nutricionista', name: 'Nutricionista', fem: false },
  { slug: 'administrativo', name: 'Administrativo', fem: false },
  { slug: 'agente-inmobiliario', name: 'Agente Inmobiliario', fem: false },
  { slug: 'ingeniero', name: 'Ingeniero', fem: false },
  { slug: 'periodista', name: 'Periodista', fem: false },
  { slug: 'agente-seguros', name: 'Agente de Seguros', fem: false },
  { slug: 'tecnico-informatico', name: 'Tecnico Informatico', fem: false },
  { slug: 'cerrajero', name: 'Cerrajero', fem: false },
  { slug: 'pintor', name: 'Pintor', fem: false },
  { slug: 'jardinero', name: 'Jardinero', fem: false },
  { slug: 'transportista', name: 'Transportista', fem: false },
  { slug: 'limpiador', name: 'Limpiador', fem: false }
];

const invoiceTypes = [
  { slug: 'factura-servicios', name: 'Factura de Servicios' },
  { slug: 'factura-productos', name: 'Factura de Productos' },
  { slug: 'factura-alquiler', name: 'Factura de Alquiler' },
  { slug: 'factura-simplificada', name: 'Factura Simplificada' },
  { slug: 'factura-completa', name: 'Factura Completa' },
  { slug: 'factura-intracomunitaria', name: 'Factura Intracomunitaria' },
  { slug: 'factura-exportacion', name: 'Factura de Exportacion' },
  { slug: 'factura-rectificativa', name: 'Factura Rectificativa' },
  { slug: 'factura-recibo', name: 'Factura Recibo' },
  { slug: 'factura-presupuesto', name: 'Factura Presupuesto' },
  { slug: 'factura-ingresos-varios', name: 'Factura de Ingresos Varios' },
  { slug: 'factura-transporte', name: 'Factura de Transporte' }
];

// ─────────────────── HELPERS ───────────────────

function esc(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  Created directory: ${dir}`);
  }
}

// ─────────────────── JSON-LD ───────────────────

function jsonLDBreadcrumb(items) {
  const listItems = items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: 'https://facturaia.app' + item.url
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: listItems
  });
}

function jsonLDSoftwareApp(name, description, url) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FacturaIA',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR'
    },
    description: 'Software de facturacion 100% gratuito y open source compatible con VeriFactu para autonomos espanoles.',
    url: 'https://facturaia.app'
  });
}

// ─────────────────── CONTENT GENERATORS ───────────────────

const provinceSectors = {
  'madrid': 'servicios financieros, tecnologia, consultoria y comercio',
  'barcelona': 'tecnologia, diseno, turismo y comercio internacional',
  'valencia': 'agricultura de exportacion, tecnologia, turismo y logistica portuaria',
  'sevilla': 'turismo, agroalimentacion, logistica aeroespacial y servicios',
  'malaga': 'turismo, tecnologia (Malaga Valley), servicios digitales y construccion',
  'bilbao': 'industria, tecnologia, ingenieria y servicios financieros',
  'zaragoza': 'logistica, industria automovilistica, agroalimentacion y energias renovables',
  'murcia': 'agricultura intensiva, logistica de exportacion, turismo y construccion',
  'baleares': 'turismo, hosteleria, servicios nauticos y construccion',
  'las-palmas': 'turismo, comercio internacional, servicios portuarios y tecnologia',
  'tenerife': 'turismo, servicios audiovisuales, comercio y energia',
  'alicante': 'turismo residencial, servicios, calzado y juguete',
  'cadiz': 'turismo, industria naval, aeronautica y vitivinicultura',
  'granada': 'turismo cultural, agroalimentacion, tecnologia y educacion',
  'cordoba': 'joyeria, agroalimentacion, turismo patrimonial y logistica',
  'toledo': 'logistica, artesania, turismo y agricultura',
  'valladolid': 'industria automovilistica, agroalimentacion, logistica y energia',
  'girona': 'turismo, industria carnica, tecnologia y agricultura',
  'tarragona': 'industria quimica, turismo, energia y logistica portuaria',
  'la-coruna': 'textil (Inditex), pesca, logistica portuaria y energia eolica',
  'pontevedra': 'pesca, automocion, turismo y construccion naval',
  'vizcaya': 'industria siderurgica, tecnologia, finanzas y servicios',
  'guipuzcoa': 'industria manufacturera, ingenieria, maquina-herramienta y tecnologia',
  'navarra': 'energias renovables, industria automovilistica, agroalimentacion y maquinaria',
  'cantabria': 'industria quimica, turismo, ganaderia y pesca',
  'asturias': 'siderurgia, turismo rural, agroalimentacion y tecnologia',
  'la-rioja': 'vitivinicultura, calzado, agroalimentacion y turismo enologico',
  'burgos': 'industria automovilistica, agroalimentacion, logistica y energia',
  'leon': 'agroalimentacion, mineria, turismo rural y farmacia',
  'salamanca': 'turismo universitario, agroalimentacion, servicios y ganaderia',
  'zamora': 'agroalimentacion, turismo rural, energia y artesania',
  'soria': 'agroalimentacion, turismo rural, energia eolica y micologia',
  'segovia': 'turismo patrimonial, agroalimentacion, industria carnica y servicios',
  'avila': 'turismo, agroalimentacion, industria carnica y servicios',
  'palencia': 'agroalimentacion, industria automovilistica, energia y turismo',
  'alava': 'industria automovilistica, aeronautica, logistica y vitivinicultura',
  'huesca': 'turismo de montana, agroalimentacion, energia y deportes de nieve',
  'teruel': 'turismo rural, agroalimentacion, energia y logistica',
  'jaen': 'oleicultura, turismo rural, industria y energia',
  'almeria': 'agricultura intensiva bajo plastico, turismo, industria auxiliar y energia solar',
  'huelva': 'agricultura de exportacion (frutos rojos), turismo, pesca y mineria',
  'albacete': 'cuchilleria, agroalimentacion, aeronautica y logistica',
  'ciudad-real': 'agroalimentacion, vitivinicultura, energia y turismo',
  'cuenca': 'turismo rural, agroalimentacion, madera y artesania',
  'guadalajara': 'logistica, industria, tecnologia y servicios empresariales',
  'caceres': 'agroalimentacion, turismo rural, energia y servicios',
  'badajoz': 'agroalimentacion, industria transformadora, logistica y energia',
  'orense': 'termalismo, agroalimentacion, turismo y vitivinicultura',
  'lugo': 'ganaderia, agroalimentacion, turismo rural y madera',
  'castellon': 'ceramica, turismo, agroalimentacion y energia',
  'ceuta': 'comercio transfronterizo, servicios portuarios, hosteleria y administracion publica',
  'melilla': 'comercio, servicios, hosteleria, administracion publica y construccion',
  'lerida': 'agroalimentacion (fruta dulce), turismo de montana, ganaderia y energia'
};

function provinceContent(province) {
  const name = province.name;
  const sectors = provinceSectors[province.slug] || 'servicios, comercio, hosteleria y construccion';

  const gestoriasPool = [
    `En ${name} encontraras despachos como ${name} Asesoria, Ges${name.slice(0, 4)} Consultores y numerosas gestorias especializadas en autonomos que pueden ayudarte con altas, bajas, modelos trimestrales y declaracion de la renta. Muchas ofrecen la primera consulta gratuita.`,
    `Las gestorias en ${name} estan acostumbradas a trabajar con autonomos de sectores como ${sectors}. Servicios como Asesoria ${name}, ${name} Fiscal o despachos online con sede en la provincia te ayudaran con los tramites.`,
    `${name} cuenta con una amplia red de gestorias administrativas. Algunas como ${name.slice(0, 4)}Gestion, ${name} Asesores o consultorias especializadas en EPIGRAFES IAE te ofrecen paquetes especificos para autonomos desde 30EUR al mes.`
  ];

  const coworkingPool = [
    `Si buscas espacio de trabajo, ${name} dispone de coworkings como Impact Hub ${name}, WorkCenter ${name} o espacios colaborativos en el centro donde podras conectar con otros autonomos.`,
    `El ecosistema emprendedor en ${name} incluye espacios como ${name} Coworking, centros de negocios y espacios de la red de Camaras de Comercio con servicios para autonomos.`,
    `En ${name} el coworking ha crecido notablemente. Encontraras espacios como ${name.slice(0, 5)}Work, centros colaborativos y viveros de empresas de la Diputacion de ${name}.`
  ];

  const iaeNote = `El Impuesto de Actividades Economicas (IAE) en ${name} se aplica igual que en el resto del territorio comun. Si tus ingresos netos no superan el millon de euros anuales, estas exento. El epigrafe del IAE dependera de tu actividad concreta: profesionales liberales (seccion 2) o actividades empresariales (seccion 1). Consulta con tu gestoria o en la AEAT el epigrafe exacto que te corresponde en ${name}.`;

  const veriFactuNote = `La obligacion VeriFactu aplica por igual en ${name} que en cualquier otra provincia espanola. A partir de 2027 todos los sistemas de facturacion deberan cumplir con los requisitos tecnicos de remision a la AEAT. FacturaIA ya esta preparado para generar facturas VeriFactu compatibles en ${name} sin coste adicional.`;

  const localEnv = `El entorno empresarial en ${name} se caracteriza por su actividad en ${sectors}. Ser autonomo aqui tiene ventajas como una red de networking activa, eventos de emprendimiento y un coste de vida que te permite arrancar con menos presion financiera. Las ayudas al autonomo en ${name} incluyen la tarifa plana estatal, subvenciones de la comunidad autonoma y en algunos casos ayudas municipales para nuevos emprendedores.`;

  const content = `
<p>Ser autonomo en <strong>${name}</strong> tiene sus particularidades. Si acabas de darte de alta o llevas tiempo facturando, conocer el entorno local, las gestorias disponibles y las obligaciones fiscales en ${name} te ayudara a tomar mejores decisiones para tu negocio.</p>

<h2>Darse de alta como autonomo en ${name}</h2>
<p>El proceso para darte de alta como autonomo en ${name} sigue el mismo procedimiento que en el resto de Espana: alta en Hacienda (modelo 036/037), alta en la Seguridad Social y, si tu actividad lo requiere, licencia de apertura en el ayuntamiento de ${name}.</p>
<p>La cuota de autonomos en 2026 parte de unos 86EUR mensuales durante los 12 primeros meses si te acoges a la tarifa plana. A partir del segundo ano, la cuota se ajusta segun tus rendimientos netos, en tramos que van desde 230EUR hasta 500EUR mensuales para los ingresos mas altos. Los autonomos de ${name} se benefician de las mismas bonificaciones estatales que el resto del territorio.</p>

<h2>Gestorias y asesoria fiscal en ${name}</h2>
${gestoriasPool[provinces.indexOf(province) % 3]}
<p>Una buena gestoria en ${name} te ahorrara tiempo y errores con los modelos 303 (IVA), 130 (IRPF), 390 (resumen anual) y la declaracion de la renta. El coste medio de una gestoria para autonomos en ${name} ronda entre 35EUR y 70EUR mensuales, dependiendo del volumen de facturas y la complejidad de tu actividad.</p>

<h2>Obligaciones fiscales comunes</h2>
<p>Como autonomo en ${name} estas obligado a presentar declaraciones trimestrales de IVA e IRPF, ademas del resumen anual. Si facturas a empresas, deberas aplicar retenciones de IRPF (generalmente del 7% para nuevos autonomos, 15% a partir del tercer ano). El IVA se liquida trimestralmente (21% general, 10% reducido, 4% superreducido) segun tu actividad en ${name}.</p>

<h2>Epigrafes de IAE en ${name}</h2>
${iaeNote}

<h2>VeriFactu: facturacion digital obligatoria para autonomos de ${name}</h2>
${veriFactuNote}

<h2>Coworking y espacios para autonomos en ${name}</h2>
${coworkingPool[provinces.indexOf(province) % 3]}

<h2>Ayudas y subvenciones para autonomos en ${name}</h2>
<p>Ademas de la tarifa plana estatal, en ${name} puedes acceder a ayudas autonomicas para el inicio de actividad, subvenciones para digitalizacion (Kit Digital), bonificaciones por conciliacion familiar y programas de apoyo al emprendimiento femenino. Consulta en la Camara de Comercio de ${name} y en el portal de ayudas de tu comunidad autonoma las convocatorias vigentes.</p>

<h2>Como FacturaIA ayuda a los autonomos de ${name}</h2>
<p>FacturaIA es un software 100% gratuito y open source que te permite crear facturas profesionales, cumplir con VeriFactu, gestionar clientes y controlar tus ingresos sin pagar un euro. Para autonomos de ${name}, FacturaIA incluye:</p>
<ul>
<li>Facturas ilimitadas con todos los campos obligatorios de la AEAT</li>
<li>Calculo automatico de IVA e IRPF segun tu actividad</li>
<li>Exportacion a formato FacturaE para administraciones publicas</li>
<li>Compatible con la normativa VeriFactu desde el primer dia</li>
<li>100% gratuito, sin limites, sin tarjeta de credito</li>
</ul>

<h2>Preguntas frecuentes sobre ser autonomo en ${name}</h2>
<div class="faq-item">
<h3>Cuanto cuesta darse de alta como autonomo en ${name}?</h3>
<p>El alta en Hacienda y Seguridad Social es gratuita. La cuota mensual minima ronda los 86EUR con tarifa plana el primer ano. Algunas gestorias en ${name} te ofrecen paquetes de alta desde 50EUR en un pago unico.</p>
</div>
<div class="faq-item">
<h3>Necesito una gestoria en ${name} o puedo llevarlo yo mismo?</h3>
<p>Legalmente puedes llevar tu propia contabilidad como autonomo. Sin embargo, una gestoria en ${name} te evitara errores costosos con Hacienda y te ahorrara tiempo. Muchos autonomos optan por usar FacturaIA para la facturacion y contratar una gestoria solo para las declaraciones trimestrales.</p>
</div>
`;
  return content;
}

const professionDetails = {
  'disenador-grafico': { services: 'Diseno de logotipos, identidad corporativa, material publicitario, diseno web, packaging, ilustracion digital y maquetacion editorial.', typicalRate: '30EUR-60EUR/hora', expenses: 'Equipo informatico (Mac/PC), suscripciones de software (Adobe Creative Cloud, Figma), monitor calibrado, tabletas graficas, formacion en diseno y tipografias.', ivaRet: '21% IVA, 7% IRPF para nuevos autonomos' },
  'programador-informatico': { services: 'Desarrollo de software a medida, aplicaciones web y moviles, consultoria tecnica, mantenimiento de sistemas, integracion de APIs y migracion de datos.', typicalRate: '40EUR-80EUR/hora', expenses: 'Ordenador de alto rendimiento, servidores cloud (AWS, DigitalOcean), licencias de software (IDE, herramientas de desarrollo), formacion continua, asistencia a conferencias tech.', ivaRet: '21% IVA, 7% IRPF para nuevos autonomos' },
  'abogado': { services: 'Asesoria legal, redaccion de contratos, defensa procesal, derecho mercantil, civil, laboral y administrativo.', typicalRate: '80EUR-150EUR/hora', expenses: 'Suscripciones a bases de datos juridicas (Aranzadi, La Ley), cuotas colegiales, alquiler de despacho, formacion continua, seguro de responsabilidad civil profesional.', ivaRet: '21% IVA, 15% IRPF (7% primeros 3 anos)' },
  'arquitecto': { services: 'Proyectos de edificacion, reformas, certificaciones energeticas, direccion de obra, interiorismo y consultoria urbanistica.', typicalRate: '50EUR-90EUR/hora', expenses: 'Licencias BIM/Revit/AutoCAD, visados colegiales, equipos de medicion, seguro de responsabilidad civil, formacion en normativa y eficiencia energetica.', ivaRet: '21% IVA, 7% IRPF para nuevos autonomos' },
  'consultor': { services: 'Consultoria estrategica, analisis de negocio, optimizacion de procesos, transformacion digital, marketing y recursos humanos.', typicalRate: '50EUR-100EUR/hora', expenses: 'Portatil, software de analisis y presentaciones, gastos de viaje y desplazamiento a clientes, formacion especializada, suscripciones a informes sectoriales.', ivaRet: '21% IVA, 7% IRPF' },
  'traductor': { services: 'Traduccion jurada y tecnica, interpretacion, revision y correccion de textos, localizacion de software, subtitulado y transcreacion.', typicalRate: '0.08EUR-0.15EUR/palabra', expenses: 'Software TAO (Trados, MemoQ), diccionarios especializados, ordenador, formacion linguistica continua, suscripciones a glosarios terminologicos.', ivaRet: '21% IVA, 7% IRPF' },
  'fotografo': { services: 'Fotografia de eventos, bodas, retratos, fotografia comercial, fotografia de producto y edicion digital avanzada.', typicalRate: '50EUR-120EUR/hora', expenses: 'Camaras y objetivos, equipo de iluminacion, software de edicion (Lightroom, Photoshop), discos duros y almacenamiento cloud, seguro de equipo, mantenimiento y calibracion.', ivaRet: '21% IVA, 7% IRPF' },
  'community-manager': { services: 'Gestion de redes sociales, creacion de contenido, estrategia digital, analisis de metricas, gestion de comunidades online y publicidad en redes.', typicalRate: '25EUR-50EUR/hora', expenses: 'Portatil, smartphone, suscripciones a herramientas (Metricool, Hootsuite, Canva Pro), formacion en marketing digital, publicidad para pruebas A/B.', ivaRet: '21% IVA, 7% IRPF' },
  'profesor-particular': { services: 'Clases de refuerzo escolar, idiomas, musica, preparacion de oposiciones, formacion en habilidades especificas. Presencial u online.', typicalRate: '15EUR-30EUR/hora', expenses: 'Material didactico, plataforma de videoconferencia, desplazamientos a domicilio, libros y recursos educativos, licencias de software educativo.', ivaRet: 'Exento de IVA si es ensenanza reglada; 21% si no. 7% IRPF.' },
  'entrenador-personal': { services: 'Entrenamiento personalizado, planes de nutricion deportiva, clases dirigidas, asesoria online, preparacion fisica para competiciones.', typicalRate: '30EUR-60EUR/sesion', expenses: 'Material deportivo, alquiler de espacio en gimnasio, formacion y certificaciones, seguro de responsabilidad civil, ropa deportiva profesional.', ivaRet: '21% IVA, 7% IRPF' },
  'fontanero': { services: 'Reparacion e instalacion de fontaneria, calefaccion, gas, aire acondicionado, mantenimiento de calderas, desatascos y urgencias 24h.', typicalRate: '30EUR-50EUR/hora + desplazamiento', expenses: 'Herramientas especializadas, furgoneta, combustible, material consumible (tuberias, valvulas), EPIs, seguro de responsabilidad civil.', ivaRet: '21% IVA, 1% IRPF (modulos)' },
  'electricista': { services: 'Instalaciones electricas, mantenimiento industrial y domestico, certificaciones (boletin), domotica, iluminacion LED y energia solar.', typicalRate: '35EUR-55EUR/hora', expenses: 'Herramientas de diagnostico, furgoneta, material electrico, EPIs, seguro, formacion en normativa de baja tension (REBT).', ivaRet: '21% IVA, 1% IRPF (modulos posible)' },
  'psicologo': { services: 'Terapia individual y de pareja, evaluacion psicologica, orientacion vocacional, terapia online, informes periciales y formacion en salud mental.', typicalRate: '40EUR-70EUR/sesion', expenses: 'Alquiler de consulta, plataforma de videoterapia, tests psicometricos, formacion continua, supervision clinica, seguro de responsabilidad civil.', ivaRet: 'Exento de IVA (servicios sanitarios). 7% IRPF.' },
  'nutricionista': { services: 'Planes nutricionales personalizados, consulta online y presencial, nutricion deportiva, educacion alimentaria, talleres y formacion en empresas.', typicalRate: '35EUR-65EUR/consulta', expenses: 'Consulta o coworking sanitario, software de calculo nutricional, material didactico, formacion continua, balanza de bioimpedancia.', ivaRet: 'Exento de IVA (servicios sanitarios). 7% IRPF.' },
  'administrativo': { services: 'Gestion documental, facturacion, atencion al cliente, gestion de agenda, tramites administrativos, soporte a gestorias y back-office para empresas.', typicalRate: '15EUR-25EUR/hora', expenses: 'Portatil, software ofimatico, impresora, telefono movil, formacion en herramientas de gestion (ERP, CRM).', ivaRet: '21% IVA, 7% IRPF' },
  'agente-inmobiliario': { services: 'Intermediacion en compraventa y alquiler, tasaciones, asesoramiento hipotecario, gestion de patrimonio, captacion de inmuebles.', typicalRate: '3%-5% comision sobre operacion', expenses: 'Despacho o coworking, portales inmobiliarios (Idealista, Fotocasa), fotografo profesional, telefono, vehiculo, formacion API.', ivaRet: '21% IVA (servicios a particulares y empresas). 7% IRPF.' },
  'ingeniero': { services: 'Proyectos tecnicos, calculo de estructuras, direccion de obra, consultoria tecnica, peritaciones, informes y certificaciones industriales.', typicalRate: '45EUR-85EUR/hora', expenses: 'Licencias de software CAD/CAE, equipos de medicion, visados colegiales, seguro de responsabilidad civil, formacion continua.', ivaRet: '21% IVA, 7% IRPF' },
  'periodista': { services: 'Redaccion de articulos, reportajes, notas de prensa, copywriting, gestion de contenidos, consultoria de comunicacion y ghostwriting.', typicalRate: '0.10EUR-0.30EUR/palabra o 25EUR-45EUR/hora', expenses: 'Portatil, grabadora, smartphone, suscripciones a medios y agencias, formacion, desplazamientos para cobertura de eventos.', ivaRet: '21% IVA, 7% IRPF' },
  'agente-seguros': { services: 'Asesoramiento en seguros de vida, hogar, automovil, salud, empresas; gestion de siniestros, comparativa de polizas y renovaciones.', typicalRate: 'Comision 5%-20% sobre prima', expenses: 'Despacho, CRM especializado, telefono, vehiculo para visitas, formacion continua en productos aseguradores, registro en la DGSFP.', ivaRet: 'Exento de IVA (seguros). 7% IRPF.' },
  'tecnico-informatico': { services: 'Reparacion y mantenimiento de equipos, instalacion de redes, soporte IT a empresas, recuperacion de datos, ciberseguridad basica.', typicalRate: '30EUR-50EUR/hora', expenses: 'Herramientas de diagnostico, componentes y repuestos, vehiculo para desplazamientos, software de soporte remoto, formacion en ciberseguridad.', ivaRet: '21% IVA, 1-7% IRPF segun estimacion directa o modulos' },
  'cerrajero': { services: 'Apertura de puertas 24h, instalacion y reparacion de cerraduras, cerrajeria de seguridad, puertas blindadas, copia de llaves y sistemas de acceso.', typicalRate: '40EUR-70EUR/servicio + urgencias', expenses: 'Herramientas de cerrajeria, furgoneta, combustible, stock de cerraduras y cilindros, seguro de responsabilidad civil, formacion en nuevas tecnologias de seguridad.', ivaRet: '21% IVA, 1% IRPF (modulos estimados)' },
  'pintor': { services: 'Pintura interior y exterior, decoracion, empapelado, tratamientos de fachadas, pintura industrial, lacado de muebles y rehabilitacion.', typicalRate: '15EUR-25EUR/m2 o 25EUR-40EUR/hora', expenses: 'Herramientas de pintura (rodillos, pistolas), furgoneta, material consumible (pintura, disolventes, cintas), EPIs, seguro.', ivaRet: '21% IVA, 1% IRPF (modulos frecuente)' },
  'jardinero': { services: 'Mantenimiento de jardines, diseno paisajistico, poda, instalacion de riego automatico, fitosanitarios, servicios para comunidades y empresas.', typicalRate: '15EUR-25EUR/hora o presupuesto cerrado', expenses: 'Herramientas de jardineria (cortacesped, motosierra, desbrozadora), furgoneta, combustible, plantas y fitosanitarios, EPIs, seguro.', ivaRet: '21% IVA (10% en algunos servicios), 1% IRPF' },
  'transportista': { services: 'Transporte de mercancias, mensajeria, mudanzas, distribucion de ultima milla, portes nacionales e internacionales, logistica.', typicalRate: '0.45EUR-0.80EUR/km o tarifa por servicio', expenses: 'Vehiculo o camion, combustible, mantenimiento, seguro de flota, tacografo, tarjeta de transporte, peajes, GPS.', ivaRet: '21% IVA, 1% IRPF (modulos por tonelaje)' },
  'limpiador': { services: 'Limpieza domestica, limpieza de oficinas, limpieza de comunidades, limpieza post-obra, limpieza de cristales, servicios a empresas.', typicalRate: '10EUR-18EUR/hora', expenses: 'Productos de limpieza, maquinaria (aspiradoras, hidrolimpiadoras), EPIs, desplazamientos, seguro, formacion en productos y tecnicas.', ivaRet: '21% IVA (10% en comunidades), 1% IRPF' }
};

function professionContent(prof) {
  const d = professionDetails[prof.slug] || {
    services: 'Servicios profesionales especializados, asesoria, ejecucion de proyectos y atencion personalizada a clientes.',
    typicalRate: 'Tarifa variable segun proyecto',
    expenses: 'Equipo profesional, formacion, herramientas digitales y gastos de explotacion habituales del sector.',
    ivaRet: '21% IVA, 7% IRPF para nuevos autonomos'
  };

  const paragraphs = [
    `<p>Si eres <strong>${prof.name}</strong> autonomo, sabras que la facturacion es una parte esencial de tu actividad profesional. Emitir facturas correctas, con los impuestos bien calculados y cumpliendo la normativa VeriFactu, no solo es una obligacion legal: es la base para tener un negocio sano y profesional.</p>`,

    `<p>Los <strong>${prof.name.toLowerCase()}s autonomos</strong> en Espana ofrecen servicios como: ${d.services} La facturacion de estos servicios requiere atencion al detalle, especialmente en la aplicacion correcta del IVA y las retenciones de IRPF.</p>`,

    `<p>En cuanto a tarifas, un ${prof.name.toLowerCase()} autonomo en Espana suele facturar entre ${d.typicalRate}. Por supuesto, esto depende de tu experiencia, especializacion y el tipo de cliente (empresas, particulares, administracion publica). Llevar un control riguroso de tus facturas emitidas te permitira analizar tu rentabilidad real y ajustar precios.</p>`,

    `<p>Los gastos deducibles mas habituales para un ${prof.name.toLowerCase()} autonomo incluyen: ${d.expenses} Recuerda que para que un gasto sea deducible debe estar correctamente facturado, relacionado con tu actividad y registrado en tu libro de gastos.</p>`,

    `<p>La tributacion de un ${prof.name.toLowerCase()} autonomo se basa en: ${d.ivaRet} Presentar correctamente los modelos 303 (IVA) y 130 (IRPF) cada trimestre, asi como el modelo 390 (resumen anual), es fundamental para evitar sanciones de la AEAT.</p>`,

    `<p>Como ${prof.name.toLowerCase()} autonomo, tambien debes considerar el alta en el IAE (epigrafe correspondiente), el seguro de responsabilidad civil si tu profesion lo requiere, y estar al tanto de tus obligaciones con la Agencia de Proteccion de Datos si manejas datos de clientes.</p>`,

    `<p>La facturacion digital con VeriFactu afecta a todos los autonomos, incluidos los ${prof.name.toLowerCase()}s. A partir de 2027, todos los sistemas de facturacion deberan cumplir con los requisitos tecnicos de remision a la AEAT. FacturaIA ya esta preparado para esta normativa y genera facturas VeriFactu compatibles 100% gratis.</p>`,

    `<p>Muchos ${prof.name.toLowerCase()}s combinan clientes recurrentes con proyectos puntuales. Es habitual emitir facturas mensuales por servicios continuados (como mantenimiento o consultoria) y facturas unicas por proyectos concretos. Tener un software de facturacion agil te permite generar ambos tipos en segundos.</p>`,

    `<p>Si estas empezando como ${prof.name.toLowerCase()} autonomo, te recomendamos: 1) Date de alta con la tarifa plana (86EUR/mes el primer ano), 2) Contrata una gestoria al menos para los primeros trimestres, 3) Usa FacturaIA para emitir facturas gratis desde el dia uno, 4) Guarda todas tus facturas y tickets de gastos digitalizados, 5) Reserva un 20% de cada factura para el pago trimestral de impuestos.</p>`
  ];

  const content = `
<h2>La importancia de una facturacion profesional para ${prof.name}s</h2>
${paragraphs[0]}

<h2>Servicios habituales de un ${prof.name} autonomo</h2>
${paragraphs[1]}

<h2>Tarifas orientativas para ${prof.name}s autonomos</h2>
${paragraphs[2]}

<h2>Gastos deducibles para ${prof.name}s autonomos</h2>
${paragraphs[3]}

<h2>Impuestos: IVA, IRPF y obligaciones fiscales</h2>
${paragraphs[4]}

<h2>Obligaciones legales adicionales</h2>
${paragraphs[5]}

<h2>Facturacion digital y VeriFactu para ${prof.name}s</h2>
${paragraphs[6]}

<h2>Facturacion recurrente vs facturacion puntual</h2>
${paragraphs[7]}

<h2>Consejos para ${prof.name}s que empiezan como autonomos</h2>
${paragraphs[8]}

<h2>Como FacturaIA ayuda a los ${prof.name}s autonomos</h2>
<p>FacturaIA es el software de facturacion 100% gratuito y open source disenado para autonomos espanoles. Como ${prof.name.toLowerCase()} autonomo, FacturaIA te permite:</p>
<ul>
<li>Crear facturas profesionales en segundos con los campos obligatorios de la AEAT</li>
<li>Calcular automaticamente IVA e IRPF segun tu tipo de actividad</li>
<li>Gestionar tu cartera de clientes y su historial de facturacion</li>
<li>Generar facturas en formato FacturaE para administraciones publicas</li>
<li>Cumplir con la normativa VeriFactu sin coste adicional</li>
<li>Software 100% gratuito, sin limites de facturas, sin tarjeta de credito</li>
</ul>

<h2>Preguntas frecuentes sobre facturacion para ${prof.name}s</h2>
<div class="faq-item">
<h3>Que IVA deben aplicar los ${prof.name.toLowerCase()}s autonomos?</h3>
<p>${d.ivaRet} La mayoria de servicios profesionales tributan al 21% de IVA, salvo excepciones como servicios sanitarios o educativos que pueden estar exentos. Si facturas a empresas, deberas incluir retencion de IRPF.</p>
</div>
<div class="faq-item">
<h3>Puedo hacer facturas como ${prof.name.toLowerCase()} sin estar dado de alta como autonomo?</h3>
<p>Legalmente puedes facturar sin ser autonomo si es una actividad esporadica y tus ingresos no superan el Salario Minimo Interprofesional (SMI). Sin embargo, si es tu actividad habitual, deberas darte de alta. Consulta con una gestoria tu caso concreto.</p>
</div>
<div class="faq-item">
<h3>Cuanto cuesta un software de facturacion para ${prof.name}s?</h3>
<p>FacturaIA es completamente gratuito. Otras alternativas en el mercado cobran entre 10EUR y 40EUR al mes. Con FacturaIA no pagas nada: facturas ilimitadas, clientes ilimitados y cumplimiento VeriFactu incluido.</p>
</div>
`;
  return content;
}

const invoiceTypeData = {
  'factura-servicios': { whenToUse: 'Prestacion de servicios profesionales como consultoria, diseno, formacion, reparaciones, asesoria y cualquier trabajo donde el valor principal no es un producto fisico sino el trabajo, conocimiento o tiempo dedicado.', mandatoryFields: 'Datos del emisor y receptor, numero y serie de factura, fecha de emision y de prestacion del servicio, descripcion detallada del servicio, base imponible, tipo de IVA (generalmente 21%), cuota de IVA, retencion de IRPF si aplica, y total factura.', example: 'Un disenador grafico emite una factura de servicios a una agencia de marketing por el diseno de 3 banners publicitarios y un logo corporativo.' },
  'factura-productos': { whenToUse: 'Venta de productos fisicos como mercancias, materiales, equipos, inventario, stock. La diferencia clave con la factura de servicios es que describes unidades fisicas, cantidades y precio unitario.', mandatoryFields: 'Datos fiscales, numero y serie, fecha, descripcion del producto con cantidad y precio unitario, base imponible, IVA (generalmente 21%), total. Si hay transporte asociado puede incluirse como linea separada.', example: 'Una tienda de material de oficina vende 50 paquetes de folios y 10 cartuchos de tinta a una empresa.' },
  'factura-alquiler': { whenToUse: 'Arrendamiento de bienes inmuebles (locales comerciales, oficinas, viviendas) o bienes muebles (maquinaria, vehiculos, equipos). El arrendamiento de vivienda esta exento de IVA, mientras que el de locales comerciales lleva IVA.', mandatoryFields: 'Identificacion del inmueble o bien arrendado (referencia catastral si es inmueble), periodo de alquiler, importe mensual/anual, IVA (si aplica: 21% locales comerciales, exento vivienda habitual), retencion si es arrendamiento de local de negocio (19%).', example: 'El propietario de un local comercial factura el alquiler mensual de 800EUR + IVA a la empresa inquilina.' },
  'factura-simplificada': { whenToUse: 'Sustituye al antiguo ticket. Se usa para importes inferiores a 400EUR (IVA incluido), ventas al por menor, servicios de hosteleria, comercio minorista y cuando el cliente es un particular que no necesita factura completa.', mandatoryFields: 'Numero y serie, fecha, identificacion del emisor, descripcion generica de la operacion, tipo de IVA aplicable (o "IVA incluido"), y total. No necesita datos del receptor ni desglose detallado del IVA.', example: 'Una cafeteria emite tickets simplificados a sus clientes por los desayunos servidos durante la manana.' },
  'factura-completa': { whenToUse: 'Operaciones entre empresas o autonomos (B2B), cuando el cliente lo solicita para deducirse el IVA, operaciones intracomunitarias y en general siempre que el receptor necesite justificar fiscalmente el gasto.', mandatoryFields: 'Todos los datos del emisor y receptor (NIF, nombre, direccion), numero y serie, fecha, descripcion detallada, base imponible, tipo y cuota de IVA, retenciones, total. Es la factura mas completa que exige la AEAT.', example: 'Un autonomo programador emite una factura completa a una SL por el desarrollo de una aplicacion web.' },
  'factura-intracomunitaria': { whenToUse: 'Operaciones entre empresas o autonomos de diferentes paises de la Union Europea. El IVA no se repercute si el receptor tiene un NIF-IVA intracomunitario valido (inversion del sujeto pasivo).', mandatoryFields: 'NIF-IVA del emisor y del receptor (validado en VIES), numero y serie, fecha, descripcion de la operacion, base imponible, referencia a la Directiva 2006/112/CE o articulo 69/70/71 LIVA. No lleva IVA repercutido. Obligatorio modelo 349.', example: 'Un autonomo espanol vende servicios de traduccion a una empresa alemana con NIF-IVA valido.' },
  'factura-exportacion': { whenToUse: 'Venta de bienes o servicios a paises fuera de la Union Europea (terceros paises). La exportacion esta exenta de IVA. Para bienes, debe justificarse con el DUA de exportacion.', mandatoryFields: 'Datos completos del exportador y del cliente extranjero, numero y serie, fecha, descripcion detallada, base imponible, indicacion de "Exportacion - exenta de IVA (art. 21 LIVA)", referencia al DUA si es exportacion de bienes, Incoterm si aplica.', example: 'Una empresa espanola vende maquinaria agricola a un cliente de Marruecos, exenta de IVA por exportacion.' },
  'factura-rectificativa': { whenToUse: 'Corregir errores en una factura emitida anteriormente: importe incorrecto, IVA mal calculado, datos del cliente erroneos, o para anular una factura completamente (factura rectificativa de anulacion).', mandatoryFields: 'Referencia a la factura original que se rectifica, motivo de la rectificacion, nuevos importes (positivos o negativos), numero y serie propios de la factura rectificativa, fecha. Se debe identificar claramente como factura rectificativa R1, R2, etc.', example: 'Un autonomo emitio una factura con el IVA al 10% cuando correspondia el 21%. Emite una rectificativa por la diferencia de 11 puntos de IVA.' },
  'factura-recibo': { whenToUse: 'Documento que acredita el pago de una factura anterior, total o parcial. Sirve como justificante de cobro y se entrega al cliente cuando este realiza el pago.', mandatoryFields: 'Referencia a la factura o facturas que se pagan, importe del pago recibido, fecha del cobro, forma de pago (transferencia, efectivo, tarjeta), datos del emisor. Puede ser un documento independiente o un anexo a la factura original.', example: 'Un autonomo emite un recibo por el pago de 3 facturas pendientes que el cliente acaba de abonar mediante transferencia bancaria.' },
  'factura-presupuesto': { whenToUse: 'Documento previo a la prestacion del servicio o venta. No tiene valor fiscal (no se contabiliza IVA ni IRPF) hasta que se acepta y se convierte en factura. Sirve para detallar lo que se va a hacer y su coste estimado.', mandatoryFields: 'Datos del emisor y del cliente, fecha del presupuesto, validez de la oferta (ej. "valido por 30 dias"), descripcion detallada de los servicios o productos, precios unitarios, total estimado, condiciones de pago. No lleva IVA desglosado (se indica "IVA no incluido" o similar).', example: 'Un pintor presenta un presupuesto a una comunidad de vecinos por la pintura de la fachada del edificio, detallando superficie, materiales y mano de obra.' },
  'factura-ingresos-varios': { whenToUse: 'Ingresos atipicos o esporadicos fuera de tu actividad principal: indemnizaciones, subvenciones a la explotacion, ingresos extraordinarios, reembolsos, comisiones puntuales.', mandatoryFields: 'Similar a la factura de servicios pero identificando claramente el concepto del ingreso. Base imponible, IVA si corresponde, y naturaleza del ingreso para su correcta imputacion contable.', example: 'Un autonomo recibe una subvencion de su comunidad autonoma por digitalizacion y necesita emitir una factura justificativa del ingreso.' },
  'factura-transporte': { whenToUse: 'Servicios de transporte de mercancias por carretera, maritimo o aereo. Incluye portes, mensajeria, mudanzas, distribucion y logistica. Especifica origen, destino y condiciones del transporte.', mandatoryFields: 'Datos del transportista y del cargador, numero y serie, fecha de emision y de realizacion del transporte, origen y destino, descripcion de la mercancia, peso/volumen, precio del porte, IVA (21%), y en su caso retencion del 1%. Si es transporte internacional puede estar exento.', example: 'Un transportista autonomo factura a una empresa el porte de mercancia desde Madrid a un centro logistico en Valencia.' }
};

function invoiceTypeContent(type) {
  const d = invoiceTypeData[type.slug] || {
    whenToUse: 'Segun la naturaleza de la transaccion y los requisitos fiscales aplicables.',
    mandatoryFields: 'Datos del emisor y receptor, numero y serie, fecha, descripcion, base imponible, IVA y total.',
    example: 'Facturacion profesional adaptada a la normativa fiscal espanola vigente.'
  };

  const content = `
<p>La <strong>${type.name.toLowerCase()}</strong> es uno de los documentos mas utilizados por autonomos y empresas en Espana. Tener una plantilla profesional y adaptada a la normativa de la AEAT es clave para evitar errores fiscales y proyectar una imagen profesional ante tus clientes.</p>

<h2>Cuando se usa una ${type.name.toLowerCase()}</h2>
<p>${d.whenToUse}</p>
<p>A diferencia de otros tipos de factura, la ${type.name.toLowerCase()} tiene caracteristicas especificas que debes conocer para aplicarla correctamente. Usar el tipo de factura adecuado no solo es un requisito legal, sino que evita problemas en futuras comprobaciones de Hacienda.</p>

<h2>Campos obligatorios segun la AEAT</h2>
<p>Una ${type.name.toLowerCase()} debe incluir, como minimo, los siguientes campos obligatorios establecidos por el Reglamento de Facturacion (RD 1619/2012):</p>
<p>${d.mandatoryFields}</p>
<p>Ademas, si tu sistema de facturacion es digital (obligatorio con VeriFactu a partir de 2027), debera incluir el registro de evento de facturacion con su correspondiente huella o hash encadenado y la firma electronica del sistema.</p>

<h2>Ejemplo practico</h2>
<p>Veamos un caso real: ${d.example}</p>
<p>En este escenario, la ${type.name.toLowerCase()} debe reflejar correctamente cada concepto, el tipo impositivo aplicable y los datos identificativos de ambas partes. Un error en cualquiera de estos campos puede suponer la no deducibilidad del gasto para tu cliente o una sancion para ti.</p>

<h2>Diferencias con otros tipos de factura</h2>
<p>Cada tipo de factura tiene su funcion especifica. La ${type.name.toLowerCase()} se distingue de otros formatos por los requisitos concretos de contenido y por las circunstancias en que se emite. Es importante no confundir los tipos de factura, ya que cada uno tiene implicaciones fiscales diferentes en cuanto a IVA, IRPF y obligaciones de declaracion.</p>

<h2>Plantilla gratuita de ${type.name.toLowerCase()}</h2>
<p>En FacturaIA te ofrecemos una plantilla profesional de ${type.name.toLowerCase()} completamente gratis y lista para usar. Nuestra plantilla incluye:</p>
<ul>
<li>Todos los campos obligatorios que exige la AEAT</li>
<li>Calculo automatico de IVA e IRPF</li>
<li>Numeracion automatica de facturas</li>
<li>Formato profesional y personalizable con tu logo y datos</li>
<li>Exportacion a PDF y FacturaE</li>
<li>Cumplimiento VeriFactu integrado</li>
<li>Almacenamiento seguro y gratuito</li>
</ul>

<h2>Como generar una ${type.name.toLowerCase()} con FacturaIA</h2>
<p>Con FacturaIA generar una ${type.name.toLowerCase()} es cuestion de segundos:</p>
<ol>
<li>Registrate gratis (sin tarjeta de credito)</li>
<li>Completa tus datos fiscales una sola vez</li>
<li>Selecciona el tipo de factura: ${type.name.toLowerCase()}</li>
<li>Anade los conceptos, importes e impuestos</li>
<li>Previsualiza y emite la factura en PDF o FacturaE</li>
</ol>

<h2>Ventajas de usar una plantilla profesional</h2>
<p>Utilizar una plantilla profesional de ${type.name.toLowerCase()} en lugar de crear facturas desde cero en Word o Excel te aporta multiples beneficios: ahorras tiempo en cada factura, evitas errores de calculo de IVA e IRPF, proyectas una imagen profesional ante tus clientes, cumples automaticamente con la normativa de facturacion (incluido VeriFactu) y mantienes un historial ordenado de toda tu facturacion.</p>

<h2>Obligaciones VeriFactu para la ${type.name.toLowerCase()}</h2>
<p>A partir de 2027, todos los sistemas de facturacion en Espana deberan cumplir con VeriFactu. Esto significa que la ${type.name.toLowerCase()} que emitas debera ser generada por un software certificado que garantice la integridad, trazabilidad e inalterabilidad de los registros de facturacion. FacturaIA ya implementa estos requisitos y genera facturas VeriFactu compatibles 100% gratis.</p>

<h2>Preguntas frecuentes sobre la ${type.name.toLowerCase()}</h2>
<div class="faq-item">
<h3>Es obligatorio usar una plantilla especifica para cada tipo de factura?</h3>
<p>No existe un formato oficial obligatorio, pero la AEAT exige que la factura contenga ciertos campos minimos. Usar una plantilla disenada especificamente para ${type.name.toLowerCase()} te asegura que no olvidaras ningun campo obligatorio y que el formato es el adecuado para esa operacion.</p>
</div>
<div class="faq-item">
<h3>Puedo descargar la plantilla en PDF y Excel?</h3>
<p>Con FacturaIA puedes descargar tus facturas en PDF profesional y en formato FacturaE (XML) para su presentacion electronica. No trabajamos con Excel porque no garantiza la integridad de los datos fiscales. Te recomendamos usar siempre un software de facturacion certificado.</p>
</div>
<div class="faq-item">
<h3>Cuanto cuesta la plantilla de ${type.name.toLowerCase()}?</h3>
<p>Nada. FacturaIA es 100% gratuito. Puedes generar todas las ${type.name.toLowerCase()}s que necesites sin pagar un solo euro, sin limites y sin tarjeta de credito. Nuestro modelo open source (MIT) garantiza que siempre sera gratis.</p>
</div>
`;
  return content;
}

// ─────────────────── TEMPLATE BUILDERS ───────────────────

function buildPage(data) {
  const jsonLDCombined = `
<script type="application/ld+json">${jsonLDBreadcrumb(data.breadcrumbItems)}</script>
<script type="application/ld+json">${jsonLDSoftwareApp()}</script>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(data.title)} | FacturaIA</title>
<meta name="description" content="${esc(data.description)}">
<meta name="keywords" content="${esc(data.keywords)}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://facturaia.app${esc(data.canonical)}">
<meta property="og:title" content="${esc(data.title)} | FacturaIA">
<meta property="og:description" content="${esc(data.ogDescription || data.description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://facturaia.app${esc(data.canonical)}">
<meta property="og:site_name" content="FacturaIA">
<meta property="og:locale" content="es_ES">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(data.title)} | FacturaIA">
<meta name="twitter:description" content="${esc((data.ogDescription || data.description).substring(0, 150))}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230A1628'/><text x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' font-family='Inter,sans-serif' font-weight='800' font-size='18' fill='%23D4A843'>F</text></svg>">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../seo/css/style.css">
${jsonLDCombined}
</head>
<body>
<nav class="nav" id="navbar">
  <div class="nav-inner">
    <a href="/" class="nav-logo"><span class="nav-logo-dot"></span>FacturaIA</a>
    <div class="nav-links">
      <a href="/#features" class="nav-link">Funcionalidades</a>
      <a href="/blog/" class="nav-link">Blog</a>
      <a href="/herramientas/" class="nav-link">Herramientas</a>
      <a href="/#faq" class="nav-link">FAQ</a>
      <a href="/app" class="nav-cta">Probar gratis</a>
    </div>
  </div>
</nav>
<div class="breadcrumbs"><div class="container"><a href="/">Inicio</a> <span>/</span> ${data.breadcrumbHTML}</div></div>
<section class="section-padding">
  <div class="container">
    <div class="page-header">
      <h1>${data.h1}</h1>
      <p>${esc(data.subtitle)}</p>
    </div>
    <div class="prose">${data.content}</div>
  </div>
</section>
<section class="section-padding" style="background:var(--bg-primary);">
  <div class="container">
    <div class="cta-box">
      <h2>Empieza a facturar gratis hoy</h2>
      <p>Sin limites. Sin tarjeta de credito. Sin trampas.</p>
      <form class="cta-form js-waitlist-form"><input type="email" placeholder="tu@email.com" required><button type="submit" class="btn-primary">Probar gratis</button></form>
      <p class="cta-footnote"><a href="/privacidad.html">Sin spam. Sin tarjeta.</a></p>
    </div>
  </div>
</section>
<footer class="footer"><div class="container"><div class="footer-grid"><div class="footer-brand"><a href="/" class="footer-logo"><span class="nav-logo-dot"></span>FacturaIA</a><p class="footer-tagline">Software de facturacion VeriFactu 100% gratis y open source para autonomos espanoles.</p></div><div class="footer-col"><h4>Producto</h4><a href="/#features">Funcionalidades</a><a href="/#comparison">Comparativa</a><a href="/blog/">Blog</a><a href="/herramientas/">Herramientas</a></div><div class="footer-col"><h4>Recursos</h4><a href="/verifactu-autonomos.html">Verifactu Autonomos</a><a href="/blog/guia-verifactu-2027.html">Guia Verifactu 2027</a><a href="/calculadora-iva.html">Calculadora IVA</a><a href="/calculadora-irpf.html">Calculadora IRPF</a></div><div class="footer-col"><h4>Legal</h4><a href="/aviso-legal.html">Aviso Legal</a><a href="/privacidad.html">Privacidad</a><a href="/terminos.html">Terminos</a><a href="https://github.com/facturaia" class="external">GitHub</a></div></div><div class="footer-bottom"><p class="footer-copy">&copy; 2026 FacturaIA. Open Source MIT. 100% gratis para siempre.</p><a href="https://ko-fi.com/facturaia" target="_blank" rel="noopener" class="footer-donate">Apoyar el proyecto</a></div></div></footer>
<button class="scroll-top" id="scrollTop" aria-label="Volver arriba">&#8593;</button>
<div class="cookie-banner" id="cookieBanner"><div class="cookie-banner-inner"><p>Usamos cookies minimas para funcionar. No vendemos tus datos. <a href="/privacidad.html">Mas info</a></p><button class="btn-accept" id="acceptCookies">Aceptar</button></div></div>
<script src="../seo/js/main.js" defer></script>
</body>
</html>`;
}

function buildBreadcrumbHTML(items) {
  const parts = items.map((item, i) => {
    if (i === 0) return `<a href="/">Inicio</a>`;
    if (i === items.length - 1) return `<span>${esc(item.name)}</span>`;
    return `<a href="${esc(item.url)}">${esc(item.name)}</a>`;
  });
  return parts.join(' <span>/</span> ');
}

// ── helpers that return a breadcrumb-items array, plus html
function breadcrumbItemsForProvince(province) {
  return [
    { name: 'Inicio', url: '/' },
    { name: 'Autonomos por Provincia', url: '/autonomo/' },
    { name: province.name, url: `/autonomo/${province.slug}.html` }
  ];
}
function breadcrumbItemsForProfession(prof) {
  return [
    { name: 'Inicio', url: '/' },
    { name: 'Facturacion por Profesion', url: '/autonomo/' },
    { name: prof.name, url: `/autonomo/${prof.slug}.html` }
  ];
}
function breadcrumbItemsForInvoiceType(type) {
  return [
    { name: 'Inicio', url: '/' },
    { name: 'Plantillas de Factura', url: '/plantillas/' },
    { name: type.name, url: `/plantillas/${type.slug}.html` }
  ];
}

// ─────────────────── GENERATORS ───────────────────

function generateProvincePage(province) {
  const name = province.name;
  const keywordsList = [
    `facturacion autonomos ${name.toLowerCase()}`,
    `autonomo ${name.toLowerCase()}`,
    `gestoria ${name.toLowerCase()} autonomos`,
    `verifactu ${name.toLowerCase()}`,
    `factura electronica ${name.toLowerCase()}`,
    `software facturacion ${name.toLowerCase()}`,
    `autonomos ${name.toLowerCase()}`
  ];

  const breadcrumbItems = breadcrumbItemsForProvince(province);

  const data = {
    title: `Facturacion para Autonomos en ${name}: Guia y Herramientas Gratis`,
    description: `Guia de facturacion para autonomos en ${name}. VeriFactu, factura electronica gratis, gestorias y normativa fiscal en ${name}. Software de facturacion 100% gratuito.`,
    keywords: keywordsList.join(', '),
    canonical: `/autonomo/${province.slug}.html`,
    ogDescription: `Todo lo que necesitas saber sobre facturacion, gestorias y obligaciones fiscales para autonomos en ${name}. Software VeriFactu 100% gratis.`,
    h1: `Facturacion para Autonomos en <span class="highlight">${name}</span>`,
    subtitle: `Guia completa de facturacion, gestorias y obligaciones fiscales para autonomos en ${name}. Software VeriFactu 100% gratuito y open source.`,
    breadcrumbItems: breadcrumbItems,
    breadcrumbHTML: buildBreadcrumbHTML(breadcrumbItems),
    content: provinceContent(province)
  };

  const html = buildPage(data);
  const filePath = path.join(AUTONOMO_DIR, `${province.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  [Province] ${name} -> autonomo/${province.slug}.html`);
}

function generateProfessionPage(prof) {
  const name = prof.name;
  const keywordsList = [
    `facturacion ${name.toLowerCase()}`,
    `autonomo ${name.toLowerCase()}`,
    `plantilla factura ${name.toLowerCase()}`,
    `impuestos ${name.toLowerCase()}`,
    `${name.toLowerCase()} autonomo`,
    `factura ${name.toLowerCase()}`,
    `verifactu ${name.toLowerCase()}`
  ];

  const breadcrumbItems = breadcrumbItemsForProfession(prof);

  const data = {
    title: `Facturacion para ${name}: Plantillas y Consejos Fiscales`,
    description: `Guia de facturacion para ${name.toLowerCase()}. Plantillas de factura, impuestos especificos (IVA/IRPF), consejos fiscales y software gratis VeriFactu para ${name.toLowerCase()}.`,
    keywords: keywordsList.join(', '),
    canonical: `/autonomo/${prof.slug}.html`,
    ogDescription: `Guia completa de facturacion para ${name.toLowerCase()}s autonomos. Plantillas, impuestos, gastos deducibles y software gratuito VeriFactu.`,
    h1: `Facturacion para <span class="highlight">${name}</span>`,
    subtitle: `Guia de facturacion para ${name.toLowerCase()}s autonomos: plantillas, impuestos, gastos deducibles y software gratis compatible con VeriFactu.`,
    breadcrumbItems: breadcrumbItems,
    breadcrumbHTML: buildBreadcrumbHTML(breadcrumbItems),
    content: professionContent(prof)
  };

  const html = buildPage(data);
  const filePath = path.join(AUTONOMO_DIR, `${prof.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  [Profession] ${name} -> autonomo/${prof.slug}.html`);
}

function generateInvoiceTypePage(type) {
  const name = type.name;
  const keywordsList = [
    `plantilla ${name.toLowerCase()}`,
    `${name.toLowerCase()} gratis`,
    `${name.toLowerCase()} autonomos`,
    `modelo ${name.toLowerCase()}`,
    `descargar ${name.toLowerCase()}`,
    `formato ${name.toLowerCase()}`,
    `${name.toLowerCase()} AEAT`
  ];

  const breadcrumbItems = breadcrumbItemsForInvoiceType(type);

  const data = {
    title: `Plantilla de ${name} Gratis para Autonomos`,
    description: `Descarga gratis plantilla de ${name.toLowerCase()} para autonomos. Formato profesional, campos obligatorios AEAT y compatible con VeriFactu. Personalizable.`,
    keywords: keywordsList.join(', '),
    canonical: `/plantillas/${type.slug}.html`,
    ogDescription: `Plantilla profesional de ${name.toLowerCase()} gratis. Todos los campos obligatorios AEAT. Compatible con VeriFactu. Descarga y personaliza.`,
    h1: `Plantilla de <span class="highlight">${name}</span> Gratis`,
    subtitle: `Plantilla profesional de ${name.toLowerCase()} gratis para autonomos. Formato listo para usar con todos los campos obligatorios de la AEAT y compatible con VeriFactu.`,
    breadcrumbItems: breadcrumbItems,
    breadcrumbHTML: buildBreadcrumbHTML(breadcrumbItems),
    content: invoiceTypeContent(type)
  };

  const html = buildPage(data);
  const filePath = path.join(PLANTILLAS_DIR, `${type.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  [Invoice] ${name} -> plantillas/${type.slug}.html`);
}

// ─────────────────── MAIN ───────────────────

function main() {
  console.log('========================================');
  console.log('  FacturaIA - Programmatic SEO Generator');
  console.log('========================================\n');

  ensureDir(AUTONOMO_DIR);
  ensureDir(PLANTILLAS_DIR);

  let total = 0;

  console.log('\n--- Category A: Autonomo by Province (52 pages) ---');
  provinces.forEach(p => {
    generateProvincePage(p);
    total++;
  });

  console.log(`\n--- Category B: Autonomo by Profession (${professions.length} pages) ---`);
  professions.forEach(p => {
    generateProfessionPage(p);
    total++;
  });

  console.log(`\n--- Category C: Invoice Templates (${invoiceTypes.length} pages) ---`);
  invoiceTypes.forEach(t => {
    generateInvoiceTypePage(t);
    total++;
  });

  console.log(`\n========================================`);
  console.log(`  DONE! Generated ${total} files.`);
  console.log(`  - ${provinces.length} province pages in autonomo/`);
  console.log(`  - ${professions.length} profession pages in autonomo/`);
  console.log(`  - ${invoiceTypes.length} invoice template pages in plantillas/`);
  console.log(`========================================`);
}

main();
