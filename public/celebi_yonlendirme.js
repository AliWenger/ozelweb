
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocompleteList');
    const searchButton = document.querySelector('.aramaButonu .fas.fa-search');

    // Statik konum listesi (gerçek bir uygulamada bu listeyi bir API'den alabilirsiniz)
    const locations = ['Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkâri','Hatay','Iğdır','Isparta','İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kilis','Kırıkkale','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Şanlıurfa','Siirt','Sinop','Sivas','ırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'];

    // Arama kutusuna yazdıkça önerileri gösteren fonksiyon
    searchInput.addEventListener('input', () => {
        const input = searchInput.value.toLowerCase();
        autocompleteList.innerHTML = '';
        if (input) {
            const suggestions = locations.filter(location => location.toLowerCase().includes(input));
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

    // Arama butonuna tıklanınca seçilen konumu işleyen fonksiyon
    searchButton.addEventListener('click', () => {
        const selectedLocation = searchInput.value;
        if (locations.includes(selectedLocation)) {
            alert(`Arama yapılıyor: ${selectedLocation}`);
            // Burada arama işlemini gerçekleştirebilirsiniz
            // Örneğin, bir API çağrısı yaparak veya sayfayı yeniden yönlendirerek
        } else {
            alert('Lütfen geçerli bir konum seçiniz.');
        }
    });

    // Sayfa dışında tıklanınca önerileri gizleyen fonksiyon
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target)) {
            autocompleteList.innerHTML = '';
        }
    });
});