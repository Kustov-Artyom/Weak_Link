document.addEventListener('DOMContentLoaded', function() {
    // Элементы интерфейса (изменены под ваши классы)
    const timerDisplay = document.querySelector('.timer_panel .panel_div');
    const bankDisplay = document.querySelector('.bank_panel .panel_div');
    const scoreDisplay = document.querySelector('.points_panel .panel_div');
    const startBtn = document.querySelector('.first_floor');
    const pauseBtn = document.querySelector('.block_pause');
    const correctBtn = document.querySelector('.block_true');
    const wrongBtn = document.querySelector('.block_false');
    const bankBtn = document.querySelector('.block_bank');
    const resetBankBtn = document.querySelector('.fourth_floor div:last-child');
    const resetTimerBtn = document.querySelector('.fourth_floor div:first-child');
    const scoreItems = document.querySelectorAll('.score-item');
    
    // Создаем input для таймера (добавляем в ваш div)
    const timerInput = document.createElement('input');
    timerInput.type = 'text';
    timerInput.value = '2:00';
    timerInput.placeholder = 'мм:сс';
    timerInput.style.width = '100%';
    timerInput.style.height = '100%';
    timerInput.style.border = 'none';
    timerInput.style.background = 'transparent';
    timerInput.style.textAlign = 'center';
    timerInput.style.fontSize = '25px';
    timerInput.style.outline = 'none';
    document.querySelector('.timer_panel .panel_div').appendChild(timerInput);
    
    // Инициализация дисплеев
    timerDisplay.innerHTML = '<span style="font-size: 25px;">2:00</span>';
    bankDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
    scoreDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
    
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
        timerDisplay.innerHTML = `<span style="font-size: 25px;">${minutes}:${seconds.toString().padStart(2, '0')}</span>`;
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
        startBtn.style.opacity = '0.5';
        startBtn.style.pointerEvents = 'none';
        pauseBtn.style.opacity = '1';
        pauseBtn.style.pointerEvents = 'auto';
        correctBtn.style.opacity = '1';
        correctBtn.style.pointerEvents = 'auto';
        wrongBtn.style.opacity = '1';
        wrongBtn.style.pointerEvents = 'auto';
        bankBtn.style.opacity = '1';
        bankBtn.style.pointerEvents = 'auto';
        
        // Сбрасываем счет
        currentScoreIndex = 0;
        currentScore = 0;
        scoreDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
        resetScoreItems();
        
        isRunning = true;
        isPaused = false;
        pauseBtn.querySelector('p').textContent = 'Пауза';
        
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
            pauseBtn.querySelector('p').textContent = 'Продолжить';
        } else {
            pauseBtn.querySelector('p').textContent = 'Пауза';
        }
    }
    
    function addScore() {
        if (!isRunning || isPaused) return;
        
        // Добавляем очки
        const points = scoreValues[currentScoreIndex];
        currentScore += points;
        scoreDisplay.innerHTML = `<span style="font-size: 25px;">${currentScore}</span>`;
        
        // Подсвечиваем плашку
        scoreItems[7 - currentScoreIndex].style.backgroundColor = '#74FF79';
        
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
        scoreDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
        currentScoreIndex = 0;
        resetScoreItems();
    }
    
    function bankScore() {
        if (!isRunning || isPaused) return;
        
        // Добавляем очки в банк
        bank += currentScore;
        bankDisplay.innerHTML = `<span style="font-size: 25px;">${bank}</span>`;
        
        // Сбрасываем счет
        currentScore = 0;
        scoreDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
        currentScoreIndex = 0;
        resetScoreItems();
    }
    
    function resetBank() {
        bank = 0;
        bankDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
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
        scoreItems.forEach(item => item.style.backgroundColor = '#D9D9D9');
    }
    
    function endGame() {
        clearInterval(timer);
        isRunning = false;
        
        // Добавляем очки в банк
        bank += currentScore;
        bankDisplay.innerHTML = `<span style="font-size: 25px;">${bank}</span>`;
        
        // Сбрасываем счет
        currentScore = 0;
        scoreDisplay.innerHTML = '<span style="font-size: 25px;">0</span>';
        currentScoreIndex = 0;
        resetScoreItems();
        
        // Обновляем интерфейс
        startBtn.style.opacity = '1';
        startBtn.style.pointerEvents = 'auto';
        pauseBtn.style.opacity = '0.5';
        pauseBtn.style.pointerEvents = 'none';
        correctBtn.style.opacity = '0.5';
        correctBtn.style.pointerEvents = 'none';
        wrongBtn.style.opacity = '0.5';
        wrongBtn.style.pointerEvents = 'none';
        bankBtn.style.opacity = '0.5';
        bankBtn.style.pointerEvents = 'none';
        pauseBtn.querySelector('p').textContent = 'Пауза';
    }
});