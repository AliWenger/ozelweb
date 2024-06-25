document.addEventListener('DOMContentLoaded', function () {
    const verificationForm = document.getElementById('verification-form');
    const errorMessage = document.getElementById('error-message');

    verificationForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(verificationForm);
        const data = Object.fromEntries(formData);

        const response = await fetch('/verify', {
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
    });
});
