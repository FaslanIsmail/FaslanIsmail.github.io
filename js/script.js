/**
 * Mohamed Ismail Mohamed Faslan — Portfolio Interactivity
 * High-tech Engineering UX: Mobile Navigation, Scrollspy, Reveal, Copy Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link:not(.nav-cv-link)');
  const sections = document.querySelectorAll('section[id]');
  const reveals = document.querySelectorAll('.reveal');
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');

  let toastTimeout = null;

  // --- Sticky Header Scroll State ---
  const handleScrollHeader = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollHeader, { passive: true });
  handleScrollHeader(); // Initial check

  // --- Mobile Drawer Menu ---
  const openMobileMenu = () => {
    if (!mobileNav) return;
    mobileNav.style.display = 'block';
    // Force reflow for CSS transition
    void mobileNav.offsetHeight;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!mobileNav.classList.contains('open')) {
        mobileNav.style.display = 'none';
      }
    }, 320);
  };

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileNavClose?.addEventListener('click', closeMobileMenu);
  mobileNavBackdrop?.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --- Scrollspy Navigation Highlighting ---
  const scrollspyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        // Update desktop links
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update mobile links
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => scrollspyObserver.observe(section));

  // --- Scroll Reveal Animations ---
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unsupported
    reveals.forEach(el => el.classList.add('revealed'));
  }

  // --- Copy to Clipboard Feedback Toast ---
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = button.textContent;
        button.textContent = 'Copied! ✓';
        button.style.borderColor = 'var(--accent)';
        button.style.color = 'var(--accent)';
        showToast(`Copied: ${textToCopy}`);

        setTimeout(() => {
          button.textContent = originalText;
          button.style.borderColor = '';
          button.style.color = '';
        }, 2000);
      } catch (err) {
        showToast(`Selected: ${textToCopy}`);
      }
    });
  });

  // --- LinkedIn Activity Carousel Controls & Tabs ---
  const activityTrack = document.getElementById('activityTrack');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const activityTabs = document.querySelectorAll('.activity-tab');

  if (activityTrack) {
    const getScrollStep = () => {
      const card = activityTrack.querySelector('.linkedin-card');
      return card ? card.offsetWidth + 20 : 360;
    };

    carouselPrev?.addEventListener('click', () => {
      activityTrack.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    carouselNext?.addEventListener('click', () => {
      activityTrack.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    activityTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activityTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  }
});