       document.getElementById('signup-form').addEventListener('submit', async function(event) {
            event.preventDefault();
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirm-password').value;
            var errorMessage = document.getElementById('error-message');

            if (password !== confirmPassword) {
                errorMessage.textContent = 'Passwords do not match. Please try again.';
                errorMessage.style.display = 'block';
                return;
            }

            var formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value
            };

            try {
                var response = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    window.location.href = 'index.html';
                } else {
                    var errorData = await response.json();
                    errorMessage.textContent = errorData.message;
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            }
        });
