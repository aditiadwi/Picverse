document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const copyrightElement = document.querySelector('.copyright-text');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }
    
    // Slideshow functionality
    const slides = document.querySelector('.slides');
    const slideNav = document.querySelector('.slide-nav');
    const currentArtistElement = document.getElementById('currentArtist');
    
    if (slides && slideNav) {
        const slideElements = document.querySelectorAll('.slide');
        const slideCount = slideElements.length;
        let currentSlide = 0;
        
        // Create navigation dots
        for (let i = 0; i < slideCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slide-nav-btn');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            slideNav.appendChild(dot);
        }
        
        function goToSlide(n) {
            slides.style.transform = `translateX(-${n * 100}%)`;
            
            // Update active dot
            document.querySelectorAll('.slide-nav-btn').forEach((dot, i) => {
                dot.classList.toggle('active', i === n);
            });
            
            // Update current artist
            const currentSlideImg = slideElements[n].querySelector('img');
            if (currentSlideImg) {
                const artist = currentSlideImg.dataset.artist || 'Unknown Artist';
                currentArtistElement.textContent = `By ${artist}`;
            }
            
            currentSlide = n;
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        }
        
        // Auto slide
        let slideInterval = setInterval(nextSlide, 4000);
        
        // Pause on hover
        const slideContainer = document.querySelector('.slide-container');
        if (slideContainer) {
            slideContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            slideContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }
    
    // Make tags clickable
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            alert(`You clicked on ${tag.textContent} tag! Redirecting to related artworks...`);
        });
    });
    
    // Make art cards clickable
    document.querySelectorAll('.art-card').forEach(card => {
        card.addEventListener('click', () => {
            const titleEl = card.querySelector('.art-title');
            const artistEl = card.querySelector('.art-artist');
            const likesEl = card.querySelector('.art-likes');
            
            const title = titleEl ? titleEl.textContent : 'Unknown Title';
            const artist = artistEl ? artistEl.textContent : 'Unknown Artist';
            const likes = likesEl ? likesEl.textContent : '0 likes';
            
            alert(`"${title}" by ${artist} with ${likes}`);
        });
    });
});