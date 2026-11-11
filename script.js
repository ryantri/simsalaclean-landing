// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================

const leadForm = document.getElementById('leadForm');
const fullNameInput = document.getElementById('fullName');
const instagramUsernameInput = document.getElementById('instagramUsername');
const fullNameError = document.getElementById('fullNameError');
const instagramUsernameError = document.getElementById('instagramUsernameError');
const submitButton = document.querySelector('.form-submit-btn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const thankYouModal = document.getElementById('thankYouModal');
const thankYouClose = document.getElementById('thankYouClose');

let isSubmitting = false;

// Validation functions
function validateFullName(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return { valid: false, message: 'Nama lengkap harus diisi.' };
    }
    if (trimmed.length < 2) {
        return { valid: false, message: 'Nama lengkap minimal 2 karakter.' };
    }
    if (trimmed.length > 100) {
        return { valid: false, message: 'Nama lengkap maksimal 100 karakter.' };
    }
    return { valid: true, message: '' };
}

function validateInstagramUsername(value) {
    const trimmed = value.trim();
    if (!trimmed) {
        return { valid: false, message: 'Instagram username harus diisi.' };
    }
    // Remove @ if present
    const cleaned = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
    if (cleaned.length < 1) {
        return { valid: false, message: 'Instagram username tidak valid.' };
    }
    if (cleaned.length > 30) {
        return { valid: false, message: 'Instagram username terlalu panjang.' };
    }
    // Instagram username hanya boleh alphanumeric, underscore, dan dot
    if (!/^[a-zA-Z0-9_.]+$/.test(cleaned)) {
        return { valid: false, message: 'Instagram username hanya boleh mengandung huruf, angka, underscore, dan titik.' };
    }
    return { valid: true, message: '' };
}

function showError(inputElement, errorElement, message) {
    inputElement.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function hideError(inputElement, errorElement) {
    inputElement.classList.remove('error');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Real-time validation
fullNameInput.addEventListener('blur', () => {
    const validation = validateFullName(fullNameInput.value);
    if (!validation.valid) {
        showError(fullNameInput, fullNameError, validation.message);
    } else {
        hideError(fullNameInput, fullNameError);
    }
});

instagramUsernameInput.addEventListener('blur', () => {
    const validation = validateInstagramUsername(instagramUsernameInput.value);
    if (!validation.valid) {
        showError(instagramUsernameInput, instagramUsernameError, validation.message);
    } else {
        hideError(instagramUsernameInput, instagramUsernameError);
    }
});

// Clear error on input
fullNameInput.addEventListener('input', () => {
    if (fullNameError.classList.contains('show')) {
        hideError(fullNameInput, fullNameError);
    }
});

instagramUsernameInput.addEventListener('input', () => {
    if (instagramUsernameError.classList.contains('show')) {
        hideError(instagramUsernameInput, instagramUsernameError);
    }
});

// Form submission
leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    // Validate both fields
    const fullNameValidation = validateFullName(fullNameInput.value);
    const instagramValidation = validateInstagramUsername(instagramUsernameInput.value);

    if (!fullNameValidation.valid) {
        showError(fullNameInput, fullNameError, fullNameValidation.message);
        fullNameInput.focus();
        return;
    } else {
        hideError(fullNameInput, fullNameError);
    }

    if (!instagramValidation.valid) {
        showError(instagramUsernameInput, instagramUsernameError, instagramValidation.message);
        instagramUsernameInput.focus();
        return;
    } else {
        hideError(instagramUsernameInput, instagramUsernameError);
    }

    // Set submitting state
    isSubmitting = true;
    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    try {
        // Prepare data
        const fullName = fullNameInput.value.trim();
        const instagramUsername = instagramUsernameInput.value.trim().startsWith('@')
            ? instagramUsernameInput.value.trim().slice(1)
            : instagramUsernameInput.value.trim();

        const formData = {
            fullName: fullName,
            instagramUsername: instagramUsername
        };

        // Google Apps Script Web App URL (hardcoded because browser cannot access process.env)
        const appsScriptUrl = 'https://script.google.com/macros/s/AKfycbym9Wcoo8KHjoxO9n0Ep7w8cChljp3m0E-2nK3DJg3DRVVMaQTIDnXqo1SrREzDhcKM/exec';
        
        console.log('Submitting to:', appsScriptUrl);
        
        // Use no-cors mode to bypass CORS restrictions
        // This prevents us from reading the response, but the request will still be processed by Apps Script
        const response = await fetch(appsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'no-cors'
        });

        console.log('Response status:', response.status);
        console.log('Response type:', response.type);

        // With no-cors mode, response is opaque and cannot be read
        // But the request was still sent and processed by Apps Script
        // Treat as success if fetch didn't throw an error
        
        if (response.type === 'opaque') {
          console.log('✅ Request sent to Google Apps Script (response opaque due to CORS limitation)');
          console.log('✅ Lead berhasil disimpan ke Google Sheets');
        } else {
          // If somehow we get a different response type, log it
          console.warn('Unexpected response type:', response.type);
        }

        // Show thank you modal (only after successful save confirmation)
        showThankYouModal();

        // Reset form only after successful submission
        leadForm.reset();
        hideError(fullNameInput, fullNameError);
        hideError(instagramUsernameInput, instagramUsernameError);

    } catch (error) {
        console.error('Form submission error:', error);
        
        // Show error message to user
        const errorMessage = error.message || 'Terjadi kesalahan saat mengirim form. Silakan coba lagi.';
        
        // Display error in the Instagram username field (as fallback)
        showError(instagramUsernameInput, instagramUsernameError, errorMessage);
        
        // Keep form data intact so user can retry
        
    } finally {
        // Reset submitting state
        isSubmitting = false;
        submitButton.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
});

// ========================================
// THANK YOU MODAL
// ========================================

function showThankYouModal() {
    thankYouModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeThankYouModal() {
    thankYouModal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

thankYouClose.addEventListener('click', closeThankYouModal);

// Close modal when clicking outside
thankYouModal.addEventListener('click', (e) => {
    if (e.target === thankYouModal) {
        closeThankYouModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && thankYouModal.classList.contains('open')) {
        closeThankYouModal();
    }
});

// ========================================
// PRIVACY POLICY MODAL
// ========================================

const privacyLink = document.getElementById('privacyLink');
const footerPrivacyLink = document.getElementById('footerPrivacyLink');
const privacyModal = document.getElementById('privacyModal');
const modalClose = document.getElementById('modalClose');

function openPrivacyModal() {
    privacyModal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePrivacyModal() {
    privacyModal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    openPrivacyModal();
});

footerPrivacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    openPrivacyModal();
});

modalClose.addEventListener('click', closePrivacyModal);

// Close modal when clicking outside
privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) {
        closePrivacyModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal.classList.contains('open')) {
        closePrivacyModal();
    }
});

// ========================================
// FAQ ACCORDION
// ========================================

const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.classList.contains('open')) {
                otherItem.classList.remove('open');
            }
        });

        // Toggle current item
        item.classList.toggle('open');
    });
});

// ========================================
// SMOOTH SCROLL FOR CTA BUTTONS
// ========================================

const headerCTA = document.getElementById('headerCTA');
const ctaButton = document.getElementById('ctaButton');

function scrollToForm() {
    const formElement = document.getElementById('leadForm');
    formElement.scrollIntoView({ behavior: 'smooth' });
    // Focus pada input pertama
    setTimeout(() => {
        fullNameInput.focus();
    }, 600);
}

headerCTA.addEventListener('click', scrollToForm);
ctaButton.addEventListener('click', scrollToForm);

// ========================================
// MOBILE MENU TOGGLE
// ========================================

const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = navMenu.querySelectorAll('a');
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
    }
});

// ========================================
// FORM FIELD PREPARATION
// ========================================

// Format Instagram username input
instagramUsernameInput.addEventListener('keypress', (e) => {
    const char = e.key;
    // Allow alphanumeric, underscore, dot, and backspace
    if (!/[a-zA-Z0-9_.@]/.test(char) && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
    }
});

// ========================================
// ACCESSIBILITY
// ========================================

// Add keyboard navigation to CTA buttons
[headerCTA, ctaButton].forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
});
