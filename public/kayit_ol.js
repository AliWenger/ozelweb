document.addEventListener('DOMContentLoaded', async function () {
    const signupForm = document.getElementById('signup-form');
    const loading = document.getElementById('loading');
    const loginLink = document.getElementById('login-link');
    const errorMessage = document.getElementById('error-message');


    // Handle form submission
    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        loading.style.display = 'block'; // Show loading spinner

        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/kayit_ol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = '/giris_yap.html';
            } else {
                errorMessage.textContent = result.error;
            }
        } catch (error) {
            console.error('Request error:', error);
            errorMessage.textContent = 'Sunucu hatası, lütfen tekrar deneyin.';
        } finally {
            loading.style.display = 'none'; // Hide loading spinner
        }
    });
});
