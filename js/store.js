/**
 * Модуль Store — Управление каталогом и операциями смены
 */
const Store = {
    // Начальный каталог товаров
    catalog: [
        { id: 1001, name: "Торнадо 0.5", price: 140, count: 30 }
    ],

    // Метод добавления нового товара
    addProduct(data) {
        const newProduct = {
            id: Math.floor(1000 + Math.random() * 9000), // Генерация артикула
            name: data.name || "Без названия",
            price: Number(data.price) || 0,
            count: Number(data.count) || 1
        };

        this.catalog.push(newProduct);
        console.log("Товар добавлен в каталог:", newProduct);

        // Событие обновления каталога (при необходимости обновить UI)
        if (typeof this.onCatalogUpdate === 'function') {
            this.onCatalogUpdate(this.catalog);
        }

        return newProduct;
    },

    // Получить список всех товаров
    getCatalog() {
        return this.catalog;
    }
};
