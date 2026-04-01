document.addEventListener('DOMContentLoaded', () => {
    // Modal Elements
    const modalOverlay = document.getElementById('premium-modal');
    const closeBtn = document.querySelector('.close-btn');
    const premiumBtns = document.querySelectorAll('.premium-btn');
    const waitlistForm = document.getElementById('waitlist-form');
    const heroForm = document.getElementById('hero-form');
    const successMsg = document.querySelector('.success-message');

    // Open Modal
    premiumBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modalOverlay.classList.remove('hidden'); 
            
            // Allow display change to propagate before adding active class for CSS transition
            setTimeout(() => {
                modalOverlay.classList.add('active');
            }, 10);
            
            // Track this click event as 'intent to purchase'
            console.log('EVENT: User clicked Premium button - High intent');
        });
    });

    // Close Modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300); // match CSS transition duration
    };

    closeBtn.addEventListener('click', closeModal);

    // Close on out-click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Formspree Endpoint
    const formspreeEndpoint = 'https://formspree.io/f/xykbpojz';

    // Helper syntax to handle Formspree POST
    const submitToFormspree = async (email, sourceForm) => {
        try {
            const response = await fetch(formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    source: sourceForm 
                })
            });
            return response.ok;
        } catch (error) {
            console.error('Error submitting form:', error);
            return false;
        }
    };

    // Handle Forms
    if (heroForm) {
        heroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = heroForm.querySelector('input');
            const email = input.value;
            const btn = heroForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.disabled = true;

            const success = await submitToFormspree(email, 'Hero Section - Free Trial');

            if (success) {
                btn.textContent = 'Subscribed!';
                btn.style.backgroundColor = '#4ade80'; // Success green
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                    heroForm.reset();
                }, 3000);
            } else {
                btn.textContent = 'Error. Try Again.';
                btn.disabled = false;
                setTimeout(() => btn.textContent = originalText, 3000);
            }
        });
    }

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = waitlistForm.querySelector('input');
            const email = input.value;
            const btn = waitlistForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Saving...';
            btn.disabled = true;

            const success = await submitToFormspree(email, 'Premium Waitlist Modal');
            
            if (success) {
                waitlistForm.classList.add('hidden');
                successMsg.classList.remove('hidden');
                
                setTimeout(() => {
                    closeModal();
                    // Reset form state after closing
                    setTimeout(() => {
                        waitlistForm.reset();
                        btn.textContent = originalText;
                        btn.disabled = false;
                        waitlistForm.classList.remove('hidden');
                        successMsg.classList.add('hidden');
                    }, 300);
                }, 2500);
            } else {
                btn.textContent = 'Error. Try Again.';
                btn.disabled = false;
                setTimeout(() => btn.textContent = originalText, 3000);
            }
        });
    }
});
