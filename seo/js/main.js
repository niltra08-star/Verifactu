// FacturaIA Shared JavaScript

// Auto-load ads system
(function() {
  var s = document.createElement('script');
  s.src = (document.currentScript ? document.currentScript.src.replace('main.js', 'ads.js') : '../seo/js/ads.js');
  s.defer = true;
  document.head.appendChild(s);
})();

// Inject support banner after author boxes in blog posts
(function() {
  function injectBanner() {
    var boxes = document.querySelectorAll('.author-box');
    boxes.forEach(function(box) {
      if (box.nextElementSibling && box.nextElementSibling.classList.contains('support-banner-injected')) return;
      var banner = document.createElement('div');
      banner.className = 'support-banner support-banner-injected';
      banner.innerHTML = '<p>&#10084; FacturaIA es 100% gratis y open source. Si este articulo te ha ayudado, apoya el proyecto para que podamos seguir creando herramientas gratuitas.</p>' +
        '<div class="support-buttons">' +
        '<a href="https://ko-fi.com/facturaia" target="_blank" rel="noopener sponsored" class="support-btn ko-fi">&#9749; Invitanos a un cafe</a>' +
        '<a href="https://github.com/facturaia" target="_blank" rel="noopener" class="support-btn github">&#9733; GitHub</a>' +
        '<button id="shareSupport" class="support-btn share" style="display:none">&#128279; Compartir</button>' +
        '</div>';
      box.insertAdjacentElement('afterend', banner);
    });

    var shareBtn = document.getElementById('shareSupport');
    if (shareBtn && navigator.share) {
      shareBtn.style.display = 'inline-flex';
      shareBtn.addEventListener('click', function() {
        navigator.share({
          title: document.title || 'FacturaIA',
          text: 'Descubre FacturaIA: software de facturacion 100% gratis y open source para autonomos.',
          url: window.location.href
        }).catch(function() {});
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectBanner);
  } else {
    injectBanner();
  }
})();

(function() {
  'use strict';

  // Navbar scroll effect
  const nav = document.getElementById('navbar');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // Scroll to top button
  const scrollTop = document.getElementById('scrollTop');
  if (scrollTop) {
    window.addEventListener('scroll', function() {
      scrollTop.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Cookie banner
  const cookieBanner = document.getElementById('cookieBanner');
  if (cookieBanner) {
    if (!localStorage.getItem('cookiesAccepted')) {
      cookieBanner.classList.add('visible');
    }
    document.getElementById('acceptCookies').addEventListener('click', function() {
      localStorage.setItem('cookiesAccepted', 'true');
      cookieBanner.classList.remove('visible');
    });
  }

  // Email waitlist form
  var forms = document.querySelectorAll('.js-waitlist-form');
  forms.forEach(function(form) {
    var input = form.querySelector('input[type="email"]');
    var msg = form.querySelector('.js-form-msg');
    var btn = form.querySelector('button');

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = input.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (msg) { msg.textContent = 'Por favor, introduce un email valido'; msg.className = 'js-form-msg error'; input.classList.add('error'); }
        return;
      }
      input.classList.remove('error');
      if (btn) { btn.disabled = true; btn.classList.add('loading'); }
      if (msg) { msg.textContent = ''; msg.className = 'js-form-msg'; }

      fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, source: 'web' })
      })
      .then(function(r) { return r.json(); })
      .then(function() {
        if (msg) { msg.textContent = 'Confirmado! Te avisaremos del lanzamiento'; msg.className = 'js-form-msg success'; }
        input.value = '';
      })
      .catch(function() {
        if (msg) { msg.textContent = 'Error de conexion. Intentalo de nuevo'; msg.className = 'js-form-msg error'; }
      })
      .finally(function() {
        if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
      });
    });
  });

  // Calculator logic - IVA
  var calcIVA = document.getElementById('calcIVA');
  if (calcIVA) {
    var ivaBase = document.getElementById('ivaBase');
    var ivaType = document.getElementById('ivaType');
    var ivaResult = document.getElementById('ivaResult');
    var ivaBreakdown = document.getElementById('ivaBreakdown');

    function updateIVA() {
      var base = parseFloat(ivaBase.value) || 0;
      var tipo = parseFloat(ivaType.value) || 21;
      var iva = base * (tipo / 100);
      var total = base + iva;
      ivaResult.textContent = total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20AC';
      ivaBreakdown.innerHTML =
        '<div><span>Base imponible</span><span>' + base.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div><span>IVA (' + tipo + '%)</span><span>' + iva.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div class="total-row"><span>Total</span><span>' + total.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>';
    }

    ivaBase.addEventListener('input', updateIVA);
    ivaType.addEventListener('change', updateIVA);
    updateIVA();
  }

  // Calculator logic - IRPF
  var calcIRPF = document.getElementById('calcIRPF');
  if (calcIRPF) {
    var irpfBase = document.getElementById('irpfBase');
    var irpfType = document.getElementById('irpfType');
    var irpfResult = document.getElementById('irpfResult');
    var irpfBreakdown = document.getElementById('irpfBreakdown');

    function updateIRPF() {
      var base = parseFloat(irpfBase.value) || 0;
      var tipo = parseFloat(irpfType.value) || 15;
      var irpf = base * (tipo / 100);
      var neto = base - irpf;
      irpfResult.textContent = irpf.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20AC';
      irpfBreakdown.innerHTML =
        '<div><span>Base imponible</span><span>' + base.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div><span>IRPF retencion (' + tipo + '%)</span><span style="color:var(--error)">-' + irpf.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div class="total-row"><span>Neto a cobrar</span><span>' + neto.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>';
    }

    irpfBase.addEventListener('input', updateIRPF);
    irpfType.addEventListener('change', updateIRPF);
    updateIRPF();
  }

  // Calculator logic - Factura Completa
  var calcFactura = document.getElementById('calcFactura');
  if (calcFactura) {
    var fBase = document.getElementById('fBase');
    var fIVA = document.getElementById('fIVA');
    var fIRPF = document.getElementById('fIRPF');
    var fResult = document.getElementById('fResult');
    var fBreakdown = document.getElementById('fBreakdown');

    function updateFactura() {
      var base = parseFloat(fBase.value) || 0;
      var ivaPct = parseFloat(fIVA.value) || 21;
      var irpfPct = parseFloat(fIRPF.value) || 15;
      var iva = base * (ivaPct / 100);
      var irpf = base * (irpfPct / 100);
      var total = base + iva - irpf;
      fResult.textContent = total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' \u20AC';
      fBreakdown.innerHTML =
        '<div><span>Base imponible</span><span>' + base.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div><span>IVA (' + ivaPct + '%)</span><span>+' + iva.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div><span>IRPF (' + irpfPct + '%)</span><span style="color:var(--error)">-' + irpf.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>' +
        '<div class="total-row"><span>Total factura</span><span style="color:var(--accent-gold-light)">' + total.toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' \u20AC</span></div>';
    }

    fBase.addEventListener('input', updateFactura);
    fIVA.addEventListener('change', updateFactura);
    fIRPF.addEventListener('change', updateFactura);
    updateFactura();
  }

  // Verifactu countdown
  var countdownEl = document.getElementById('verifactuCountdown');
  if (countdownEl) {
    var deadline = new Date(2027, 6, 1); // July 1, 2027
    function updateCountdown() {
      var now = new Date();
      var diff = deadline - now;
      if (diff <= 0) { countdownEl.textContent = 'Ya es obligatorio'; return; }
      var days = Math.floor(diff / 86400000);
      countdownEl.textContent = days.toLocaleString('es-ES');
    }
    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  // ── Advertising System ─────────────────
  var ADSENSE_ID = 'ca-pub-XXXXXXXXXX'; // Cambiar cuando tengas AdSense aprobado
  var ADSENSE_ENABLED = false; // Cambiar a true cuando AdSense este aprobado
  var adSlots = document.querySelectorAll('.ad-slot');

  // Detectar adblocker
  var adblockDetected = false;
  function detectAdblock() {
    var test = document.createElement('div');
    test.className = 'adsbygoogle';
    test.style.display = 'none';
    document.body.appendChild(test);
    var blocked = test.offsetHeight === 0 || test.clientHeight === 0;
    document.body.removeChild(test);
    return blocked;
  }

  function showFallbackAds() {
    document.querySelectorAll('.ad-slot-fallback').forEach(function(fb) {
      fb.classList.add('visible');
    });
  }

  function loadAdsense() {
    if (!ADSENSE_ENABLED) { showFallbackAds(); return; }

    adblockDetected = detectAdblock();
    if (adblockDetected) {
      showFallbackAds();
      return;
    }

    // Cargar AdSense solo si esta habilitado
    var script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_ID;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    script.onload = function() {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch(e) {
        showFallbackAds();
      }
    };

    script.onerror = function() {
      showFallbackAds();
    };
  }

  // Lazy load ads with Intersection Observer
  if ('IntersectionObserver' in window) {
    var adObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var slot = entry.target;
          if (!slot.dataset.loaded) {
            slot.dataset.loaded = 'true';
            // Las ads se cargan todas de una vez con AdSense
          }
          adObserver.unobserve(slot);
        }
      });
    }, { rootMargin: '200px' });

    adSlots.forEach(function(slot) {
      adObserver.observe(slot);
    });
  }

  // Iniciar sistema de anuncios
  loadAdsense();

  // Boton compartir en support banner
  var shareBtn = document.getElementById('shareSupport');
  if (shareBtn && navigator.share) {
    shareBtn.style.display = 'inline-flex';
    shareBtn.addEventListener('click', function() {
      navigator.share({
        title: 'FacturaIA - Facturacion VeriFactu Gratis para Autonomos',
        text: 'Descubre FacturaIA: software de facturacion 100% gratis, open source y compatible con Verifactu.',
        url: 'https://facturaia.app'
      }).catch(function() {});
    });
  }
})();
