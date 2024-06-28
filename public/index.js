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

function checkAuth() {
    fetch('/check-auth', { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                document.getElementById('giris').style.display = 'none';
                document.getElementById('kayit').style.display = 'none';
                document.getElementById('profil').style.display = 'block';
                document.getElementById('logout').style.display = 'block';
            } else {
                document.getElementById('giris').style.display = 'block';
                document.getElementById('kayit').style.display = 'block';
                document.getElementById('profil').style.display = 'none';
                document.getElementById('logout').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Oturum durumu kontrol edilirken hata:', error);
        });
}

function logout() {
    fetch('/logout', { credentials: 'include' })
        .then(() => {
            window.location.href = '/index.html';
        })
        .catch(error => {
            console.error('Çıkış yapılırken hata:', error);
        });
}

document.addEventListener('DOMContentLoaded', checkAuth);
document.getElementById('logout').addEventListener('click', logout);

function redirectToAppointmentPage() {
    window.location.href = '/randevu.html'; // Randevu alma sayfasına yönlendirin
}