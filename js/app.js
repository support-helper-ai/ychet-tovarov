/**
 * Главный скрипт приложения
 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');

    // Отправка по нажатию кнопки
    if (sendBtn && input) {
        sendBtn.addEventListener('click', () => {
            HelperAI.sendMessage(input.value);
            input.value = '';
        });

        // Отправка по клавише Enter
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                HelperAI.sendMessage(input.value);
                input.value = '';
            }
        });
    }
});

// Глобальная функция для обработки кликов по чипам/быстрым кнопкам
function sendQuickPrompt(promptText) {
    HelperAI.sendMessage(promptText);
}
