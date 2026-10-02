'use strict';

/* ============================================
   Wait for Swiper
   ============================================ */
function waitForSwiper(callback, attempts = 0) {
    if (typeof Swiper !== 'undefined') {
        callback();
        return;
    }
    if (attempts >= 50) {
        console.error('Swiper failed to load.');
        return;
    }
    setTimeout(() => waitForSwiper(callback, attempts + 1), 100);
}

waitForSwiper(initApp);

function initApp() {

    /* --------------------------------------------
       Cache DOM
       -------------------------------------------- */
    const currentEl = document.querySelector('[data-current]');
    const totalEl = document.querySelector('[data-total]');
    const progressFill = document.querySelector('[data-progress]');
    const slides = document.querySelectorAll('.swiper-slide');
    const TOTAL = slides.length;

    /* --------------------------------------------
       Swiper
       -------------------------------------------- */
    const swiper = new Swiper('.main-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 700,
        grabCursor: true,

        touchStartPreventDefault: false,
        simulateTouch: true,
        allowTouchMove: true,
        preventClicks: false,
        preventClicksPropagation: false,

        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },

        mousewheel: {
            forceToAxis: true,
            sensitivity: 1,
            releaseOnEdges: false,
            thresholdDelta: 20,
            thresholdTime: 400,
        },

        navigation: {
            nextEl: '[data-next]',
            prevEl: '[data-prev]',
        },

        on: {
            init(sw) {
                updateCounter(sw.activeIndex);
                animateSkills(sw.slides[sw.activeIndex]);
            },
            slideChange(sw) {
                updateCounter(sw.activeIndex);
                animateSkills(sw.slides[sw.activeIndex]);
            },
        },
    });

    /* --------------------------------------------
       Counter + Progress update
       -------------------------------------------- */
    function updateCounter(index) {
        // Counter text (01, 02, ...)
        currentEl.textContent = String(index + 1).padStart(2, '0');

        // Progress bar width
        const percent = ((index + 1) / TOTAL) * 100;
        progressFill.style.width = percent + '%';
    }

    /* --------------------------------------------
       Initialize total count
       -------------------------------------------- */
    totalEl.textContent = String(TOTAL).padStart(2, '0');

    /* --------------------------------------------
       Nav + goto buttons
       -------------------------------------------- */
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.style.cursor = 'pointer';

        el.addEventListener('mousedown', e => e.stopPropagation());
        el.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
        el.addEventListener('pointerdown', e => e.stopPropagation());

        el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const i = parseInt(this.dataset.goto, 10);
            if (!isNaN(i) && swiper) {
                swiper.slideTo(i);
            }
            return false;
        }, true);
    });

    /* --------------------------------------------
       Skill bars animation
       -------------------------------------------- */
    function animateSkills(slide) {
        if (!slide) return;
        const fills = slide.querySelectorAll('.skill-fill');
        if (!fills.length) return;

        fills.forEach(f => { f.style.width = '0'; });

        requestAnimationFrame(() => {
            setTimeout(() => {
                fills.forEach(f => {
                    f.style.width = f.dataset.fill + '%';
                });
            }, 300);
        });
    }

    /* --------------------------------------------
       Contact form
       -------------------------------------------- */
    const form = document.querySelector('[data-form]');
    const inputs = document.querySelectorAll('[data-input]');
    const submitBtn = document.querySelector('[data-submit]');

    if (form && submitBtn) {
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                submitBtn.disabled = !form.checkValidity();
            });
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            submitBtn.textContent = 'Sent';
            submitBtn.disabled = true;
            setTimeout(() => {
                form.reset();
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = true;
            }, 1800);
        });
    }
}