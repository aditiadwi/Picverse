// Deklarasi variabel global
let form, emailInput, titleInput, descriptionInput, tagsInput, fileInput, fileDisplayName;
let previewContainer, imagePreview, processingIndicator, detectionResults, submitBtn, aiDetectionBadge, aiAccuracy;

// Inisialisasi kode ketika dokumen telah dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year automatically
    const copyrightElement = document.querySelector('.copyright-text');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }
    
    // Form elements
    form = document.getElementById('artSubmissionForm');
    emailInput = document.getElementById('email');
    titleInput = document.getElementById('title');
    descriptionInput = document.getElementById('description');
    tagsInput = document.getElementById('tags');
    fileInput = document.getElementById('fileUpload');
    fileDisplayName = document.getElementById('fileDisplayName');
    previewContainer = document.getElementById('imagePreviewContainer');
    imagePreview = document.getElementById('imagePreview');
    processingIndicator = document.getElementById('processingIndicator');
    detectionResults = document.getElementById('detectionResults');
    submitBtn = document.getElementById('submitBtn');
    aiDetectionBadge = document.getElementById('aiDetectionBadge');
    aiAccuracy = document.getElementById('aiAccuracy');

    // Initialize event listeners
    initializeEventListeners();
});

// Initialize event listeners
function initializeEventListeners() {
    // File upload change event
    fileInput.addEventListener('change', handleFileSelection);
    
    // Form validation events
    emailInput.addEventListener('input', () => validateField(validateEmail, emailInput, 'emailError'));
    emailInput.addEventListener('blur', () => validateField(validateEmail, emailInput, 'emailError'));
    
    titleInput.addEventListener('input', () => validateField(validateTitle, titleInput, 'titleError'));
    titleInput.addEventListener('blur', () => validateField(validateTitle, titleInput, 'titleError'));
    
    descriptionInput.addEventListener('input', () => validateField(validateDescription, descriptionInput, 'descriptionError'));
    descriptionInput.addEventListener('blur', () => validateField(validateDescription, descriptionInput, 'descriptionError'));
    
    tagsInput.addEventListener('input', () => validateField(validateTags, tagsInput, 'tagsError'));
    tagsInput.addEventListener('blur', () => validateField(validateTags, tagsInput, 'tagsError'));
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);
}

// Handle file selection
function handleFileSelection() {
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        fileDisplayName.value = file.name;
        
        // Validate file type
        const isValidFile = validateFileType();
        
        if (isValidFile) {
            // Show preview
            displayImagePreview(file);
        } else {
            // Hide preview if invalid
            previewContainer.style.display = 'none';
        }
    } else {
        fileDisplayName.value = '';
        previewContainer.style.display = 'none';
    }
}

// Display image preview and start AI detection
function displayImagePreview(file) {
    // Create a URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    imagePreview.src = imageUrl;
    
    // Show preview container and processing indicator
    previewContainer.style.display = 'block';
    processingIndicator.style.display = 'block';
    detectionResults.style.display = 'none';
    
    // Simulate AI detection (with delay to show loading)
    setTimeout(() => {
        detectAI(imageUrl, file.name);
    }, 1500);
}

// Advanced AI image detection with more realistic simulation
function detectAI(imageUrl, fileName) {
    fileName = fileName.toLowerCase();
    
    try {
        // Analyze traditional media indicators in filename
        const humanArtKeywords = ['painting', 'drawing', 'sketch', 'traditional', 'watercolor', 
                              'acrylic', 'oil', 'pencil', 'charcoal', 'pastel', 'crayon',
                              'handmade', 'handdrawn', 'hand-drawn', 'hand-painted'];
                              
        // AI keywords for detection
        const aiKeywords = ['midjourney', 'dalle', 'stable-diffusion', 'deepdream', 
                         'ai-generated', 'ai-created', 'artificial-intelligence'];
        
        // Check for clear indicators in filename
        let isLikelyTraditionalArt = humanArtKeywords.some(keyword => fileName.includes(keyword));
        let isLikelyAI = aiKeywords.some(keyword => fileName.includes(keyword));
        
        // Get more realistic image characteristics
        const imageAnalysis = analyzeImageCharacteristics(imageUrl, fileName);
        
        // Simulate AI analysis results
        let result, confidence, detailMessage;
        
        // Combined analysis based on filename hints and simulated visual analysis
        if (isLikelyTraditionalArt && !isLikelyAI) {
            // Strong bias for human if traditional media indicators present
            result = "Human Created";
            confidence = 85 + Math.floor(Math.random() * 10);
            detailMessage = getDetailedHumanPatterns(imageAnalysis.type, true);
        } else if (isLikelyAI && !isLikelyTraditionalArt) {
            // Strong bias for AI if AI indicators present
            result = "AI Generated";
            confidence = 90 + Math.floor(Math.random() * 8);
            detailMessage = getDetailedAiPatterns(imageAnalysis.type, true);
        } else {
            // More nuanced analysis based on simulated image analysis
            result = imageAnalysis.result;
            confidence = imageAnalysis.confidence;
            detailMessage = imageAnalysis.detailMessage;
        }
        
        // Update the UI with detection results
        processingIndicator.style.display = 'none';
        detectionResults.style.display = 'block';
        
        aiDetectionBadge.textContent = result;
        aiDetectionBadge.className = "ai-badge " + getBadgeClass(result);
        aiAccuracy.innerHTML = `Confidence: ${confidence}%<br>${detailMessage}`;
        
    } catch (e) {
        // Error handling
        console.error("Error analyzing image:", e);
        processingIndicator.style.display = 'none';
        detectionResults.style.display = 'block';
        
        aiDetectionBadge.textContent = "Analysis Error";
        aiDetectionBadge.className = "ai-badge uncertain";
        aiAccuracy.textContent = "Could not complete image analysis. Please try again.";
    }
}

// Improved simulation of image analysis using image characteristics
function analyzeImageCharacteristics(imageUrl, fileName) {
    // In a real application, this would be a call to a machine learning API
    // For simulation, we'll use a variety of image characteristics
    
    // Create date-based seed for consistent but varied results
    const date = new Date();
    const seed = date.getHours() + date.getMinutes() + date.getDate();
    
    // Simulated image type based on file name and extension
    let imageType = "digital"; // default
    
    if (fileName.includes('photo') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        imageType = "photo";
    } else if (fileName.includes('paint') || fileName.includes('art') || fileName.endsWith('.png')) {
        imageType = "painting";
    }
    
    // Analyze image based on simulated characteristics
    const fileSize = fileName.length * 10000; // Simple simulation based on name length
    const hasComplexTextures = (seed % 4 > 1); // 50% chance
    const hasUniformPatterns = (seed % 5 > 2); // 40% chance
    const hasNaturalImperfections = (seed % 3 > 0); // 66% chance
    
    // Weighted scoring based on characteristics
    let aiScore = 50; // base score
    
    // Size-based factor (larger files tend to be human-created)
    if (fileSize > 500000) aiScore -= 10;
    else if (fileSize < 100000) aiScore += 15;
    
    // Texture analysis
    if (hasComplexTextures) aiScore -= 15;
    else aiScore += 10;
    
    // Pattern analysis
    if (hasUniformPatterns) aiScore += 20;
    else aiScore -= 10;
    
    // Imperfection analysis
    if (hasNaturalImperfections) aiScore -= 25;
    else aiScore += 15;
    
    // Add randomness factor (simulating ML confidence variance)
    aiScore += (seed % 30) - 15; // -15 to +15 random adjustment
    
    // Constrain score to 0-100 range
    aiScore = Math.max(0, Math.min(100, aiScore));
    
    // Convert score to classification
    let result, detailMessage;
    let confidence = Math.round(40 + Math.abs(50 - aiScore)); // higher confidence at extremes
    
    if (aiScore > 80) {
        result = "AI Generated";
        detailMessage = getDetailedAiPatterns(imageType, true);
    } else if (aiScore > 65) {
        result = "Likely AI";
        detailMessage = getDetailedAiPatterns(imageType, false);
    } else if (aiScore > 45) {
        result = "Uncertain";
        detailMessage = "Mixed characteristics, difficult to determine with confidence";
        confidence = Math.min(confidence, 70); // cap confidence for uncertain results
    } else if (aiScore > 30) {
        result = "Likely Human";
        detailMessage = getDetailedHumanPatterns(imageType, false);
    } else {
        result = "Human Created";
        detailMessage = getDetailedHumanPatterns(imageType, true);
    }
    
    return {
        type: imageType,
        result: result,
        confidence: confidence,
        detailMessage: detailMessage
    };
}

// Get badge class based on result
function getBadgeClass(result) {
    if (result.includes("AI")) return "ai-detected";
    if (result.includes("Human")) return "not-ai";
    return "uncertain";
}

// Generate detailed detection messages for AI patterns
function getDetailedAiPatterns(imageType, definite) {
    const prefix = definite ? "Karakteristik terdeteksi:" : "Indikasi terlihat:";
    
    if (imageType === "photo") {
        return `${prefix} pencahayaan tidak konsisten, tekstur tidak alami, simetri terlalu sempurna pada fitur wajah, dan detail yang terlalu uniform di area bayangan.`;
    } else if (imageType === "digital") {
        return `${prefix} pola algoritmik, detail yang terlalu uniform, dan presisi matematis pada elemen gambar yang tidak biasa dalam karya buatan manusia.`;
    } else {
        return `${prefix} pola goresan tidak alami, presisi matematis pada detail, kurangnya imperfeksi alami yang biasanya terlihat dalam karya artistik manusia.`;
    }
}

// Generate detailed detection messages for human patterns
function getDetailedHumanPatterns(imageType, definite) {
    const prefix = definite ? "Karakteristik terdeteksi:" : "Indikasi terlihat:";
    
    if (imageType === "photo") {
        return `${prefix} variasi pencahayaan alami, tekstur realistis, perspektif otentik, dan kedalaman bidang yang konsisten dengan fotografi tradisional.`;
    } else if (imageType === "digital") {
        return `${prefix} pola goresan yang disengaja, penempatan elemen secara manual, pilihan artistik alami, dan variasi detail yang konsisten dengan karya digital buatan manusia.`;
    } else {
        return `${prefix} teknik sapuan kuas tradisional, variasi alami, tekstur buatan tangan, imperfeksi artistik yang menunjukkan sentuhan manusia.`;
    }
}

// Form validation functions
function validateField(validationFn, inputElement, errorId) {
    const isValid = validationFn();
    const errorElement = document.getElementById(errorId);
    
    if (!isValid) {
        inputElement.classList.add('error-input');
        errorElement.style.display = 'block';
    } else {
        inputElement.classList.remove('error-input');
        errorElement.style.display = 'none';
    }
    
    return isValid;
}

// Email validation
function validateEmail() {
    const email = emailInput.value.trim();
    
    if (!email) return false;
    
    // Check if email contains @ and has a domain
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');
    
    return !(atIndex < 1 || dotIndex < atIndex + 2 || dotIndex + 2 >= email.length);
}

// Title validation - each word should start with capital letter
function validateTitle() {
    const title = titleInput.value.trim();
    
    if (!title) return false;
    
    const words = title.split(' ').filter(word => word.length > 0);
    
    // Check if each word starts with capital letter
    return words.every(word => word[0] >= 'A' && word[0] <= 'Z');
}

// Description validation - sentences should end with period
function validateDescription() {
    const description = descriptionInput.value.trim();
    
    if (!description) return false;
    
    // Check if description ends with a period
    if (description[description.length - 1] !== '.') return false;
    
    // Check individual sentences
    const sentences = description.split('.').filter(sentence => sentence.trim().length > 0);
    
    // If no complete sentences found, fail validation
    if (sentences.length === 0) return false;
    
    return true;
}

// Tags validation - should start with #
function validateTags() {
    const tags = tagsInput.value.trim();
    
    if (!tags) return false;
    
    const tagList = tags.split(' ').filter(tag => tag.trim() !== '');
    
    // Check if there's at least one tag and all tags start with #
    return tagList.length > 0 && tagList.every(tag => tag[0] === '#');
}

// File validation - check file type
function validateFileType() {
    const errorElement = document.getElementById('fileError');
    
    if (fileInput.files.length === 0) {
        errorElement.style.display = 'block';
        return false;
    }
    
    const fileName = fileInput.files[0].name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));
    
    errorElement.style.display = isValid ? 'none' : 'block';
    return isValid;
}

// Handle form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    // Disable submit button to prevent double submission
    submitBtn.disabled = true;
    
    // Run all validations
    const isEmailValid = validateField(validateEmail, emailInput, 'emailError');
    const isTitleValid = validateField(validateTitle, titleInput, 'titleError');
    const isDescriptionValid = validateField(validateDescription, descriptionInput, 'descriptionError');
    const isTagsValid = validateField(validateTags, tagsInput, 'tagsError');
    const isFileValid = validateFileType();
    
    // Re-enable submit button
    submitBtn.disabled = false;
    
    // If all validations pass, submit the form
    if (isEmailValid && isTitleValid && isDescriptionValid && isTagsValid && isFileValid) {
        // Show success message
        alert('Your artwork has been submitted successfully!');
        
        // Reset the form
        form.reset();
        fileDisplayName.value = '';
        previewContainer.style.display = 'none';
        
        // Remove error classes
        const inputs = [emailInput, titleInput, descriptionInput, tagsInput];
        inputs.forEach(input => input.classList.remove('error-input'));
        
        // Hide all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(element => {
            element.style.display = 'none';
        });
        
        // In a real application, you would submit the form to a server here
        // form.submit();
    } else {
        // Scroll to the first error
        const firstError = document.querySelector('.error-input') || document.getElementById('fileError');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
}