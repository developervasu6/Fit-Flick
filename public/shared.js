/**
 * FIT-FLICK Admin JavaScript File
 * Handles admin sidebar, mobile menu, and admin-specific interactions
 */

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
 * Set active class on sidebar links based on current URL
 */
function setActiveSidebarLink() {
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('#sidebar ul li a');

    sidebarLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPath) {
            link.parentElement.classList.add('active');
        } else {
            link.parentElement.classList.remove('active');
        }
    });
}

/**
 * Initialize admin functionality on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
    setActiveSidebarLink();
    console.log('FIT-FLICK Admin initialized successfully');
});