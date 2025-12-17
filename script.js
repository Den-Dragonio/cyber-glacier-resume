// script.js

// --- Прогрес Бар ---
window.onscroll = function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
};

// --- Логіка Бульбашок ---
const container = document.getElementById('bubble-container');
const MAX_BUBBLES = 2; // Максимум одночасно
let activeBubbles = []; // Масив активних елементів

function createBubble() {
    // Створюємо елемент
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    // --- Рандомізація ---
    // Розмір: від 20% до 40% ширини екрану (Гігантські)
    const minSize = window.innerWidth * 0.2; 
    const maxSize = window.innerWidth * 0.4;
    const size = Math.random() * (maxSize - minSize) + minSize;
    
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;

    // Позиція по горизонталі: рандомно, але так щоб не завжди по центру

   // Встановлюємо максимальний діапазон, наприклад, 20% ширини бульбашки за межами екрана
    const OUT_OF_BOUNDS_FACTOR = 0.2; 
    
    // Мінімальна позиція (зліва: частково за екраном)
    const leftMin = -(size * OUT_OF_BOUNDS_FACTOR); 
        
    // Максимальна позиція (справа: екран + частина бульбашки)
    const leftMax = window.innerWidth - size + (size * OUT_OF_BOUNDS_FACTOR);
        
    // Розраховуємо загальний діапазон і генеруємо рандомну позицію
    const range = leftMax - leftMin;
    const left = Math.random() * range + leftMin;
    
    bubble.style.left = `${left}px`;

    // Швидкість: дуже повільно (15-25 секунд)
    const duration = Math.random() * 10 + 15; 
    bubble.style.transition = `transform ${duration}s linear, opacity 2s ease`;

    // Додаємо в DOM і в масив
    container.appendChild(bubble);
    activeBubbles.push({ element: bubble, created: Date.now() });

    // Запуск анімації (через невелику затримку для спрацювання CSS transition)
    requestAnimationFrame(() => {
        bubble.style.opacity = '0.6'; // Легка видимість
        bubble.style.transform = `translateY(-${window.innerHeight + size + 200}px)`;
    });

    // Видалення після завершення анімації
    setTimeout(() => {
        bubble.remove();
        // Видаляємо з масиву активних
        activeBubbles = activeBubbles.filter(b => b.element !== bubble);
    }, duration * 1000);
}

// --- Головний цикл контролю ---
function gameLoop() {
    const screenHeight = window.innerHeight;
    
    // 1. Якщо бульбашок 0 - створюємо одну
    if (activeBubbles.length === 0) {
        createBubble();
    } 
    // 2. Якщо бульбашка є, перевіряємо де вона
    else if (activeBubbles.length < MAX_BUBBLES) {
        // Беремо останню створену бульбашку
        const lastBubble = activeBubbles[activeBubbles.length - 1].element;
        const rect = lastBubble.getBoundingClientRect();
        
        // Обчислюємо її низ (bottom). 
        // Якщо низ бульбашки перетнув середину екрану (йде вгору), можна пускати нову.
        // rect.bottom стає меншим, коли бульбашка піднімається.
        const bubbleBottom = rect.bottom;
        const triggerLine = screenHeight / 2; 

        if (bubbleBottom < triggerLine) {
            createBubble();
        }
    }

    // Перевіряємо частіше для плавності
    requestAnimationFrame(gameLoop);
}
// Получаем элементы модального окна
const modal = document.getElementById("diplomaModal");
const modalImg = document.getElementById("modalImage");
const closeBtn = document.querySelector(".close-btn");

// Функция открытия (вызывается при клике на иконку)
function openDiploma(imageSrc) {
    modal.style.display = "block";
    modalImg.src = imageSrc; // Устанавливаем картинку
    document.body.style.overflow = "hidden"; // Запрещаем скролл сайта
}

// Закрытие при клике на крестик
closeBtn.onclick = function() {
    closeModal();
}

// Закрытие при клике ВНЕ картинки (на темный фон)
window.onclick = function(event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Закрытие клавишей ESC
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Возвращаем скролл
}

// Запуск
createBubble(); // Перша бульбашка
gameLoop();     // Запуск контролера