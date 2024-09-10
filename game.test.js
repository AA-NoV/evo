// game.test.js

const { updateScore, updateLevel, resetGame } = require('./script'); // Импортируйте функции из вашего основного файла

// Подготовка DOM для тестирования
beforeEach(() => {
    document.body.innerHTML = `
        <div id="score"></div>
        <div id="level"></div>
    `;
});

// Определяем массивы имен уровней для тестирования
const levelNames = ["Австралопитек", "Человек умелый", "Человек прямоходящий", "Неандерталец", "Кроманьонец"];

describe('Game Functions', () => {
    test('updateScore should correctly update the score display', () => {
        // Установим начальное значение счета
        const scoreDisplay = document.getElementById('score');
        updateScore(); // Вызываем функцию без параметров, чтобы обновить счет
        expect(scoreDisplay.innerText).toBe("Счет: 0"); // Проверяем, что начальное значение счета 0

        // Увеличиваем счет
        score = 10; // Устанавливаем значение счета
        updateScore(); // Обновляем отображение счета
        expect(scoreDisplay.innerText).toBe("Счет: 10"); // Проверяем, что счет обновился
    });

    test('updateLevel should correctly update the level display', () => {
        // Установим начальное значение уровня
        const levelDisplay = document.getElementById('level');
        updateLevel(); // Вызываем функцию без параметров, чтобы обновить уровень
        expect(levelDisplay.innerText).toBe("Уровень: Австралопитек"); // Проверяем, что начальное значение уровня 1

        // Увеличиваем уровень
        level = 2; // Устанавливаем значение уровня
        updateLevel(); // Обновляем отображение уровня
        expect(levelDisplay.innerText).toBe("Уровень: Человек умелый"); // Проверяем, что уровень обновился
    });
});