/* ============================================ */
/* Alterra Digital — Main JavaScript              */
/* ============================================ */

(function() {
  'use strict';

  /* ------------------------------------------ */
  /* Scroll Reveal (IntersectionObserver)         */
  /* ------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function(entries) {
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
    // Fallback: show everything
    revealElements.forEach(function(el) {
      el.classList.add('revealed');
    });
  }

  /* ------------------------------------------ */
  /* Nav Scroll Tracking                          */
  /* ------------------------------------------ */
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = [];

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

    // Close mobile nav when clicking a link
    navLinksEl.addEventListener('click', function(e) {
      if (e.target.classList.contains('nav-link')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinksEl.classList.remove('open');
      }
    });
  }

  /* ------------------------------------------ */
  /* Accordion                                    */
  /* ------------------------------------------ */
  var accordionTriggers = document.querySelectorAll('.accordion-trigger');

  accordionTriggers.forEach(function(trigger) {
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
  /* Smooth Scroll for Internal Links             */
  /* ------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
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
        // Fallback: direct link
        window.open('./assets/Alterra-Digital-Partner-Executive-Summary.pdf', '_blank');
      });
  };

})();
