// Получаем элементы по их ID

const rocket = document.getElementById("rocket");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");

// Переменные для счета и уровня
let score = 0;
let level = 1;
let obstacleCleared = false;

// Массивы с изображениями для каждого уровня
const homoImages = [
    "img/homo1.png", // Уровень 1
    "img/homo2.png", // Уровень 2
    "img/homo3.png", // Уровень 3
    "img/homo4.png", // Уровень 4
    "img/homo5.png"  // Уровень 5
];

const obstacleImages = [
    "img/elka.png", // Уровень 1
    "img/mamont.png", // Уровень 2
    "img/fire.png",  // Уровень 3
    "img/vulkan.png", // Уровень 4
    "img/car.png" // Уровень 5
];

const levelNames = [
    "Австралопитек", // Уровень 1
    "Человек умелый",   // Уровень 2
    "Человек прямоходящий",    // Уровень 3
    "Неандерталец", // Уровень 4
    "Кроманьонец" // Уровень 5
];

// Функция для обновления изображения человека
function updateHomoImage() {
    const homo = document.getElementById("homo");
    if (homo && level <= homoImages.length) {
        homo.style.backgroundImage = `url(${homoImages[level - 1]})`;
    }
}

// Функция для обновления изображения препятствия
function updateObstacleImage() {
    const obstacle = document.getElementById("obstacle");
    if (obstacle && level <= obstacleImages.length) {
        obstacle.style.backgroundImage = `url(${obstacleImages[level - 1]})`;
    }
}

// Функция прыжка
function jump() {
    if (!homo.classList.contains("jump")) {
        homo.classList.add("jump");
        setTimeout(function () {
            homo.classList.remove("jump");
        }, 500);
    }
}

// Добавляем обработчик событий
document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
        jump();
    }
});

// Функция для отправки результатов в базу данных
function sendResultsToDatabase(score, level) {
    fetch('http://localhost/evo/result.php', { // Исправлено: убрана лишняя кавычка
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `score=${score}&level=${level}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Сеть ответила с ошибкой: ' + response.status);
        }
        return response.text();
    })
    .then(data => {
        console.log('Результаты отправлены:', data); // Выводим ответ сервера в консоль
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
}

// Устанавливаем интервал для проверки состояния игры каждые 10 мс
let isAlive = setInterval(function () {
    // Получаем текущую y-позицию человека
    let homoTop = parseInt(window.getComputedStyle(homo).getPropertyValue("top"));
    // Получаем текущую x-позицию препятствия
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));

    // Проверяем условия столкновения
    if (obstacleLeft < 50 && obstacleLeft > 0 && homoTop >= 120) {
        let loseMessage;
        switch (level) {
            case 1:
                loseMessage = "Вы застряли в елке!";
                break;
            case 2:
                loseMessage = "Вас съел мамонт!";
                break;
            case 3:
                loseMessage = "Вы сгорели!";
                break;
            case 4:
                loseMessage = "Вы попали в вулкан!";
                break;
            case 5:
                loseMessage = "Вас сбила машина!";
                break;
            default:
                loseMessage = "Вы проиграли!";
        }
        alert(loseMessage);
        sendResultsToDatabase(score, level); // Отправляем результаты в БД
        resetGame(); // Сбрасываем игру
    } else if (obstacleLeft <= 0) {
        // Если препятствие прошло человека, но еще не было засчитано
        if (!obstacleCleared) {
            // Увеличиваем счет, когда препятствие проходит мимо человека
            score += 5;
            updateScore(); // Обновляем счет

            // Проверяем, не достиг ли счет 50
            if (score >= 50) {
                // Завершаем игру и показываем ракету
                clearInterval(isAlive); // Останавливаем игру
                obstacle.style.display = "none"; // Скрываем препятствие
                rocket.style.display = "block"; // Показываем ракету
            
                homo.style.animation = "walkToRocket 2s forwards";
            
                // Ждем 2 секунды, чтобы человек подошел к ракете
                setTimeout(() => {
                    homo.style.animation = "flyWithRocket 2s forwards"; // Двигается вверх вместе с ракетой
                    rocket.style.animation = "takeOff 2s forwards"; // Запускаем анимацию взлета
                }, 2000);
            
                // Ждем еще 4 секунды, чтобы завершить анимацию
                setTimeout(() => {
                    alert("Поздравляем! Вы достигли последней ступени эволюции!"); // Сообщение о победе
                }, 4000);
                sendResultsToDatabase(score, level); // Отправляем результаты в БД
                return; // Выход из функции
            }

            // Увеличиваем уровень каждые 10 очков
            if (score % 10 === 0) {
                level++;
                updateLevel(); // Обновляем уровень
                updateHomoImage(); // обновляем изображение человека
                updateObstacleImage(); // обновляем изображение препятствия
            }

            // Устанавливаем флаг, чтобы препятствие не засчитывалось повторно
            obstacleCleared = true;
        }
    } else {
        // Если препятствия еще не прошло человека, сбрасываем флаг
        obstacleCleared = false;
    }
}, 10);

// Функция обновления счета
function updateScore() {
    if (scoreDisplay) {
        scoreDisplay.innerText = "Счет: " + score; // Обновляем отображение счета
    }
}

// Функция обновления уровня
function updateLevel() {
    if (levelDisplay) {
        levelDisplay.innerText = "Уровень: " + levelNames[level - 1]; // Обновляем отображение уровня
    }
}

// Функция сброса игры
function resetGame() {
    score = 0;
    level = 1;
    obstacleCleared = false;
    updateScore();
    updateLevel();
    updateHomoImage(); // обновляем изображение человека
    updateObstacleImage(); // обновляем изображение препятствия
}

// Инициализация изображений человека и препятствия
updateHomoImage();
updateObstacleImage();

module.exports = {
    updateScore,
    updateLevel,
    resetGame,
    updateHomoImage,
    updateObstacleImage
};