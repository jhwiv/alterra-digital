/* ============================================ */
/* Alterra Digital — Main JavaScript (Rebuild)   */
/* ============================================ */

(function() {
  'use strict';

  /* ------------------------------------------ */
  /* Stat Counter Animation                       */
  /* ------------------------------------------ */
  function animateCounter(el, target, prefix, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    var duration = 2000;
    var startTime = performance.now();
    var easeOut = function(t) { return 1 - Math.pow(1 - t, 3); };

    function tick(now) {
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var current = Math.round(target * easeOut(progress));
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Observe stat-bar for counter animation
  var statBar = document.querySelector('.stat-bar');
  if (statBar && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var statValues = statBar.querySelectorAll('.stat-value');
          statValues.forEach(function(sv) {
            var text = sv.textContent.trim();
            if (text === '$35B') {
              animateCounter(sv, 35, '$', 'B');
            } else if (text.indexOf('20,000') !== -1) {
              animateCounter(sv, 20000, '', '+');
            } else if (text === '76%') {
              animateCounter(sv, 76, '', '%');
            }
          });
          statObserver.unobserve(statBar);
        }
      });
    }, { threshold: 0.3 });
    statObserver.observe(statBar);
  }

  /* ------------------------------------------ */
  /* Scroll Reveal (IntersectionObserver)         */
  /* ------------------------------------------ */
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function(el) {
      el.classList.add('revealed');
    });
  }

  /* ------------------------------------------ */
  /* Tab Switching                                */
  /* ------------------------------------------ */
  document.querySelectorAll('.tabs').forEach(function(tabContainer) {
    var buttons = tabContainer.querySelectorAll('.tab-btn');
    var panels = tabContainer.querySelectorAll('.tab-panel');

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var targetTab = this.getAttribute('data-tab');

        // Deactivate all
        buttons.forEach(function(b) { b.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });

        // Activate target
        this.classList.add('active');
        var targetPanel = tabContainer.querySelector('[data-panel="' + targetTab + '"]');
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  });

  /* ------------------------------------------ */
  /* Accordion                                    */
  /* ------------------------------------------ */
  document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var content = this.nextElementSibling;
      var isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close others in same accordion
      var parent = this.closest('.accordion-wrap');
      if (parent) {
        parent.querySelectorAll('.accordion-trigger').forEach(function(t) {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            t.nextElementSibling.style.maxHeight = null;
          }
        });
      }

      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        this.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* ------------------------------------------ */
  /* Nav Scroll Tracking                          */
  /* ------------------------------------------ */
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  var sections = [];

  navLinks.forEach(function(link) {
    var sectionId = link.getAttribute('data-section');
    var section = document.getElementById(sectionId);
    if (section) {
      sections.push({ id: sectionId, el: section, link: link });
    }
  });

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    var current = null;
    for (var i = sections.length - 1; i >= 0; i--) {
      if (sections[i].el.offsetTop <= scrollPos) {
        current = sections[i].id;
        break;
      }
    }
    navLinks.forEach(function(link) {
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  var scrollTicking = false;
  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      requestAnimationFrame(function() {
        updateActiveNav();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateActiveNav();

  /* ------------------------------------------ */
  /* Mobile Nav Toggle                            */
  /* ------------------------------------------ */
  var navToggle = document.getElementById('navToggle');
  var navLinksEl = document.getElementById('navLinks');

  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', function() {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinksEl.classList.toggle('open');
    });

    navLinksEl.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link') || e.target.classList.contains('nav-cta-btn')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinksEl.classList.remove('open');
      }
    });
  }

  /* ------------------------------------------ */
  /* Smooth Scroll for Internal #links ONLY      */
  /* ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      // Only handle internal anchors
      if (!href || href === '#') return;
      // Ensure it's a simple #id link, not an external URL
      if (href.charAt(0) !== '#') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ------------------------------------------ */
  /* Contact Form (mailto)                        */
  /* ------------------------------------------ */
  window.handleSubmit = function(e) {
    e.preventDefault();

    var name = document.getElementById('contactName').value;
    var agency = document.getElementById('contactAgency').value;
    var email = document.getElementById('contactEmail').value;
    var message = document.getElementById('contactMessage').value;

    var subject = encodeURIComponent('Partnership Inquiry from ' + name + (agency ? ' — ' + agency : ''));
    var body = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Agency: ' + (agency || 'N/A') + '\n' +
      'Email: ' + email + '\n\n' +
      'Message:\n' + (message || 'N/A')
    );

    window.open('mailto:hello@alterradigital.com?subject=' + subject + '&body=' + body, '_blank');
  };

  /* ------------------------------------------ */
  /* PDF Download via Blob                        */
  /* ------------------------------------------ */
  window.downloadPDF = function() {
    fetch('./assets/Alterra-Digital-Partner-Executive-Summary.pdf')
      .then(function(r) { return r.blob(); })
      .then(function(blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Alterra-Digital-Partner-Executive-Summary.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      })
      .catch(function(err) {
        console.error('Download failed:', err);
        window.open('./assets/Alterra-Digital-Partner-Executive-Summary.pdf', '_blank');
      });
  };

  /* ------------------------------------------ */
  /* QR Code Generation (Inline SVG)              */
  /* ------------------------------------------ */
  function generateQRCode(containerId, url) {
    var container = document.getElementById(containerId);
    if (!container) return;

    // Generate a simple visual QR-like pattern as SVG
    // This creates a deterministic pattern based on the URL string
    var size = 21; // QR version 1 is 21x21
    var cellSize = 3;
    var svgSize = size * cellSize;
    var cells = [];

    // Seed from URL
    var seed = 0;
    for (var i = 0; i < url.length; i++) {
      seed = ((seed << 5) - seed + url.charCodeAt(i)) | 0;
    }

    // Simple PRNG
    function nextRand() {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    }

    // Create pattern grid
    var grid = [];
    for (var r = 0; r < size; r++) {
      grid[r] = [];
      for (var c = 0; c < size; c++) {
        grid[r][c] = false;
      }
    }

    // Add finder patterns (3 corners)
    function addFinder(sr, sc) {
      for (var dr = 0; dr < 7; dr++) {
        for (var dc = 0; dc < 7; dc++) {
          if (dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
              (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4)) {
            if (sr + dr < size && sc + dc < size) {
              grid[sr + dr][sc + dc] = true;
            }
          }
        }
      }
    }
    addFinder(0, 0);
    addFinder(0, size - 7);
    addFinder(size - 7, 0);

    // Add timing patterns
    for (var t = 8; t < size - 8; t++) {
      grid[6][t] = t % 2 === 0;
      grid[t][6] = t % 2 === 0;
    }

    // Fill data area with seeded random
    for (var rr = 0; rr < size; rr++) {
      for (var cc = 0; cc < size; cc++) {
        if (!grid[rr][cc]) {
          // Skip quiet zone around finders
          var inFinder = (rr < 8 && cc < 8) || (rr < 8 && cc >= size - 8) || (rr >= size - 8 && cc < 8);
          if (!inFinder && rr !== 6 && cc !== 6) {
            grid[rr][cc] = nextRand() > 0.5;
          }
        }
      }
    }

    // Build SVG
    var rects = '';
    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        if (grid[row][col]) {
          rects += '<rect x="' + (col * cellSize) + '" y="' + (row * cellSize) + '" width="' + cellSize + '" height="' + cellSize + '" fill="' + (window.getComputedStyle(document.documentElement).getPropertyValue('--gold').trim() || '#C8A84B') + '"/>';
        }
      }
    }

    var svg = '<svg viewBox="0 0 ' + svgSize + ' ' + svgSize + '" xmlns="http://www.w3.org/2000/svg" style="background:rgba(250,246,238,0.9);border-radius:4px;padding:2px">' + rects + '</svg>';
    container.innerHTML = svg;
  }

  generateQRCode('qr-zurich', 'https://www.zurich-weekend.com');
  generateQRCode('qr-maritimes', 'https://www.maritimesgrandloop.com');

  /* ------------------------------------------ */
  /* Demo Modal (iframe in-page)                 */
  /* ------------------------------------------ */
  var demoModal = document.getElementById('demoModal');
  var demoIframe = document.getElementById('demoIframe');
  var demoTitle = document.getElementById('demoModalTitle');

  window.openDemo = function(card) {
    var url = card.getAttribute('data-demo-url');
    var title = card.querySelector('.demo-title').textContent;
    if (!url || !demoModal) return;
    demoTitle.textContent = title;
    demoIframe.src = url;
    demoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeDemo = function() {
    if (!demoModal) return;
    demoModal.classList.remove('open');
    demoIframe.src = '';
    document.body.style.overflow = '';
  };

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && demoModal.classList.contains('open')) {
      window.closeDemo();
    }
  });

})();
