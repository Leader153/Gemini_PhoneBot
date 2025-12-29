/**
 * RAG Retriever - поиск релевантных документов
 * Семантический поиск с поддержкой иврита
 */

const { getVectorStore } = require('./vectorStore');

const DOMAIN_KEYWORDS = {
    Terminals: ['terminal', 'nova', 'modu', 'מסוף', 'מסופון', 'קופה', 'אשראי', 'טרמינל', 'נובה'],
    Yachts: ['yacht', 'joy-be', 'sailing', 'cruise', 'יאכטה', 'שייט', 'הפלגה'],
};

/**
 * Определяет домен (категорию) на основе ключевых слов в запросе.
 * @param {string} query - Запрос пользователя.
 * @returns {string|null} - Имя домена ('Terminals' или 'Yachts') или null.
 */
function inferDomain(query) {
    if (!query) return null;
    const lowerCaseQuery = query.toLowerCase();

    for (const domain in DOMAIN_KEYWORDS) {
        for (const keyword of DOMAIN_KEYWORDS[domain]) {
            if (lowerCaseQuery.includes(keyword)) {
                console.log(`🔍 Домен определен: ${domain} (по слову: "${keyword}")`);
                return domain;
            }
        }
    }
    console.log('⚠️ Домен не определен, будет выполнен поиск по всей базе.');
    return null;
}


/**
 * Найти релевантные документы по запросу, с фильтрацией по домену.
 * @param {string} query - Запрос пользователя
 * @param {number} k - Количество документов для возврата
 * @returns {Promise<Array>} Массив релевантных документов
 */
async function retrieveContext(query, k = 3) {
    try {
        const vectorStore = await getVectorStore();
        const domain = inferDomain(query);

        let filter = {};
        if (domain) {
            filter = {
                "Domain": domain
            };
        }

        // Семантический поиск по запросу с фильтром
        const results = await vectorStore.similaritySearch(query, k, filter);

        if (results.length === 0) {
            console.log('⚠️ Релевантные документы не найдены (с учетом фильтра)');
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
