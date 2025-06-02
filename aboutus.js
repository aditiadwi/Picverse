// Menambahkan efek active pada tautan navigasi
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const copyrightElement = document.querySelector('.copyright-text');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }
    
    // Handle navigation active state
    const navLinks = document.querySelectorAll('.nav-link');
            
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Efek click untuk logo
    const logo = document.getElementById('picverseLogo');

    logo.addEventListener('click', function() {
        // Redirect ke halaman utama jika diperlukan
        window.location.href = 'home.html';
    });
});