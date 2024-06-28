
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
  