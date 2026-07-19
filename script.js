/* =========================================================
   يوسف أحمد | بورتفوليو — script.js
   ========================================================= */
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initThemeToggle();
    initHeaderScroll();
    initMobileNav();
    initTypewriter();
    initScrollReveal();
    initCounters();
    initSkillRings();
    initPortfolioFilter();
    initBackToTop();
    initContactForm();
    document.getElementById('year').textContent = new Date().getFullYear();
  });

  /* ---------- Loading screen ---------- */
  function initLoadingScreen(){
    const screen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
      setTimeout(() => screen.classList.add('hidden'), 500);
    });
    // Fallback in case 'load' already fired
    setTimeout(() => screen.classList.add('hidden'), 3500);
  }

  /* ---------- Theme toggle (dark / light) ---------- */
  function initThemeToggle(){
    const body = document.body;
    const toggleBtn = document.getElementById('themeToggle');
    const saved = safeGet('portfolio-theme');
    if (saved) body.setAttribute('data-theme', saved);

    toggleBtn.addEventListener('click', () => {
      const next = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      body.setAttribute('data-theme', next);
      safeSet('portfolio-theme', next);
    });
  }
  function safeGet(key){ try { return localStorage.getItem(key); } catch(e){ return null; } }
  function safeSet(key, val){ try { localStorage.setItem(key, val); } catch(e){ /* ignore */ } }

  /* ---------- Header scroll state + active link ---------- */
  function initHeaderScroll(){
    const header = document.getElementById('siteHeader');
    const links = document.querySelectorAll('.main-nav a');
    const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));

    function onScroll(){
      header.classList.toggle('scrolled', window.scrollY > 30);

      let current = sections[0];
      const scrollPos = window.scrollY + 140;
      sections.forEach(sec => { if (sec && sec.offsetTop <= scrollPos) current = sec; });

      links.forEach(l => l.classList.toggle('active', current && l.getAttribute('href') === `#${current.id}`));
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav(){
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('mainNav');
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---------- Typewriter effect ---------- */
  function initTypewriter(){
    const el = document.getElementById('typedText');
    if (!el) return;
    const words = ['رقمية', 'سريعة', 'أنيقة', 'متجاوبة', 'احترافية'];
    let wordIndex = 0, charIndex = 0, deleting = false;

    function tick(){
      const current = words[wordIndex];
      if (!deleting){
        el.textContent = current.slice(0, ++charIndex);
        if (charIndex === current.length){ deleting = true; setTimeout(tick, 1400); return; }
      } else {
        el.textContent = current.slice(0, --charIndex);
        if (charIndex === 0){ deleting = false; wordIndex = (wordIndex + 1) % words.length; }
      }
      setTimeout(tick, deleting ? 45 : 90);
    }
    tick();
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal(){
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)){
      items.forEach(i => i.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(i => observer.observe(i));
  }

  /* ---------- Animated counters ---------- */
  function initCounters(){
    const counters = document.querySelectorAll('.stat-num');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10) || 0;
      const duration = 1400;
      const start = performance.now();
      function step(now){
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
  }

  /* ---------- Skill progress rings ---------- */
  function initSkillRings(){
    const rings = document.querySelectorAll('.skill-ring');
    if (!rings.length) return;
    const CIRCUMFERENCE = 2 * Math.PI * 52; // r=52

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          const ring = entry.target;
          const percent = parseInt(ring.dataset.percent, 10) || 0;
          const fg = ring.querySelector('.ring-fg');
          const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;
          fg.style.strokeDasharray = CIRCUMFERENCE;
          requestAnimationFrame(() => { fg.style.strokeDashoffset = offset; });
          observer.unobserve(ring);
        }
      });
    }, { threshold: 0.4 });
    rings.forEach(r => observer.observe(r));
  }

  /* ---------- Portfolio filter ---------- */
  function initPortfolioFilter(){
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.cat === filter;
          card.classList.toggle('hide', !match);
        });
      });
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop(){
    const btn = document.getElementById('backToTop');
    document.addEventListener('scroll', () => {
      btn.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Contact form (front-end only demo) ---------- */
  function initContactForm(){
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'جارٍ الإرسال...';

      setTimeout(() => {
        note.textContent = 'تم إرسال رسالتك بنجاح، سأرد عليك في أقرب وقت ✅';
        submitBtn.disabled = false;
        submitBtn.textContent = 'إرسال الرسالة';
        form.reset();
      }, 900);
    });
  }
})();
