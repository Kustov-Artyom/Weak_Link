document.addEventListener('DOMContentLoaded', function () {
    // Элементы интерфейса
    const timerInput = document.getElementById('timer');
    const timerDisplay = document.getElementById('timer-display');
    const bankDisplay = document.getElementById('bank');
    const scoreDisplay = document.getElementById('score');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const correctBtn = document.getElementById('correct-btn');
    const wrongBtn = document.getElementById('wrong-btn');
    const bankBtn = document.getElementById('bank-btn');
    const resetBankBtn = document.getElementById('reset-bank-btn');
    const resetTimerBtn = document.getElementById('reset-timer-btn');
    const scoreItems = document.querySelectorAll('.score-item');

    // Переменные игры
    let timer;
    let timeLeft = 0;
    let isRunning = false;
    let isPaused = false;
    let currentScoreIndex = 0;
    let scoreValues = [20, 50, 100, 150, 300, 500, 700, 1000];
    let currentScore = 0;
    let bank = 0;

    // Инициализация
    updateTimerDisplay(120); // 2 минуты по умолчанию

    // Обработчики событий
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', togglePause);
    correctBtn.addEventListener('click', addScore);
    wrongBtn.addEventListener('click', wrongAnswer);
    bankBtn.addEventListener('click', bankScore);
    resetBankBtn.addEventListener('click', resetBank);
    resetTimerBtn.addEventListener('click', resetTimer);
    timerInput.addEventListener('input', validateTimerInput);

    // Функции
    function validateTimerInput() {
        const value = timerInput.value;
        const regex = /^([0-5]?\d):([0-5]\d)$/;

        if (!regex.test(value)) {
            timerInput.setCustomValidity('Введите время в формате мм:сс (до 5:59)');
        } else {
            timerInput.setCustomValidity('');

            // Обновляем отображение таймера
            const [minutes, seconds] = value.split(':').map(Number);
            updateTimerDisplay(minutes * 60 + seconds);
        }
    }

    function updateTimerDisplay(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function startGame() {
        if (isRunning) return;

        // Получаем время из ввода
        const [minutes, seconds] = timerInput.value.split(':').map(Number);
        timeLeft = minutes * 60 + seconds;

        // Проверяем корректность времени
        if (timeLeft < 20 || timeLeft > 300) {
            alert('Введите время от 20 секунд до 5 минут');
            return;
        }

        // Обновляем интерфейс
        updateTimerDisplay(timeLeft);
        startBtn.classList.add('disabled');
        startBtn.disabled = true;
        pauseBtn.classList.remove('disabled');
        pauseBtn.disabled = false;
        correctBtn.classList.remove('disabled');
        correctBtn.disabled = false;
        wrongBtn.classList.remove('disabled');
        wrongBtn.disabled = false;
        bankBtn.classList.remove('disabled');
        bankBtn.disabled = false;

        // Сбрасываем счет
        currentScoreIndex = 0;
        currentScore = 0;
        scoreDisplay.textContent = '0';
        resetScoreItems();

        isRunning = true;
        isPaused = false;
        pauseBtn.textContent = 'Пауза';

        // Запускаем таймер
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        if (isPaused) return;

        timeLeft--;
        updateTimerDisplay(timeLeft);

        if (timeLeft <= 0) {
            endGame();
        }
    }

    function togglePause() {
        if (!isRunning) return;

        isPaused = !isPaused;

        if (isPaused) {
            pauseBtn.textContent = 'Продолжить';
        } else {
            pauseBtn.textContent = 'Пауза';
        }
    }

    function addScore() {
        if (!isRunning || isPaused) return;

        // Добавляем очки
        const points = scoreValues[currentScoreIndex];
        currentScore += points;
        scoreDisplay.textContent = currentScore;

        // Подсвечиваем плашку
        scoreItems[7 - currentScoreIndex].classList.add('active');

        // Переходим к следующему уровню
        currentScoreIndex++;

        // Если достигли максимального уровня, добавляем в банк
        if (currentScoreIndex >= scoreValues.length) {
            bankScore();
        }
    }

    function wrongAnswer() {
        if (!isRunning || isPaused) return;

        // Сбрасываем счет
        currentScore = 0;
        scoreDisplay.textContent = '0';
        currentScoreIndex = 0;
        resetScoreItems();
    }

    function bankScore() {
        if (!isRunning || isPaused) return;

        // Добавляем очки в банк
        bank += currentScore;
        bankDisplay.textContent = bank;

        // Сбрасываем счет
        currentScore = 0;
        scoreDisplay.textContent = '0';
        currentScoreIndex = 0;
        resetScoreItems();
    }

    function resetBank() {
        bank = 0;
        bankDisplay.textContent = '0';
    }

    function resetTimer() {
        if (isRunning) {
            endGame();
        } else {
            // Сбрасываем таймер к начальному значению
            const [minutes, seconds] = timerInput.value.split(':').map(Number);
            timeLeft = minutes * 60 + seconds;
            updateTimerDisplay(timeLeft);
        }
    }

    function resetScoreItems() {
        scoreItems.forEach(item => item.classList.remove('active'));
    }

    function endGame() {
        clearInterval(timer);
        isRunning = false;

        // Добавляем очки в банк
        bank += currentScore;
        bankDisplay.textContent = bank;

        // Сбрасываем счет
        currentScore = 0;
        scoreDisplay.textContent = '0';
        currentScoreIndex = 0;
        resetScoreItems();

        // Обновляем интерфейс
        startBtn.classList.remove('disabled');
        startBtn.disabled = false;
        pauseBtn.classList.add('disabled');
        pauseBtn.disabled = true;
        correctBtn.classList.add('disabled');
        correctBtn.disabled = true;
        wrongBtn.classList.add('disabled');
        wrongBtn.disabled = true;
        bankBtn.classList.add('disabled');
        bankBtn.disabled = true;
        pauseBtn.textContent = 'Пауза';
    }
});