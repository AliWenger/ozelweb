document.addEventListener('DOMContentLoaded', function () {
    const updateButtons = document.querySelectorAll('.btn-update');
    const cancelButtons = document.querySelectorAll('.btn-cancel');

    updateButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.location.href = 'rezervasyon_guncelle.html';
        });
    });

    cancelButtons.forEach(button => {
        button.addEventListener('click', function () {
            const confirmCancel = confirm('Rezervasyonu iptal etmek istediğinize emin misiniz?');
            if (confirmCancel) {
                alert('Rezervasyonunuz iptal edilmiştir.');
                // Buraya iptal işlemi için gerekli kodlar eklenebilir
            }
        });
    });
});




