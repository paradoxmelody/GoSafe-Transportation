(function() {
    'use strict';

    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        try {
            initializeBookingForm();
            initializeNavigation();
            initializeAccessibility();
            console.log('Uber homepage clone initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
            showFallbackMessage();
        }
    }

    // Booking Form Functionality
    function initializeBookingForm() {
        const bookingForm = document.getElementById('bookingForm');
        const pickupInput = document.getElementById('pickup');
        const dropoffInput = document.getElementById('dropoff');
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');

        if (!bookingForm) {
            console.warn('Booking form not found');
            return;
        }

        // Form submission handler
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });

        // Input validation and enhancement
        if (pickupInput) {
            pickupInput.addEventListener('input', function() {
                validateLocationInput(this, 'pickup');
            });

            pickupInput.addEventListener('focus', function() {
                this.placeholder = 'Enter pickup location';
            });

            pickupInput.addEventListener('blur', function() {
                this.placeholder = 'Pickup location';
            });
        }

        if (dropoffInput) {
            dropoffInput.addEventListener('input', function() {
                validateLocationInput(this, 'dropoff');
            });

            dropoffInput.addEventListener('focus', function() {
                this.placeholder = 'Enter destination';
            });

            dropoffInput.addEventListener('blur', function() {
                this.placeholder = 'Dropoff location';
            });
        }

        // Date and time picker simulation
        if (dateInput) {
            dateInput.addEventListener('click', function() {
                showDatePicker();
            });
        }

        if (timeInput) {
            timeInput.addEventListener('click', function() {
                showTimePicker();
            });
        }
    }

    function handleFormSubmission() {
        const pickupValue = document.getElementById('pickup').value.trim();
        const dropoffValue = document.getElementById('dropoff').value.trim();

        // Clear previous error messages
        clearErrorMessages();

        // Validate inputs
        const errors = [];

        if (!pickupValue) {
            errors.push({ field: 'pickup', message: 'Please enter a pickup location' });
        }

        if (!dropoffValue) {
            errors.push({ field: 'dropoff', message: 'Please enter a destination' });
        }

        if (pickupValue && dropoffValue && pickupValue.toLowerCase() === dropoffValue.toLowerCase()) {
            errors.push({ field: 'dropoff', message: 'Pickup and dropoff locations cannot be the same' });
        }

        if (errors.length > 0) {
            displayErrors(errors);
            return;
        }

        // Redirect to login — ride pricing is available after sign in
        window.location.href = 'signup/home.html';
    }

    function validateLocationInput(input, type) {
        const value = input.value.trim();
        const minLength = 2;

        // Remove existing error styling
        input.classList.remove('error');
        
        if (value.length > 0 && value.length < minLength) {
            input.classList.add('error');
        }
    }

    function displayErrors(errors) {
        errors.forEach(function(error) {
            const field = document.getElementById(error.field);
            if (field) {
                field.classList.add('error');
                showErrorMessage(error.message, field);
            }
        });

        // Focus on first error field
        if (errors.length > 0) {
            const firstErrorField = document.getElementById(errors[0].field);
            if (firstErrorField) {
                firstErrorField.focus();
            }
        }
    }

    function showErrorMessage(message, field) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#d32f2f';
        errorDiv.style.fontSize = '14px';
        errorDiv.style.marginTop = '4px';
        
        field.parentNode.appendChild(errorDiv);
    }

    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(function(message) {
            message.remove();
        });

        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(function(field) {
            field.classList.remove('error');
        });
    }

    function showSuccessMessage() {
        const form = document.getElementById('bookingForm');
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = '✓ Searching for available rides...';
        successDiv.style.cssText = `
            background-color: #4caf50;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            font-weight: 500;
        `;

        form.appendChild(successDiv);

        // Remove success message after 3 seconds
        setTimeout(function() {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    // Date and Time Picker Simulation
    function showDatePicker() {
        const options = ['Today', 'Tomorrow', 'Pick a date'];
        showPickerModal('Select Date', options, function(selected) {
            document.getElementById('date').value = selected;
        });
    }

    function showTimePicker() {
        const options = ['Now', 'In 15 minutes', 'In 30 minutes', 'In 1 hour', 'Schedule for later'];
        showPickerModal('Select Time', options, function(selected) {
            document.getElementById('time').value = selected;
        });
    }

    function showPickerModal(title, options, callback) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 300px;
            width: 90%;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            margin: 0 0 16px 0;
            font-size: 18px;
            font-weight: 600;
        `;

        modal.appendChild(titleElement);

        // Create options
        options.forEach(function(option) {
            const button = document.createElement('button');
            button.textContent = option;
            button.style.cssText = `
                display: block;
                width: 100%;
                padding: 12px;
                margin-bottom: 8px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                background: white;
                cursor: pointer;
                text-align: left;
                transition: background-color 0.2s;
            `;

            button.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f5f5f5';
            });

            button.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white';
            });

            button.addEventListener('click', function() {
                callback(option);
                document.body.removeChild(overlay);
            });

            modal.appendChild(button);
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close modal when clicking overlay
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Close modal with Escape key
        const escapeHandler = function(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    // Navigation Enhancement
    function initializeNavigation() {
        // Add smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#') {
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Add active state to navigation items
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Remove active class from all links
                navLinks.forEach(function(l) {
                    l.classList.remove('active');
                });
                // Add active class to clicked link
                this.classList.add('active');
            });
        });
    }

    // Accessibility Enhancements
    function initializeAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', function(e) {
            // Handle Enter key on buttons and links
            if (e.key === 'Enter') {
                const target = e.target;
                if (target.tagName === 'BUTTON' || target.tagName === 'A') {
                    target.click();
                }
            }
        });

        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(function(element) {
            element.addEventListener('focus', function() {
                this.style.outline = '2px solid #0066cc';
                this.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', function() {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }

    // Error handling and fallback
    function showFallbackMessage() {
        const main = document.querySelector('main');
        if (main) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.innerHTML = `
                <div style="text-align: center; padding: 40px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; margin: 20px;">
                    <h3>JavaScript Enhancement Unavailable</h3>
                    <p>For the best experience, please enable JavaScript in your browser.</p>
                    <p>The basic functionality of this page will still work without JavaScript.</p>
                </div>
            `;
            main.insertBefore(fallbackDiv, main.firstChild);
        }
    }

    // Add CSS for error states
    function addErrorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .form-input.error {
                border-color: #d32f2f !important;
                box-shadow: 0 0 0 2px rgba(211, 47, 47, 0.2);
            }
            
            .error-message {
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .success-message {
                animation: slideIn 0.3s ease-out;
            }
            
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize error styles
    addErrorStyles();

    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            console.log('Page hidden - pausing non-essential operations');
        } else {
            console.log('Page visible - resuming operations');
        }
    });

    // Performance monitoring
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });

    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Global error caught:', e.error);
        // In a production app, you might want to send this to an error reporting service
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault(); // Prevent the default browser behavior
    });

})();

const sidebar = document.querySelector('.sidebar');
const sidebarThemes = document.querySelectorAll('.sidebar-theme');
const selector = document.querySelector('.selector');

sidebarThemes.forEach(theme => {
  theme.addEventListener('click', () => {
    const selectedTheme = theme.getAttribute('data-theme');
    
    // Move this to <body> so your CSS vars actually cascade
    document.body.setAttribute('data-theme', selectedTheme);
    
    // Keep sidebar in sync too
    sidebar.setAttribute('data-theme', selectedTheme);
    
    // Update the selector indicator
    selector.setAttribute('class', `selector ${selectedTheme}`);
  });
});