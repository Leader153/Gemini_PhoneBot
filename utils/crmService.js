/**
 * Имитация сервиса CRM для получения данных о клиентах.
 */

// База "известных" клиентов
const mockDatabase = {
    '449': {
        name: 'Daniel',
        gender: 'male'
    },
    '000': {
        name: 'Maria',
        gender: 'female'
    }
};

/**
 * Получает данные клиента по номеру телефона.
 * @param {string} phone - Номер телефона звонящего
 * @returns {Object|null} - Данные клиента или null, если не найден
 */
function getCustomerData(phone) {
    if (!phone) return null;

    // Ищем соответствие по последним цифрам (для простоты теста)
    for (const suffix in mockDatabase) {
        if (phone.endsWith(suffix)) {
            console.log(`🔍 CRM: Найден клиент ${mockDatabase[suffix].name} по суффиксу ${suffix}`);
            return mockDatabase[suffix];
        }
    }

    return null;
}

module.exports = {
    getCustomerData
};
