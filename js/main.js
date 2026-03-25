/* ============================================================
   EDUARDO RIBEIRO — PERSONAL TRAINER
   main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     PROGRESS BAR
  ---------------------------------------------------------- */
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  document.body.prepend(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

  /* ----------------------------------------------------------
     NAV — sticky behaviour
  ---------------------------------------------------------- */
  const nav       = document.getElementById('nav');
  const toggle    = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('navMobile');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  toggle.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     SCROLL EVENTS (batched)
  ---------------------------------------------------------- */
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateNav();
        updateProgress();
        revealElements();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  updateNav();
  updateProgress();

  /* ----------------------------------------------------------
     SCROLL REVEAL (lightweight AOS replacement)
  ---------------------------------------------------------- */
  function revealElements() {
    const elements = document.querySelectorAll('[data-aos]:not(.aos-animate)');
    elements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      // Trigger when element is 88px from the bottom of the viewport
      if (rect.top < windowH - 88) {
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0, 10);
        if (delay > 0) {
          setTimeout(function () {
            el.classList.add('aos-animate');
          }, delay);
        } else {
          el.classList.add('aos-animate');
        }
      }
    });
  }

  // Initial run after short delay (lets CSS paint first)
  setTimeout(revealElements, 120);

  /* ----------------------------------------------------------
     SMOOTH SCROLL for anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     HERO PARALLAX (subtle)
  ---------------------------------------------------------- */
  const heroBgImg = document.querySelector('.hero__bg-img');

  function heroParallax() {
    if (!heroBgImg) return;
    const scrollY = window.scrollY;
    const heroH = document.querySelector('.hero').offsetHeight;
    if (scrollY < heroH) {
      heroBgImg.style.transform = 'translateY(' + scrollY * 0.25 + 'px)';
    }
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

  /* ----------------------------------------------------------
     RESULT CARDS — hover lift
  ---------------------------------------------------------- */
  document.querySelectorAll('.result-card').forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      this.style.transform = 'translateY(-4px)';
      this.style.transition = 'transform 0.35s cubic-bezier(0.22,1,0.36,1)';
    });
    card.addEventListener('mouseleave', function () {
      this.style.transform = 'translateY(0)';
    });
  });

  /* ----------------------------------------------------------
     SERVICE CARDS — subtle number indicator
  ---------------------------------------------------------- */
  const svcCards = document.querySelectorAll('.svc-card');
  svcCards.forEach(function (card, i) {
    const num = document.createElement('span');
    num.style.cssText = [
      'position:absolute',
      'bottom:1.4rem',
      'right:1.6rem',
      'font-family:\'Syne\',sans-serif',
      'font-size:0.6rem',
      'font-weight:800',
      'letter-spacing:0.15em',
      'color:rgba(0,0,0,0.07)',
      'user-select:none',
      'pointer-events:none'
    ].join(';');
    num.textContent = String(i + 1).padStart(2, '0');
    card.style.position = 'relative';
    card.appendChild(num);
  });

})();
