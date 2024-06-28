document.addEventListener('DOMContentLoaded', async () => {
    const cleanerId = sessionStorage.getItem('cleanerId');

    if (!cleanerId) {
        console.error('Cleaner ID bulunamadı.');
        return;
    }

    try {
        const response = await fetch(`/cleaner-profile?cleanerId=${cleanerId}`);
        const { cleaner, comments } = await response.json();

        if (!cleaner) {
            console.error('Temizlikçi bilgileri alınamadı.');
            return;
        }

        // Temizlikçi bilgilerini gösterme
        const temizlikciContainer = document.querySelector('.temizlikci-container');
        temizlikciContainer.innerHTML = `
            <div class="foto">
                <img src="https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&cs=tinysrgb&w=600" width="120" height="120" alt="temizlikçi fotoğrafı">
            </div>
            <div class="info">
                <h3>${cleaner.isim} ${cleaner.soyisim}</h3>
                <p>${cleaner.aciklama}</p>
            </div>
            <div class="puanlama">
                <h3>${cleaner.puan}/5</h3>
            </div>
            <div class="buttons">
                <a href="temizlikci.html#yorum_new" class="comment" id="comment">Yorum Yap</a>
                <a href="temizlikci.html" class="gecmisTemizlik" id="gecmisTemizlik">Geçmiş Temizlikleri Listele</a>
            </div>
        `;

        // Yorumları gösterme
        const commentsContainer = document.querySelector('.yorumlar-container');
        commentsContainer.innerHTML = '';
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('yorum');
            commentDiv.innerHTML = `
                <p><strong>${comment.email}</strong> (${comment.rating}/5): ${comment.message}</p>
            `;
            commentsContainer.appendChild(commentDiv);
        });

    } catch (error) {
        console.error('Temizlikçi profili alınırken bir hata oluştu:', error);
    }
});
