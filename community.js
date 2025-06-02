document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const copyrightElement = document.querySelector('.copyright-text');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }
    
    // Kode yang sudah ada di community.js
    // Active class for navigation
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove the active class from all links
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            
            // Add the active class to the clicked link
            this.classList.add('active');
        });
    });

    // Recent popup functionality
    const recentTrigger = document.getElementById('recent-trigger');
    const recentPopup = document.getElementById('recent-popup');
    const closePopup = document.getElementById('close-popup');

    recentTrigger.addEventListener('click', function() {
        recentPopup.classList.add('active');
    });

    closePopup.addEventListener('click', function() {
        recentPopup.classList.remove('active');
    });
});