// ======= Obsługa Menu Hamburger =======
const hamburger_menu = document.querySelector(".hamburger-menu");
const container = document.querySelector(".container");
const menulinks = document.querySelectorAll(".menulink"); // Pobieramy wszystkie linki menu
const body = document.body; // Pobierz element body

document.addEventListener('DOMContentLoaded', () => {
  hamburger_menu.addEventListener("click", () => {
    container.classList.toggle("active");
    // DODANE: Przełączanie klasy menu-active na body przy kliknięciu hamburgera
    body.classList.toggle('menu-active');
  });

  // Dodajemy zamykanie menu po kliknięciu w link na urządzeniach mobilnych
  menulinks.forEach(link => {
    link.addEventListener("click", () => {
      // Sprawdź, czy menu jest otwarte, zanim je zamkniesz
      if (container.classList.contains("active")) {
        container.classList.remove("active");
        // ZMIENIONE Z toggle NA remove: Po kliknięciu linku zawsze usuwamy klasę menu-active
        body.classList.remove('menu-active'); // Zawsze włączamy przewijanie po kliknięciu linku
      }
      // Przewijanie sekcji jest obsługiwane przez scroll-behavior: smooth w CSS,
      // który działa poprawnie, gdy overflow: hidden zostanie usunięte.
    });
  });

  // Przewijanie sekcji przy kliknięciu w linki menu (zakomentowane, ponieważ scroll-behavior: smooth w CSS to obsługuje)
  // menulinks.forEach(link => {
  //     link.addEventListener('click', function(e) {
  //         e.preventDefault(); // Zapobiega domyślnej akcji linku
  //         const targetId = this.getAttribute('href').substring(1);
  //         const targetSection = document.getElementById(targetId);
  //         if (targetSection) {
  //             targetSection.scrollIntoView({ behavior: 'smooth' });
  //         }
  //     });
  // });


  // ======= Obsługa Formularza Kontaktowego i Modalu =======
  const contactButton = document.querySelector(".contact-button-fixed");
  const modalOverlay = document.querySelector(".contact-modal-overlay");
  const closeModalButton = document.querySelector(".close-modal");
  const contactForm = document.getElementById("contactForm");
  const notificationPopup = document.querySelector(".notification-popup");

  const captchaProblemSpan = document.getElementById("captcha-problem");
  const captchaInput = document.getElementById("captcha-input");
  const captchaErrorSpan = document.querySelector(".captcha-error");

  let captchaSolution = 0; // Zmienna do przechowywania poprawnej odpowiedzi CAPTCHA

  // Funkcja do generowania nowej CAPTCHA
  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1; // Liczba od 1 do 10
    const num2 = Math.floor(Math.random() * 10) + 1; // Liczba od 1 do 10
    const operator = Math.random() > 0.5 ? '+' : '-'; // Losowy operator (+ lub -)

    if (operator === '+') {
      captchaSolution = num1 + num2;
      captchaProblemSpan.textContent = `${num1} + ${num2}`;
    } else {
      // Zapobiegamy ujemnym wynikom dla prostoty
      if (num1 < num2) {
        captchaSolution = num2 - num1;
        captchaProblemSpan.textContent = `${num2} - ${num1}`;
      } else {
        captchaSolution = num1 - num2;
        captchaProblemSpan.textContent = `${num1} - ${num2}`;
      }
    }
    captchaErrorSpan.textContent = ""; // Czyścimy ewentualny poprzedni błąd
    captchaInput.value = ""; // Czyścimy pole odpowiedzi
  }

  // Funkcja do pokazywania modalu
  function showModal() {
    modalOverlay.style.visibility = "visible";
    modalOverlay.style.opacity = "1";
    document.body.classList.add("modal-open"); // Dodaje klasę do body do blokowania scrolla
    generateCaptcha(); // Generuje nową CAPTCHA przy każdym otwarciu
  }

  // Funkcja do ukrywania modalu
  function hideModal() {
    modalOverlay.style.visibility = "hidden";
    modalOverlay.style.opacity = "0";
    document.body.classList.remove("modal-open"); // Usuwa klasę blokującą scrolla
    // Opcjonalnie resetuj formularz przy zamykaniu
    contactForm.reset();
    captchaErrorSpan.textContent = ""; // Czyścimy błąd CAPTCHA przy zamykaniu
  }

  // Funkcja do pokazywania powiadomienia
  function showNotification(message) {
    notificationPopup.textContent = message;
    notificationPopup.classList.add("notification-visible");
  }

  // Funkcja do ukrywania powiadomienia
  function hideNotification() {
    notificationPopup.classList.remove("notification-visible");
  }


  // Zdarzenie kliknięcia stałego przycisku -> pokaż modal
  contactButton.addEventListener("click", showModal);

  // Zdarzenie kliknięcia przycisku zamykania w modalu -> ukryj modal
  closeModalButton.addEventListener("click", hideModal);

  // Zdarzenie kliknięcia poza kontenerem formularza (na overlay) -> ukryj modal
  modalOverlay.addEventListener("click", (e) => {
    // Sprawdź, czy kliknięcie nastąpiło bezpośrednio na overlayu, a nie na formularzu w środku
    if (e.target === modalOverlay) {
      hideModal();
    }
  });


  // Obsługa wysyłki formularza
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Zapobiega domyślnej wysyłce formularza

    // Pobierz wartości z pól
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const captchaAnswer = parseInt(captchaInput.value.trim(), 10); // Parsuj na liczbę całkowitą

    let isValid = true; // Flaga walidacji

    // Prosta walidacja pól (czy nie są puste)
    if (name === "" || email === "" || message === "") {
      alert("Proszę wypełnić wszystkie pola formularza."); // Można użyć ładniejszych komunikatów
      isValid = false;
    }

    // Walidacja CAPTCHA
    if (captchaAnswer !== captchaSolution) {
      captchaErrorSpan.textContent = "Niepoprawna odpowiedź CAPTCHA.";
      isValid = false;
      generateCaptcha(); // Generuj nową CAPTCHA po błędnej odpowiedzi
    } else {
      captchaErrorSpan.textContent = ""; // Wyczyść komunikat błędu jeśli poprawna
    }


    if (isValid) {
      // --- Symulacja wysyłki wiadomości ---
      console.log("Wiadomość wysłana (symulacja):");
      console.log("Imię:", name);
      console.log("Email:", email);
      console.log("Wiadomość:", message);
      console.log("CAPTCHA poprawna:", captchaAnswer);
      // --- Koniec symulacji ---

      // Tutaj ZAZWYCZAJ wysłałbyś dane do skryptu serwerowego
      // fetch('/send-email.php', { method: 'POST', body: JSON.stringify({ name, email, message }) })
      // .then(response => {
      // Sprawdź, czy odpowiedź HTTP jest poprawna (status 2xx)
      /* if (!response.ok) {
             // Jeśli status nie jest OK, rzuć błąd z odpowiedzią
             return response.json().then(errorData => {
                 throw new Error(errorData.message || 'Błąd sieci lub serwera.');
             });
         }
         // Jeśli status jest OK, spróbuj sparsować JSON
         return response.json();
      })
      /*response.json())
      // .then(data => {
      //     if (data.success) {
                   // Sukces - pokaż powiadomienie
                      hideModal(); // Ukryj modal
                      showNotification("Dziękujemy, wiadomość do nas leci."); // Pokaż powiadomienie

                      // Ustaw timer na ukrycie powiadomienia i reset formularza
                      setTimeout(() => {
                          hideNotification();
                          contactForm.reset(); // Reset formularza
                          generateCaptcha(); // Generuj nową CAPTCHA po resecie
                          // Tutaj możesz opcjonalnie przekierować użytkownika lub odświeżyć część strony
                          // window.location.reload(); // Odświeżenie strony (rzadko potrzebne)
                      }, 2000); // 2000 ms = 2 sekundy

      //     } else {
      //         // Błąd po stronie serwera
      //         alert('Wystąpił błąd podczas wysyłki wiadomości.');
      //         generateCaptcha(); // Generuj nową CAPTCHA w razie błędu
      //     }
      // })
      // .catch((error) => {
      //     console.error('Błąd sieci lub serwera:', error);
      //     alert('Wystąpił problem z połączeniem. Spróbuj ponownie później.');
      //     generateCaptcha(); // Generuj nową CAPTCHA w razie błędu
      // });
*/

      // Poniższy kod działa od razu po pomyślnej walidacji CAPTCHA i pól JS, bez faktycznej wysyłki
      hideModal(); // Ukryj modal
      showNotification("Dziękujemy, wiadomość do nas leci."); // Pokaż powiadomienie

      // Ustaw timer na ukrycie powiadomienia i reset formularza
      setTimeout(() => {
        hideNotification();
        contactForm.reset(); // Reset formularza
        generateCaptcha(); // Generuj nową CAPTCHA po resecie
        // Strona pozostaje na obecnej pozycji, nie wraca automatycznie na górę.
        // Jeśli chcesz wymusić powrót na górę strony głównej, możesz użyć:
        // window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000); // 2000 ms = 2 sekundy

    } else {
      // Walidacja JS nie przeszła (pola puste lub CAPTCHA błędna)
      // Komunikat błędu CAPTCHA jest już wyświetlany w spanie .captcha-error
      // Komunikat o pustych polach jest w alercie, można to zmienić na komunikat na stronie.
    }
  });

  // Generuj pierwszą CAPTCHA przy ładowaniu strony
  generateCaptcha();

  // Poczekaj, aż cała zawartość strony zostanie załadowana

  // ---- Dynamiczna animacja pasków świetlnych ----

  const lightClasses = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10', 'x11', 'x12', 'x13', 'x14', 'x15']; // Tablica dostępnych klas xN
  const animationDuration = 10000; // Czas trwania animacji jednego paska (w milisekundach) - zwiększono dla wolniejszego ruchu
  // animationDistance nie jest już bezpośrednio używane, ruch jest od startTop do endTop


  let scrollTimeout;
  const scrollTimeoutDelay = 250; // Opóźnienie do wykrycia końca scrollowania w ms

  const periodicIntervalDelay = 2500; // 5 sekund
  let periodicLightInterval;

  // Funkcja do tworzenia i animowania pojedynczego paska
  function createAndAnimateLight() {
    const light = document.createElement('div');
    light.classList.add('light');

    // Wybierz losową klasę xN dla rozmiaru i pozycji poziomej
    const randomClass = lightClasses[Math.floor(Math.random() * lightClasses.length)];
    light.classList.add(randomClass);

    // Ustaw początkową pozycję (poniżej widocznego obszaru)
    const startTop = window.scrollY + window.innerHeight + 50; // Offset zwiększony dla pewności, że startuje poza ekranem
    light.style.top = `${startTop}px`;
    light.style.position = 'absolute'; // Upewnij się, że jest absolute

    // Dodaj element do body
    document.body.appendChild(light);


    // Określ pozycję końcową (powyżej widocznego obszaru)
    const endTop = window.scrollY - 50; // Offset zwiększony

    // Definicja keyframes dla animacji (ruch w górę i pojawianie się/znikanie)
    const keyframes = [
      { top: `${startTop}px`, opacity: 0 }, // Start niewidoczny
      { opacity: 1, offset: 0.15 }, // Pojawienie się (15% animacji)
      { opacity: 1, offset: 0.85 }, // Utrzymanie opacity do 85%
      { top: `${endTop}px`, opacity: 0 } // Koniec niewidoczny
    ];


    // Opcje animacji
    const options = {
      duration: animationDuration, // Czas trwania
      easing: 'linear', // Liniowe tempo
      iterations: 1, // Animacja jednorazowa
    };

    // Uruchom animację
    const animation = light.animate(keyframes, options);

    // Usuń element po zakończeniu animacji
    animation.onfinish = () => {
      light.remove();
    };
  }

  // Funkcja do generowania partii pasków
  function generateLightsBatch(numberOfStreaks, delayBetween) {
    for (let i = 0; i < numberOfStreaks; i++) {
      const delay = i * delayBetween;
      setTimeout(createAndAnimateLight, delay);
    }
  }


  // --- Generowanie pasków przy ładowaniu strony ---
  const numberOfInitialStreaks = 15; // Ile pasków pojawia się na początku
  const initialDelayBetween = 150; // Opóźnienie między początkowymi paskami

  // Generuj paski przy ładowaniu DOM
  generateLightsBatch(numberOfInitialStreaks, initialDelayBetween);


  // --- Generowanie pasków co 5 sekund gdy nie ma scrollowania ---
  function startPeriodicGeneration() {
    // Upewnij się, że poprzedni interwał jest wyczyszczony przed ustawieniem nowego
    if (periodicLightInterval) {
      clearInterval(periodicLightInterval);
    }
    periodicLightInterval = setInterval(() => {
      const numberOfPeriodicStreaks = 25; // Ile pasków generować co 5 sekund
      const delayBetweenPeriodic = 100; // Opóźnienie między paskami w interwale
      generateLightsBatch(numberOfPeriodicStreaks, delayBetweenPeriodic, );
    }, periodicIntervalDelay);
  }

  // Uruchom generowanie okresowe po załadowaniu początkowych pasków
  // Dajemy małe opóźnienie, aby nie kolidowało z początkową animacją
  setTimeout(startPeriodicGeneration, numberOfInitialStreaks * initialDelayBetween + 500); // Start po zakończeniu początkowej partii + 0.5s

  // --- Obsługa zdarzenia scrollowania ---
  window.addEventListener('scroll', () => {
    // Wyczyść interwał generowania okresowego, gdy zaczynamy scrollować
    clearInterval(periodicLightInterval);

    // Wyczyść poprzedni timeout wykrywający koniec scrollowania
    clearTimeout(scrollTimeout);

    // Ustaw nowy timeout - jeśli przez scrollTimeoutDelay ms nie będzie scrolla, uruchom funkcję końca scrollowania
    scrollTimeout = setTimeout(() => {
      // Funkcja uruchamiana po zatrzymaniu scrollowania
      console.log("Scroll stopped, potentially generating lights."); // Do debugowania

      // Opcjonalnie wygeneruj partię pasków po zatrzymaniu scrollowania (jeśli chcesz inny zestaw niż okresowy)
      const numberOfStreaksOnStop = 25;
      const delayBetweenStopStreaks = 100;
      generateLightsBatch(numberOfStreaksOnStop, delayBetweenStopStreaks);


      // Po zakończeniu scrollowania i opcjonalnym wygenerowaniu pasków, WZNOW generowanie okresowe
      startPeriodicGeneration();


    }, scrollTimeoutDelay);
  });
  // Skrypt do inicjalizacji Swipera
  const gallerySwiper = new Swiper('.gallery-swiper', {
    // Opcjonalne parametry
    direction: 'horizontal', // 'vertical' lub 'horizontal'
    loop: true, // Zawijanie slajdów

    // Jeśli potrzebujesz paginacji
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    // Jeśli potrzebujesz przycisków nawigacyjnych
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // I wiele więcej opcji...
    // zobacz: https://swiperjs.com/get-started

    // Responsywność (opcjonalnie, ale zalecane)
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
        spaceBetween: 10
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      // when window width is >= 1024px
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  });
  // --- Skrypt do obsługi powiększania obrazów w galerii ---
  const imageModalOverlay = document.querySelector('.image-modal-overlay');
  const imageModalImg = document.querySelector('.image-modal-overlay img');
  const galleryImages = document.querySelectorAll('#galeria .swiper-slide img'); // Zmieniono selektor, aby wybrać tylko obrazki w slajdach galerii

  // Dodaj słuchacze zdarzeń kliknięcia do każdego obrazka w galerii
  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      // Pobierz źródło klikniętego obrazka
      const imageUrl = this.src;

      // Ustaw źródło dla obrazka w modalu
      imageModalImg.src = imageUrl;

      // Pokaż modal i zablokuj przewijanie tła
      imageModalOverlay.classList.add('visible');
      document.body.classList.add('image-modal-open');
    });
  });

  // Dodaj słuchacz zdarzenia kliknięcia do nakładki modalu (zamykanie)
  imageModalOverlay.addEventListener('click', function() {
    // Ukryj modal i odblokuj przewijanie tła
    this.classList.remove('visible');
    document.body.classList.remove('image-modal-open');
    // Opcjonalnie: wyczyść źródło obrazka w modalu po zamknięciu
    imageModalImg.src = '';
  });

  // Zapobiegnij propagacji kliknięcia z obrazka w modalu, aby nie zamykało modalu od razu
  imageModalImg.addEventListener('click', function(event) {
    event.stopPropagation();
  });
});
