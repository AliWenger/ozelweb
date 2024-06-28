document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocompleteList');
    const searchButton = document.querySelector('.aramaButonu .fas.fa-search');
    const temizlikcilerContainer = document.querySelector('.temizlikciler');
    const oklar = document.getElementById('oklar');

    // Static location list
    const cities = [
        'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 
        'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 
        'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl', 'Bitlis', 
        'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 
        'Denizli', 'Diyarbakır', 'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 
        'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 
        'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş', 
        'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kırıkkale', 
        'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 
        'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş', 
        'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 
        'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 
        'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van', 
        'Yalova', 'Yozgat', 'Zonguldak'
    ];

    // Function to show suggestions as user types in search input
    searchInput.addEventListener('input', () => {
        const input = searchInput.value.toLowerCase();
        autocompleteList.innerHTML = '';
        if (input) {
            const suggestions = cities.filter(city => city.toLowerCase().includes(input));
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.classList.add('autocomplete-suggestion');
                div.textContent = suggestion;
                div.addEventListener('click', () => {
                    searchInput.value = suggestion;
                    autocompleteList.innerHTML = '';
                });
                autocompleteList.appendChild(div);
            });
        }
    });

    // Function to fetch cleaners based on selected location
    async function fetchCleaners(city) {
        try {
            const response = await fetch(`/get-cleaners?konum=${city}`);
            const cleaners = await response.json();
            return cleaners;
        } catch (error) {
            console.error('Error fetching cleaners:', error);
        }
    }

    // Event listener for search button click
    searchButton.addEventListener('click', async () => {
        const selectedLocation = searchInput.value;
        if (cities.includes(selectedLocation)) {
            const cleaners = await fetchCleaners(selectedLocation);
            temizlikcilerContainer.innerHTML = '';
            cleaners.forEach(cleaner => {
                const cleanerDiv = document.createElement('div');
                cleanerDiv.classList.add('temizlikci');
                cleanerDiv.dataset.cleanerId = cleaner._id; // Store cleaner ID in dataset
                cleanerDiv.innerHTML = `
                    <div class="foto">
                        <img src="https://images.pexels.com/photos/3768914/pexels-photo-3768914.jpeg?auto=compress&cs=tinysrgb&w=600" width="120" height="120" alt="temizlikçi fotoğrafı">
                    </div>
                    <div class="info">
                        <h3>${cleaner.isim + ' ' + cleaner.soyisim}</h3>
                        <p>${cleaner.aciklama}</p>
                    </div>
                    <div class="puanlama">
                        <h3>${cleaner.puan + '/5'}</h3>
                    </div>
                    <div class="buttons">
                        <a href="temizlikci.html?id=${cleaner._id}" class="comment" id="comment">Yorum Yap</a>
                        <a href="temizlikci.html?id=${cleaner._id}" class="gecmisTemizlik" id="gecmisTemizlik">Geçmiş Temizlikleri Listele</a>
                    </div>
                `;
                temizlikcilerContainer.appendChild(cleanerDiv);
            });
        } else {
            alert('Lütfen geçerli bir konum seçiniz.');
        }
    });

    // Event listener for sorting cleaners by rating when arrows are clicked
    oklar.addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('fas')) {
            const isAscending = clickedElement.classList.contains('fa-arrow-up');
            sortCleanersByRating(isAscending);
        }
    });

    // Event listener for clicking on a cleaner to view profile
    temizlikcilerContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('temizlikci')) {
            const cleanerId = event.target.dataset.cleanerId; // Get cleaner ID from dataset
            sessionStorage.setItem('cleanerId', cleanerId); // Store cleaner ID in sessionStorage
            window.location.href = 'temizlikci.html?id=${cleaner._id}'; // Redirect to cleaner profile page
        }
    });

    // Function to sort cleaners by rating
    function sortCleanersByRating(ascending) {
        const temizlikciler = Array.from(temizlikcilerContainer.querySelectorAll('.temizlikci'));

        temizlikciler.sort((a, b) => {
            const ratingA = parseFloat(a.querySelector('.puanlama h3').textContent);
            const ratingB = parseFloat(b.querySelector('.puanlama h3').textContent);

            if (ascending) {
                return ratingA - ratingB;
            } else {
                return ratingB - ratingA;
            }
        });

        // Append sorted cleaners back to the container
        temizlikciler.forEach(cleaner => {
            temizlikcilerContainer.appendChild(cleaner);
        });
    }

    // Function to hide autocomplete suggestions when clicking outside searchInput
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target)) {
            autocompleteList.innerHTML = '';
        }
    });
});
