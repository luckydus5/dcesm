/* ============================================================
   DCESM
   Site interactions. No dependencies.
   Every feature degrades gracefully when JavaScript is absent.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------
     Mobile navigation
     -------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        burger.focus();
      }
    });

    // Tapping outside the open panel closes it
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (!e.target.closest('#nav') && !e.target.closest('#burger')) closeNav();
    });
  }

  /* --------------------------------------------------------
     Header state and reading progress
     -------------------------------------------------------- */
  var header = document.getElementById('header');
  var progress = document.getElementById('progress');
  var ticking = false;

  function onScrollFrame() {
    var y = window.scrollY;

    if (header) header.classList.toggle('is-stuck', y > 8);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? Math.min(y / max, 1) : 0;
      progress.style.transform = 'scaleX(' + pct + ')';
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });
  onScrollFrame();

  /* --------------------------------------------------------
     Footer year
     -------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --------------------------------------------------------
     Scroll reveal
     -------------------------------------------------------- */
  var animated = document.querySelectorAll('[data-anim]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(animated, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    Array.prototype.forEach.call(animated, function (el) {
      revealObserver.observe(el);
    });
  }

  /* --------------------------------------------------------
     Statistic counters

     Numbers come from the data-count attribute, so once real
     figures are filled in these animate automatically. A value
     of 0 is treated as "not supplied yet" and left as is, which
     keeps the placeholder dashes visible until real data lands.
     -------------------------------------------------------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';

    if (!isFinite(target) || target <= 0) return; // no real data yet

    if (reduceMotion) {
      el.textContent = String(target) + suffix;
      return;
    }

    var duration = 1500;
    var startTime = null;

    function step(now) {
      if (startTime === null) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = String(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* Hide any statistics block whose figures have not been supplied yet.
     As soon as a real data-count value is entered in the HTML, the block
     reveals itself with no further changes needed. */
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-editable="stats"]'),
    function (group) {
      var values = group.querySelectorAll('[data-count]');
      var hasRealData = Array.prototype.some.call(values, function (el) {
        return parseFloat(el.getAttribute('data-count')) > 0;
      });
      if (hasRealData) group.removeAttribute('data-pending');
      else group.setAttribute('data-pending', '');
    }
  );

  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(counters, animateCount);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });

      Array.prototype.forEach.call(counters, function (el) {
        countObserver.observe(el);
      });
    }
  }

  /* --------------------------------------------------------
     Scroll spy: highlight the section you are reading
     -------------------------------------------------------- */
  var navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  var sections = [];

  Array.prototype.forEach.call(navLinks, function (link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ link: link, section: section });
  });

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.filter(function (s) {
          return s.section === entry.target;
        })[0];
        if (!match) return;

        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('is-active'); });
          match.link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s.section); });
  }

  /* --------------------------------------------------------
     Contact form

     Validation only. Nothing is transmitted yet, so the user is
     told so plainly rather than shown a false success message.
     See README.md to connect a real inbox.
     -------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  if (form) {
    var setError = function (field, message) {
      var slot = form.querySelector('.form__error[data-for="' + field.id + '"]');
      if (slot) slot.textContent = message;
      field.classList.toggle('is-invalid', Boolean(message));
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    };

    // Clear an error the moment the user starts fixing it
    ['name', 'email', 'message'].forEach(function (id) {
      var field = document.getElementById(id);
      if (!field) return;
      field.addEventListener('input', function () {
        if (field.classList.contains('is-invalid')) setError(field, '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      note.textContent = '';
      note.className = 'form__note';

      var name = document.getElementById('name');
      var email = document.getElementById('email');
      var message = document.getElementById('message');
      var firstInvalid = null;

      if (!name.value.trim()) {
        setError(name, 'Please enter your name.');
        firstInvalid = firstInvalid || name;
      } else {
        setError(name, '');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, 'Please enter a valid email address.');
        firstInvalid = firstInvalid || email;
      } else {
        setError(email, '');
      }

      if (message.value.trim().length < 10) {
        setError(message, 'Please tell us a little more about the project.');
        firstInvalid = firstInvalid || message;
      } else {
        setError(message, '');
      }

      if (firstInvalid) {
        firstInvalid.focus();
        note.textContent = 'Please correct the highlighted fields.';
        note.className = 'form__note is-err';
        return;
      }

      // TODO: replace with a real submission. See README.md.
      note.textContent =
        'Your details are valid, but this form is not connected to an inbox yet.';
      note.className = 'form__note is-ok';
    });
  }
})();
