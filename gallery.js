/**
 * PicVerse Gallery - JavaScript
 * Menangani fungsionalitas galeri seni dan sistem popup/modal
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const copyrightElement = document.querySelector('.copyright-text');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }

    // Initialize all gallery features
    initGallery();
});

function initGallery() {
    // Setup popup system
    setupPopupSystem();
    
    // Setup additional features
    setupMobileFeatures();
    fixMobileViewportHeight();
    setupLazyLoading();
    
    // Event listeners for window events
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
}

/**
 * === POPUP/MODAL SYSTEM ===
 */
function setupPopupSystem() {
    // 1. Tangani semua link yang mengarah ke popup
    const galleryLinks = document.querySelectorAll('a[href^="#popup-"]');
    galleryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            openPopup(targetId);
        });
    });

    // 2. Tangani semua tombol close
    const closeButtons = document.querySelectorAll('.close-modal, .back-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closePopup();
        });
    });

    // 3. Tutup popup jika mengklik luar konten
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('popup')) {
            closePopup();
        }
    });

    // 4. Support untuk keyboard accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePopup();
        }
    });
    
    // 5. Atur status awal berdasarkan URL
    if (window.location.hash.startsWith('#popup-')) {
        const targetId = window.location.hash.substring(1);
        openPopup(targetId);
    }
}

// Fungsi untuk membuka popup
function openPopup(popupId) {
    // Sembunyikan semua popup terlebih dahulu
    hideAllPopups();
    
    // Tampilkan popup yang dipilih
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.style.opacity = '1';
        popup.style.visibility = 'visible';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Simpan scroll position
        window.popupScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Enable keyboard navigation within the popup
        setupPopupNavigation(popup);
        
        // Update URL (opsional, dapat dikomentari jika tidak diinginkan)
        history.pushState(null, null, `#${popupId}`);
    }
}

// Fungsi untuk menutup popup
function closePopup() {
    // Sembunyikan semua popup
    hideAllPopups();
    
    // Restore scroll position
    document.body.style.overflow = ''; // Enable scrolling again
    if (window.popupScrollPosition !== undefined) {
        window.scrollTo(0, window.popupScrollPosition);
    }
    
    // Update URL without hash fragment
    history.pushState(null, null, window.location.pathname + window.location.search);
}

// Fungsi untuk menyembunyikan semua popup
function hideAllPopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.style.opacity = '0';
        popup.style.visibility = 'hidden';
    });
}

// Setup navigasi antar artwork dalam satu kategori
function setupPopupNavigation(popup) {
    // Find navigation buttons in this popup
    const prevButton = popup.querySelector('#prevImage');
    const nextButton = popup.querySelector('#nextImage');
    
    // If navigation buttons exist, setup their click handlers
    if (prevButton) {
        prevButton.addEventListener('click', navigateToPreviousArtwork);
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', navigateToNextArtwork);
    }
}

// Navigate to previous artwork
function navigateToPreviousArtwork(e) {
    e.preventDefault();
    navigateArtwork('prev');
}

// Navigate to next artwork
function navigateToNextArtwork(e) {
    e.preventDefault();
    navigateArtwork('next');
}

// Helper function to navigate between artworks
function navigateArtwork(direction) {
    // Get current popup ID from URL
    const currentPopupId = window.location.hash.substring(1);
    
    if (!currentPopupId.startsWith('popup-')) return;
    
    // Extract the category and artwork number
    const parts = currentPopupId.split('-');
    if (parts.length < 2) return;
    
    const category = parts[1]; // e.g., "picasso", "digital"
    const currentNumber = parseInt(parts[2]) || 1;
    
    // Find all artworks in this category
    const artworkLinks = Array.from(document.querySelectorAll(`a[href^="#popup-${category}"]`));
    if (artworkLinks.length === 0) return;
    
    // Sort by number
    artworkLinks.sort((a, b) => {
        const numA = parseInt(a.getAttribute('href').split('-')[2]) || 0;
        const numB = parseInt(b.getAttribute('href').split('-')[2]) || 0;
        return numA - numB;
    });
    
    // Find current index
    const currentIndex = artworkLinks.findIndex(link => 
        link.getAttribute('href') === `#${currentPopupId}`
    );
    
    if (currentIndex === -1) return;
    
    // Calculate new index
    let newIndex;
    if (direction === 'next') {
        newIndex = (currentIndex + 1) % artworkLinks.length;
    } else {
        newIndex = (currentIndex - 1 + artworkLinks.length) % artworkLinks.length;
    }
    
    // Get new popup ID and open it
    const newPopupId = artworkLinks[newIndex].getAttribute('href').substring(1);
    openPopup(newPopupId);
}

/**
 * === MOBILE FEATURES ===
 */
function setupMobileFeatures() {
    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Add class to body for CSS targeting
    document.body.classList.add(isTouchDevice ? 'touch-device' : 'no-touch');
    
    if (isTouchDevice) {
        setupSwipeGestures();
        setupPinchZoom();
    }
}

// Setup swipe gestures for popup navigation
function setupSwipeGestures() {
    const popups = document.querySelectorAll('.popup');
    
    popups.forEach(popup => {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        // When touch starts
        popup.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        // When touch ends
        popup.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe(popup);
        }, false);
        
        // Function to handle swipe gesture
        function handleSwipe() {
            const swipeDistanceX = touchEndX - touchStartX;
            const swipeDistanceY = touchEndY - touchStartY;
            const minSwipeDistance = 100;
            
            // Ensure horizontal swipe is dominant
            if (Math.abs(swipeDistanceX) > Math.abs(swipeDistanceY) && Math.abs(swipeDistanceX) > minSwipeDistance) {
                if (swipeDistanceX > 0) {
                    // Swipe right - previous artwork
                    navigateArtwork('prev');
                } else {
                    // Swipe left - next artwork
                    navigateArtwork('next');
                }
            } 
            // Vertical swipe to close
            else if (swipeDistanceY < -minSwipeDistance) {
                closePopup();
            }
        }
    });
}

// Setup pinch zoom for images in popup
function setupPinchZoom() {
    const modalImages = document.querySelectorAll('.modal-image');
    
    modalImages.forEach(img => {
        let initialScale = 1;
        let currentScale = 1;
        let initialDistance = 0;
        
        // Store initial position on touch start
        img.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = getDistance(e.touches[0], e.touches[1]);
                e.preventDefault(); // Prevent default browser pinch zoom
            }
        });
        
        // Handle pinch movement
        img.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault(); // Prevent default browser behavior
                
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const scale = currentDistance / initialDistance;
                
                currentScale = Math.min(Math.max(initialScale * scale, 1), 3); // Limit scale 1x-3x
                
                img.style.transform = `scale(${currentScale})`;
            }
        });
        
        // Store final scale when touch ends
        img.addEventListener('touchend', () => {
            initialScale = currentScale;
            
            // Reset scale if below threshold
            if (currentScale < 1.05) {
                img.style.transform = 'scale(1)';
                initialScale = 1;
                currentScale = 1;
            }
        });
        
        // Double-tap to reset zoom
        let lastTap = 0;
        img.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                img.style.transform = 'scale(1)';
                initialScale = 1;
                currentScale = 1;
            }
            
            lastTap = currentTime;
        });
    });
    
    // Helper function to calculate distance between two touch points
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * === BROWSER & VIEWPORT FIXES ===
 */

// Fix for mobile viewport height issue (100vh)
function fixMobileViewportHeight() {
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH(); // Set initially
}

// Handle orientation change
function handleOrientationChange() {
    setTimeout(() => {
        fixMobileViewportHeight();
        
        // If a popup is open, update its position and size
        if (window.location.hash.startsWith('#popup-')) {
            const popup = document.querySelector(window.location.hash);
            if (popup) {
                // Ensure the popup is properly sized for new orientation
                popup.style.opacity = '1';
                popup.style.visibility = 'visible';
            }
        }
    }, 200); // Small delay to ensure screen has fully rotated
}

// Handle window resize
function handleResize() {
    fixMobileViewportHeight();
}

/**
 * === PERFORMANCE OPTIMIZATION ===
 */

// Setup lazy loading for gallery images
function setupLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img.artwork-thumbnail');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        // Implementasi manual lazy loading menggunakan Intersection Observer API
        // untuk browser yang tidak mendukung atribut loading
        const images = document.querySelectorAll('img.artwork-thumbnail');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src || img.getAttribute('src');
                        
                        if (src) {
                            img.src = src;
                            img.classList.add('loaded');
                        }
                        
                        // Berhenti mengamati gambar setelah dimuat
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px', // Muat gambar 50px sebelum terlihat
                threshold: 0.01 // Trigger saat 1% gambar terlihat
            });
            
            // Simpan src asli dan ganti dengan placeholder
            images.forEach(img => {
                // Simpan src asli dalam data-src jika belum ada
                if (!img.dataset.src && img.src) {
                    img.dataset.src = img.src;
                    // Ganti dengan placeholder ringan
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3C/svg%3E';
                }
                
                // Mulai mengamati gambar
                imageObserver.observe(img);
            });
        } else {
            // Fallback untuk browser yang tidak mendukung Intersection Observer
            // Langsung tampilkan semua gambar
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        }
    }
}