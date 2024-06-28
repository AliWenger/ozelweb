document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const service = document.getElementById('service').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const notes = document.getElementById('notes').value;

    const response = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ service, date, time, notes })
    });

    if (response.ok) {
        alert('Randevu başarıyla oluşturuldu');
        loadAppointments();
    } else {
        alert('Randevu oluşturulurken bir hata oluştu');
    }
});

async function loadAppointments() {
    const response = await fetch('http://localhost:3000/api/appointments');
    const appointments = await response.json();

    const appointmentsContainer = document.getElementById('appointments');
    appointmentsContainer.innerHTML = '';
    appointments.forEach(appointment => {
        const appointmentDiv = document.createElement('div');
        appointmentDiv.classList.add('appointment');
        appointmentDiv.innerHTML = `
            <p>Hizmet Türü: ${appointment.service}</p>
            <p>Tarih: ${appointment.date}</p>
            <p>Saat: ${appointment.time}</p>
            <p>Notlar: ${appointment.notes}</p>
            <button onclick="modifyAppointment('${appointment._id}')">Değiştir</button>
            <button class="cancel" onclick="cancelAppointment('${appointment._id}')">İptal</button>
        `;
        appointmentsContainer.appendChild(appointmentDiv);
    });
}

async function modifyAppointment(id) {
    const service = prompt('Yeni Hizmet Türü:');
    const date = prompt('Yeni Tarih:');
    const time = prompt('Yeni Saat:');
    const notes = prompt('Yeni Notlar:');

    if (service && date && time && notes) {
        const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ service, date, time, notes })
        });

        if (response.ok) {
            alert('Randevu başarıyla güncellendi');
            loadAppointments();
        } else {
            alert('Randevu güncellenirken bir hata oluştu');
        }
    } else {
        alert('Lütfen tüm alanları doldurun');
    }
}

async function cancelAppointment(id) {
    const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        alert('Randevu başarıyla iptal edildi');
        loadAppointments();
    } else {
        alert('Randevu iptal edilirken bir hata oluştu');
    }
}

document.addEventListener('DOMContentLoaded', loadAppointments);
