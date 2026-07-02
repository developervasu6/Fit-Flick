/**
 * FIT-FLICK Main JavaScript File
 * Handles slider navigation, mobile menu, and smooth interactions
 * Optimized for all devices
 */

/**
 * Mobile Menu Toggle Handler
 */
class MobileMenuHandler {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMobile = document.getElementById('nav-mobile');
        this.init();
    }

    init() {
        if (!this.hamburger || !this.navMobile) return;

        this.hamburger.addEventListener('click', () => this.toggleMenu());

        // Close menu when link is clicked
        this.navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeMenu();
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMobile.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMobile.classList.remove('active');
    }
}

/**
 * Image Slider Functionality
 */
class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.autoSlideInterval = null;
        this.SLIDE_INTERVAL = 5000; // 5 seconds
        this.init();
    }

    init() {
        if (this.slides.length === 0) return;
        this.handleAutoSlide();
        this.addNavigation();
    }

    /**
     * Automatic slide rotation
     */
    handleAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.SLIDE_INTERVAL);
    }

    /**
     * Show next slide
     */
    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    /**
     * Show previous slide
     */
    prevSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    /**
     * Display specific slide
     * @param {number} n - Slide index
     */
    showSlide(n) {
        // Reset interval on manual interaction
        clearInterval(this.autoSlideInterval);

        if (n >= this.slides.length) {
            this.currentSlide = 0;
        } else if (n < 0) {
            this.currentSlide = this.slides.length - 1;
        } else {
            this.currentSlide = n;
        }

        // Update slide display
        this.slides.forEach(slide => slide.classList.remove('active'));
        this.slides[this.currentSlide].classList.add('active');

        // Restart auto-slide
        this.handleAutoSlide();
    }

    /**
     * Add keyboard navigation
     */
    addNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
    }
}

/**
 * Shop Now Button Handler
 */
function handleShopNow() {
    const shopButtons = document.querySelectorAll('.shop-btn');

    shopButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const outfitId = button.getAttribute('data-outfit');
            console.log(`Shopping for outfit: ${outfitId}`);
            // Add your shop navigation logic here
            // Example: window.location.href = `/outfit/${outfitId}`;
            alert(`Navigating to outfit ${outfitId}...`);
        });
    });
}

/**
 * Smooth Scroll for anchor links
 */
function enableSmoothScroll() {
    document.querySelectorAll('a[href="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

/**
 * Navigation hover effects
 */
function enhanceNavigation() {
    const navLinks = document.querySelectorAll('.nav-links li');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked
            link.classList.add('active');
        });
    });
}

/**
 * Initialize all functionality on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize mobile menu
    const mobileMenu = new MobileMenuHandler();

    // Initialize slider
    const slider = new ImageSlider();

    // Setup Shop Now buttons
    handleShopNow();

    // Enable smooth scrolling
    enableSmoothScroll();

    // Enhance navigation
    enhanceNavigation();

    // Log successful initialization
    console.log('FIT-FLICK initialized successfully - All devices supported');
});

/**
 * Handle window resize for responsive adjustments
 */
window.addEventListener('resize', () => {
    // Add any responsive logic here
    console.log('Window resized');
});

/**
 * Admin Sidebar Toggle Functions
 */
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('show');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

/**
 * Prevent memory leaks - cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
    // Clear any intervals
    if (document.querySelector('.slider')) {
        clearInterval(document.querySelector('.slider').autoSlideInterval);
    }
});
