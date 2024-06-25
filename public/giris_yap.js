document.addEventListener('DOMContentLoaded', async function () {
    const signinForm = document.getElementById('signin-form');
    const errorMessage = document.getElementById('error-message');

    signinForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(signinForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location.href = '/index.html';
            } else {
                const result = await response.json();
                errorMessage.textContent = result.error;
            }
        } catch (error) {
            console.error('Giriş işlemi sırasında hata:', error);
            errorMessage.textContent = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
    });
});
