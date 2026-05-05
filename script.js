/**
 * Premium Career Website - Interactive Features
 * Theme Toggle, Navigation, Timeline Modals, Editable Content
 */

(function () {
    'use strict';

    // =========================================
    // THEME TOGGLE
    // =========================================

    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    function getStoredValue(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function setStoredValue(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Storage can be unavailable in private or restricted browsing modes.
        }
    }

    function getTheme() {
        const saved = getStoredValue('cv-theme');
        if (saved) return saved;
        return prefersDark.matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        setStoredValue('cv-theme', theme);
    }

    // Initialize theme
    setTheme(getTheme());

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    // Listen for system preference changes
    const handleSystemThemeChange = (e) => {
        if (!getStoredValue('cv-theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    };

    if (typeof prefersDark.addEventListener === 'function') {
        prefersDark.addEventListener('change', handleSystemThemeChange);
    } else if (typeof prefersDark.addListener === 'function') {
        prefersDark.addListener(handleSystemThemeChange);
    }

    // =========================================
    // NAVIGATION
    // =========================================

    const nav = document.getElementById('mainNav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navigation
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // =========================================
    // TIMELINE MODAL
    // =========================================

    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');
    const expandButtons = document.querySelectorAll('.timeline-expand');
    const timelineEntries = document.querySelectorAll('.timeline-entry');
    const timelinePlusButtons = document.querySelectorAll('.timeline-plus');
    // New horizontal timeline elements
    const timelineHItems = document.querySelectorAll('.timeline-h-item');
    const timelineHPlusButtons = document.querySelectorAll('.timeline-h-plus');

    function openModal(templateId) {
        const template = document.getElementById(templateId);
        if (template && modalContent && modalOverlay) {
            modalContent.innerHTML = template.innerHTML;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                if (modalContent) modalContent.innerHTML = '';
            }, 400);
        }
    }

    // Old timeline expand buttons
    expandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        });
    });

    // New timeline entries - click on entry to open modal
    timelineEntries.forEach(entry => {
        entry.addEventListener('click', (e) => {
            // Don't trigger if clicking on editable content
            if (e.target.hasAttribute('contenteditable')) return;
            const modalId = entry.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        });
    });

    // New timeline plus buttons
    timelinePlusButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent entry click
            const entry = btn.closest('.timeline-entry');
            const modalId = entry?.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        });
    });

    // Horizontal timeline items - click on item to open modal
    timelineHItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on editable content or plus button
            if (e.target.hasAttribute('contenteditable')) return;
            if (e.target.closest('.timeline-h-plus')) return;
            const modalId = item.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        });
    });

    // Horizontal timeline plus buttons
    timelineHPlusButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.timeline-h-item');
            const modalId = item?.getAttribute('data-modal');
            if (modalId) openModal(modalId);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // =========================================
    // SCROLL ANIMATIONS
    // =========================================

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };

    const scrollObserver = new IntersectionObserver(animateOnScroll, observerOptions);

    // Add initial styles and observe elements
    const animatedElements = document.querySelectorAll(
        '.timeline-card, .experience-card, .skill-card, .education-card, .cert-card, .contact-card'
    );

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        scrollObserver.observe(el);
    });

    // =========================================
    // SMOOTH SCROLL BEHAVIOR
    // =========================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = nav?.offsetHeight || 70;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // PROFILE IMAGE UPLOAD (Optional)
    // =========================================

    const profileImage = document.querySelector('.profile-image');

    if (profileImage) {
        profileImage.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';

            input.onchange = (e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.alt = 'Profile Photo';

                        // Clear placeholder content
                        profileImage.innerHTML = '';
                        profileImage.appendChild(img);

                        // Save to localStorage
                        try {
                            localStorage.setItem('cv-profile-image', event.target.result);
                        } catch (e) {
                            console.log('Image too large to save locally');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };

            input.click();
        });

        // Load saved profile image
        const savedImage = localStorage.getItem('cv-profile-image');
        if (savedImage) {
            profileImage.innerHTML = `<img src="${savedImage}" alt="Profile Photo">`;
        }
    }

    // =========================================
    // AI PROJECTS HORIZONTAL SCROLL
    // =========================================
    const aiGrid = document.getElementById('aiProjectsGrid');
    const scrollLeftBtn = document.getElementById('scrollLeftBtn');
    const scrollRightBtn = document.getElementById('scrollRightBtn');
    
    if (aiGrid && scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', () => {
            const card = aiGrid.querySelector('.ai-project-card');
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(getComputedStyle(aiGrid).gap) || 0;
            aiGrid.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        });

        scrollRightBtn.addEventListener('click', () => {
            const card = aiGrid.querySelector('.ai-project-card');
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const gap = parseFloat(getComputedStyle(aiGrid).gap) || 0;
            aiGrid.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
        });
    }

    // =========================================
    // AI PROJECTS READ MORE LOGIC
    // =========================================
    window.addEventListener('load', () => {
        const usecases = document.querySelectorAll('.ai-project-usecase');
        usecases.forEach(usecase => {
            const p = usecase.querySelector('p');
            // Compare scrollable height versus the 4-line constrained clientHeight
            if (p && p.scrollHeight > p.clientHeight + 2) {
                const btn = document.createElement('button');
                btn.className = 'read-more-btn';
                btn.textContent = 'Read More';
                usecase.appendChild(btn);

                btn.addEventListener('click', () => {
                    p.classList.toggle('expanded');
                    btn.textContent = p.classList.contains('expanded') ? 'Read Less' : 'Read More';
                });
            }
        });
    });

})();

// =========================================
// VERTICAL TIMELINE TOGGLE (must be global for onclick)
// =========================================

function toggleTimelineCard(btn) {
    const card = btn.closest('.timeline-alt-card');
    if (!card) return;

    const drawer = card.querySelector('.timeline-alt-drawer');
    const icon = btn.querySelector('.toggle-icon');
    if (!drawer) return;

    drawer.classList.toggle('open');
    btn.classList.toggle('active');

    // Highlight card when open
    if (drawer.classList.contains('open')) {
        card.style.borderColor = 'rgba(234, 88, 12, 0.3)';
        card.style.background = 'rgba(23, 23, 23, 0.8)';
    } else {
        card.style.borderColor = '';
        card.style.background = '';
    }
}
