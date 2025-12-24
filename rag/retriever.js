/**
 * RAG Retriever - поиск релевантных документов
 * Семантический поиск с поддержкой иврита
 */

const { getVectorStore } = require('./vectorStore');

/**
 * Найти релевантные документы по запросу
 * @param {string} query - Запрос пользователя
 * @param {number} k - Количество документов для возврата
 * @returns {Promise<Array>} Массив релевантных документов
 */
async function retrieveContext(query, k = 3) {
    try {
        const vectorStore = await getVectorStore();

        // Семантический поиск по запросу
        const results = await vectorStore.similaritySearch(query, k);

        if (results.length === 0) {
            console.log('⚠️ Релевантные документы не найдены');
            return [];
        }

        console.log(`✅ Найдено ${results.length} релевантных документов`);
        return results;

    } catch (error) {
        console.error('❌ Ошибка поиска документов:', error.message);
        return [];
    }
}

/**
 * Получить контекст для промпта Gemini
 * @param {string} query - Запрос пользователя
 * @param {number} k - Количество документов
 * @returns {Promise<string>} Контекст в виде строки
 */
async function getContextForPrompt(query, k = 3) {
    const docs = await retrieveContext(query, k);

    if (docs.length === 0) {
        return '';
    }

    // Объединяем содержимое документов в один контекст
    const context = docs
        .map((doc, index) => `[Документ ${index + 1}]\n${doc.pageContent}`)
        .join('\n\n---\n\n');

    return context;
}

module.exports = { retrieveContext, getContextForPrompt };
