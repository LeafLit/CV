/* =============================================================
   main.js — 轻量交互脚本
   功能:
   1. 导航滚动样式 (scrolled class)
   2. 汉堡菜单切换 (移动端)
   3. 滚动渐入动效 (IntersectionObserver)
   4. 图片懒加载 (IntersectionObserver)
   5. 平滑锚点滚动
   6. 导航链接高亮当前区块
============================================================= */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. 导航: 滚动后加 .scrolled 样式
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ----------------------------------------------------------
     2. 汉堡菜单 (移动端)
  ---------------------------------------------------------- */
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    mobileOverlay.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // 点击遮罩关闭
  mobileOverlay.addEventListener('click', closeMenu);

  // 点击导航链接关闭菜单
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // ESC 键关闭
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });


  /* ----------------------------------------------------------
     3. 滚动渐入动效 (.fade-up)
  ---------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-up');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // 降级处理: 直接显示
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ----------------------------------------------------------
     4. 图片懒加载
  ---------------------------------------------------------- */
  const lazyImgs = document.querySelectorAll('img.lazy');

  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (src) {
              img.src = src;
              img.addEventListener('load', function () {
                img.classList.add('loaded');
              });
              img.addEventListener('error', function () {
                // 图片加载失败时保留占位图，移除模糊
                img.classList.add('loaded');
              });
            }
            imgObserver.unobserve(img);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    lazyImgs.forEach(function (img) {
      imgObserver.observe(img);
    });
  } else {
    // 降级: 直接加载
    lazyImgs.forEach(function (img) {
      const src = img.getAttribute('data-src');
      if (src) img.src = src;
    });
  }


  /* ----------------------------------------------------------
     5. 平滑锚点滚动 (兼容不支持 scroll-behavior 的浏览器)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------
     6. 导航高亮当前区块
  ---------------------------------------------------------- */
  const sections    = document.querySelectorAll('section[id], footer[id]');
  const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.style.color = '';
          });
          const active = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
          if (active) active.style.color = 'var(--ink)';
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (sec) {
    sectionObserver.observe(sec);
  });


  /* ----------------------------------------------------------
     7. 卡片交错渐入 (staggered delay)
  ---------------------------------------------------------- */
  document.querySelectorAll('.cards-grid .card, .hobbies-grid .hobby-card').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 80 + 'ms';
  });

})();
