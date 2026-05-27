// FacturaIA Affiliate & Sponsorship System
(function() {
  'use strict';

  var AFFILIATES = {
    declarando: {
      name: 'Declarando',
      desc: 'Gestiona tus impuestos sin estres. Gestoria online desde 14,95 EUR/mes.',
      icon: '&#128202;',
      badge: 'Recomendado'
    },
    n26: {
      name: 'N26 Business',
      desc: 'Cuenta bancaria sin comisiones para autonomos. Separa finanzas personales y negocio.',
      icon: '&#127974;',
      badge: 'Gratis'
    },
    amazon: {
      name: 'Amazon para Autonomos',
      desc: 'Material de oficina, libros de contabilidad y todo lo que necesitas para tu negocio.',
      icon: '&#128230;',
      badge: 'Util'
    },
    revolut: {
      name: 'Revolut Business',
      desc: 'Cuenta business sin comisiones. Ideal para cobros y pagos internacionales.',
      icon: '&#127760;',
      badge: 'Gratis'
    },
    acumbamail: {
      name: 'Acumbamail',
      desc: 'Email marketing para autonomos desde 0 EUR. Newsletters, automatizaciones y mas.',
      icon: '&#9993;',
      badge: 'Gratis'
    },
    holded: {
      name: 'Holded',
      desc: 'Software de facturacion completo con ERP, inventario y contabilidad integrada.',
      icon: '&#128187;',
      badge: 'Software'
    }
  };

  function buildSponsorCard(service) {
    var aff = AFFILIATES[service];
    if (!aff) return '';

    return '<div class="sponsor-card" style="margin:0;">' +
      '<span class="sponsor-badge">' + aff.badge + '</span>' +
      '<div class="sponsor-icon">' + aff.icon + '</div>' +
      '<h4>' + aff.name + '</h4>' +
      '<p>' + aff.desc + '</p>' +
      '<a href="/go.html?to=' + service + '" target="_blank" rel="sponsored noopener" class="sponsor-link">Visitar ' + aff.name + ' &#8594;</a>' +
      '</div>';
  }

  function fillSponsorPlaceholders() {
    var placeholders = document.querySelectorAll('.sponsor-placeholder');
    placeholders.forEach(function(ph) {
      if (ph.dataset.filled) return;
      ph.dataset.filled = 'true';
      var service = ph.dataset.service || 'declarando';
      ph.innerHTML = buildSponsorCard(service);
    });
  }

  function injectSponsorGrid(parent, services) {
    if (!parent) return;
    var existing = parent.querySelector('.sponsor-grid-injected');
    if (existing) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'sponsor-grid sponsor-grid-injected';
    wrapper.style.cssText = 'margin:24px 0;';

    services.forEach(function(svc) {
      var card = document.createElement('div');
      card.innerHTML = buildSponsorCard(svc);
      wrapper.appendChild(card.firstElementChild);
    });

    parent.appendChild(wrapper);
  }

  function handleAdSlotFallbacks() {
    var fallbacks = document.querySelectorAll('.ad-slot-fallback');
    fallbacks.forEach(function(fb) {
      if (fb.classList.contains('visible')) return;

      var service = fb.dataset.service;
      if (service && AFFILIATES[service]) {
        var aff = AFFILIATES[service];
        fb.innerHTML =
          '<div class="af-title">' + aff.icon + ' ' + aff.name + '</div>' +
          '<div class="af-desc">' + aff.desc + '</div>' +
          '<a href="/go.html?to=' + service + '" target="_blank" rel="sponsored noopener" class="af-link">Saber mas &#8594;</a>';
      } else {
        fb.innerHTML =
          '<div class="af-title">&#128202; Declarando</div>' +
          '<div class="af-desc">Gestiona tus impuestos sin estres desde 14,95 EUR/mes.</div>' +
          '<a href="/go.html?to=declarando" target="_blank" rel="sponsored noopener" class="af-link">Saber mas &#8594;</a>';
      }
      fb.classList.add('visible');
    });
  }

  function injectAfterCTA() {
    var ctaBoxes = document.querySelectorAll('.cta-box');
    ctaBoxes.forEach(function(cta) {
      if (cta.nextElementSibling && cta.nextElementSibling.classList.contains('cta-affiliate-injected')) return;

      var affBox = document.createElement('div');
      affBox.className = 'cta-affiliate-injected';
      affBox.style.cssText = 'text-align:center;margin-top:20px;padding:0 12px;';

      var services = ['declarando', 'n26', 'amazon'];
      var grid = document.createElement('div');
      grid.className = 'sponsor-grid';
      grid.style.cssText = 'margin:0 auto;max-width:900px;';

      services.forEach(function(svc) {
        var card = document.createElement('div');
        card.innerHTML = buildSponsorCard(svc);
        grid.appendChild(card.firstElementChild);
      });

      var heading = document.createElement('p');
      heading.style.cssText = 'font-size:11px;color:var(--text-tertiary);margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;';
      heading.textContent = 'Servicios que apoyan FacturaIA';

      affBox.appendChild(heading);
      affBox.appendChild(grid);

      cta.insertAdjacentElement('afterend', affBox);
    });
  }

  function init() {
    fillSponsorPlaceholders();
    handleAdSlotFallbacks();
    injectAfterCTA();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
