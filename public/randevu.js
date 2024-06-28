document.getElementById('randevuSayfasi').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const message = document.getElementById('message').value;

    try {
        const response = await fetch('/randevu_al', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, phone, email, date, time, message })
        });

        if (response.ok) {
            alert('Randevu başarıyla oluşturuldu');
            window.location.href = '/index.html'; // Corrected window.location usage
        } else {
            throw new Error('Randevu oluşturulurken bir hata oluştu');
        }
    } catch (error) {
        console.error('Fetch hatası:', error);
        alert('Randevu oluşturulurken bir hata oluştu');
    }
});
