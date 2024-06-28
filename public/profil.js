
function loadRandevular() {
    fetch('/api/randevular')
        .then(response => response.json())
        .then(data => {
            const randevularDiv = document.getElementById('randevular');
            randevularDiv.innerHTML = '';
            data.forEach(randevu => {
                const randevuDiv = document.createElement('div');
                randevuDiv.innerHTML = `
                    <p>Tarih: ${randevu.date}</p>
                    <p>Saat: ${randevu.time}</p>
                    <button onclick="deleteRandevu('${randevu._id}')">İptal Et</button>
                    <button onclick="updateRandevu('${randevu._id}')">Güncelle</button>
                `;
                randevularDiv.appendChild(randevuDiv);
            });
        });
}

function deleteRandevu(id) {
    fetch(`/api/randevular/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        alert('Randevu başarıyla iptal edildi');
        loadRandevular();
    });
}

function updateRandevu(id) {
    const newDate = prompt('Yeni tarih:', 'YYYY-MM-DD');
    const newTime = prompt('Yeni saat:', 'HH:MM');
    fetch(`/api/randevular/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: newDate, time: newTime })
    })
    .then(() => {
        alert('Randevu başarıyla güncellendi');
        loadRandevular();
    });
}

window.onload = loadRandevular;



function redirectToAppointmentPage() {
    window.location.href = '/randevu.html'; // Randevu alma sayfasına yönlendirin
}

// Kullanıcı bilgilerini çek ve sayfada göster
async function fetchUserDetails(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
            throw new Error('Kullanıcı bilgileri getirilemedi');
        }
        const user = await response.json();
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-description').textContent = user.description || 'Kısa bir biyografi ya da tanıtım yazısı.';
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

// Sayfa yüklendiğinde kullanıcı bilgilerini çek
document.addEventListener('DOMContentLoaded', () => {
    const userId = 'kullaniciId'; // Kullanıcının ID'sini burada belirtin
    fetchUserDetails(userId);
});