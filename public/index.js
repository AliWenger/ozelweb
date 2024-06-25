const images = [
    'https://images.pexels.com/photos/6197122/pexels-photo-6197122.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4098579/pexels-photo-4098579.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/6197116/pexels-photo-6197116.jpeg?auto=compress&cs=tinysrgb&w=600'
];
let currentIndex = 0;

document.getElementById('prevBtn').addEventListener('click', function() {
    currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
    document.getElementById('about-image').src = images[currentIndex];
});

document.getElementById('nextBtn').addEventListener('click', function() {
    currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    document.getElementById('about-image').src = images[currentIndex];
});

document.addEventListener('DOMContentLoaded', function() {
    var faqItems = document.querySelectorAll('.faq-question');

    faqItems.forEach(function(item) {
        item.addEventListener('click', function() {
            this.classList.toggle('active');
            var answer = this.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });
});

var scrollTopBtn = document.getElementById('scrollTopBtn');

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
};

scrollTopBtn.addEventListener('click', function() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
});

async function checkAuth() {
    try {
        const response = await fetch('/check-auth', { credentials: 'include' });
        const data = await response.json();
        if (data.authenticated) {
            document.getElementById('giris-yap').style.display = 'none';
            document.getElementById('kayit-ol').style.display = 'none';
        } else {
           console.log('error');
        }
    } catch (error) {
        console.error('Oturum durumu kontrol edilirken hata oluştu:', error);
    }
}

// Sayfa yüklendiğinde oturum durumunu kontrol et
window.onload = checkAuth;
