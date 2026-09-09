/**
 * Модуль Helper AI — Управление диалогом и состояниями ассистента
 */
const HelperAI = {
    // Состояние диалога: 'IDLE' | 'WAITING_FOR_PRODUCT_DETAILS'
    state: 'IDLE',

    // Константы команд/промптов
    prompts: {
        ADD_PRODUCT: "Добавить товар",
        COUNT_SHIFT: "Считать смену"
    },

    // Точка входа: обработка входящего сообщения от пользователя
    sendMessage(userText) {
        const text = userText.trim();
        if (!text) return;

        // 1. Отображаем сообщение пользователя
        this.ui.renderMessage(text, 'user');

        // 2. Обрабатываем ответ с задержкой (имитация думающего AI)
        setTimeout(() => {
            const botResponse = this.processLogic(text);
            this.ui.renderMessage(botResponse, 'bot');
        }, 300);
    },

    // Основной маршрутизатор логики (State Machine)
    processLogic(text) {
        const lowerText = text.toLowerCase();

        // ШАГ 2: Помощник ожидает ввода деталей товара
        if (this.state === 'WAITING_FOR_PRODUCT_DETAILS') {
            return this.handlers.handleProductCreation(text);
        }

        // ШАГ 1: Пользователь нажал или написал "Добавить товар"
        if (lowerText === this.prompts.ADD_PRODUCT.toLowerCase() || lowerText === '+ добавить товар') {
            this.state = 'WAITING_FOR_PRODUCT_DETAILS';
            return "Какой товар добавить? Укажите **Название**, **Цену** и **Количество**.";
        }

        // Обработка других запросов
        if (lowerText === this.prompts.COUNT_SHIFT.toLowerCase()) {
            return "📊 Смена открыта! Продаж пока нет.";
        }

        return "Я могу помочь с добавлением товаров в каталог или подсчетом смены. Нажмите кнопку **+ Добавить товар**.";
    },

    // Обработчики сценариев
    handlers: {
        handleProductCreation(text) {
            // Сбрасываем состояние
            HelperAI.state = 'IDLE';

            // Извлекаем параметры из текста
            const parsedData = HelperAI.utils.parseProductText(text);

            if (!parsedData) {
                return "⚠️ Не удалось распознать параметры товара. Попробуйте написать в формате: <i>Торнадо 0.5, цена 140, 30 штук</i>";
            }

            // Добавляем товар через модуль Store
            const created = Store.addProduct(parsedData);

            return `✨ Товар <b>${created.name}</b> успешно внесен в каталог!<br>` +
                   `• Цена: ${created.price} ₽<br>` +
                   `• Кол-во: ${created.count} шт.<br>` +
                   `• Артикул: ${created.id}`;
        }
    },

    // Утилиты (парсинг входящих данных)
    utils: {
        parseProductText(text) {
            const numbers = text.match(/\d+/g);
            if (!numbers || numbers.length === 0) return null;

            const price = numbers[0];
            const count = numbers[1] || 1;

            // Извлекаем название, убирая служебные слова
            let name = text
                .replace(/цена/gi, '')
                .replace(/руб|рублей|₽/gi, '')
                .replace(/штук|шт/gi, '')
                .replace(/,/g, '')
                .replace(/\d+/g, '')
                .trim();

            if (!name) name = "Товар без названия";

            return { name, price, count };
        }
    },

    // Управление отображением чата
    ui: {
        renderMessage(text, sender) {
            const chatBody = document.getElementById('chatBody');
            if (!chatBody) return;

            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.innerHTML = text;

            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }
};
