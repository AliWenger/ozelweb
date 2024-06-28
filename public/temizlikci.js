document.addEventListener('DOMContentLoaded', async () => {
    // URL'den cleanerId'yi al
    const urlParams = new URLSearchParams(window.location.search);
    const cleanerId = urlParams.get('id'); // URL'de id parametresi varsa alır

    if (cleanerId) {
        try {
            const response = await fetch(`/cleaner-profile?id=${cleanerId}`);
            const data = await response.json();

            if (response.ok) {
                const { cleaner, comments } = data;

                // Temizlikçi bilgilerini dinamik olarak göster
                document.getElementById('cleanerName').textContent = `${cleaner.isim} ${cleaner.soyisim}`;
                document.getElementById('cleanerDescription').textContent = cleaner.aciklama;
                document.getElementById('cleanerRating').textContent = `${cleaner.puan}/5`;
                document.getElementById('cleanerImage').src = cleaner.image || 'https://images.pexels.com/photos/1525041/pexels-photo-1525041.jpeg?auto=compress&cs=tinysrgb&w=600';

                // Yorumları dinamik olarak göster
                const reviewsContainer = document.getElementById('reviewsContainer');
                comments.forEach(comment => {
                    const reviewElement = createReviewElement(comment);
                    reviewsContainer.appendChild(reviewElement);
                });
            } else {
                console.error('Temizlikçi bulunamadı', data.error);
            }
        } catch (error) {
            console.error('Veri alınırken hata oluştu:', error);
        }
    } else {
        console.error('ID parametresi bulunamadı');
    }

    // Yorum ekleme formunu gönderme işlemi
    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const location = document.getElementById('email').value;
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;
    
        const formData = {
            email:email,
            rating: rating,
            comment: comment
        };

        try {
            const response = await fetch('/add_comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                window.alert('Yorum başarıyla eklendi');
                reviewForm.reset(); // Formu sıfırla
            } else {
                console.error('Yorum eklenirken hata:', await response.json());
            }
        } catch (error) {
            console.error('Yorum eklenirken hata:', error);
        }
    });
});
