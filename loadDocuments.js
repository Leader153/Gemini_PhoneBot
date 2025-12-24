/**
 * Скрипт загрузки документов в ChromaDB
 * Поддержка всех форматов: PDF, DOCX, TXT, MD
 * Поддержка иврита и многоязычности
 * 
 * ИСПРАВЛЕНИЕ: Теперь скрипт удаляет старую коллекцию перед загрузкой новых документов
 */

const path = require('path');
const { loadDocumentsFromFolder } = require('./rag/documentLoader');
const { Chroma } = require('@langchain/community/vectorstores/chroma');
const { embeddings } = require('./rag/embeddings');
const { COLLECTION_NAME } = require('./rag/vectorStore');
const { ChromaClient } = require('chromadb');

// Путь к папке с документами
const DATA_FOLDER = path.join(__dirname, 'data');
const CHROMA_URL = 'http://localhost:8000';

async function main() {
    console.log('🚀 Начало загрузки документов в ChromaDB...\n');

    try {
        /* 
        // 0. Подключение к ChromaDB и удаление старой коллекции (ОТКЛЮЧЕНО для безопасности данных)
        console.log('🔄 Подключение к ChromaDB...');
        const chromaClient = new ChromaClient({ host: CHROMA_URL });

        try {
            console.log(`🗑️  Удаление старой коллекции "${COLLECTION_NAME}"...`);
            await chromaClient.deleteCollection({ name: COLLECTION_NAME });
            console.log('✅ Старая коллекция удалена\n');
        } catch (error) {
            // Если коллекция не существует, это нормально
            console.log('ℹ️  Коллекция не существует, создаем новую\n');
        }
        */
        console.log('🔄 Режим: Добавление новых документов в существующую базу (Append)');

        // 1. Загрузить все документы из папки data/
        console.log(`📁 Сканирование папки: ${DATA_FOLDER}`);
        const docs = await loadDocumentsFromFolder(DATA_FOLDER);

        if (docs.length === 0) {
            console.log('\n⚠️ Документы не найдены в папке data/');
            console.log('💡 Поместите файлы (PDF, DOCX, TXT, MD) в папку data/ и запустите скрипт снова.');
            return;
        }

        console.log(`\n✅ Загружено ${docs.length} чанков из документов`);

        // 2. Подключиться к хранилищу и добавить документы
        console.log(`\n🔄 Добавление документов в ChromaDB...`);
        console.log(`   Коллекция: ${COLLECTION_NAME}`);
        console.log(`   URL: ${CHROMA_URL}`);

        const { getVectorStore } = require('./rag/vectorStore');
        const vectorStore = await getVectorStore();

        await vectorStore.addDocuments(docs);

        console.log('\n✅ Все документы успешно загружены в ChromaDB!');
        console.log(`📊 Статистика:`);
        console.log(`   - Всего чанков: ${docs.length}`);
        console.log(`   - Коллекция: ${COLLECTION_NAME}`);
        console.log(`   - Готово к использованию в RAG!`);
        console.log('\n💡 Теперь вы можете запустить голосовой бот: node answer_phone.js');

    } catch (error) {
        console.error('\n❌ Ошибка загрузки документов:', error.message);
        console.error('\n💡 Убедитесь, что:');
        console.error('   1. ChromaDB запущен (docker ps)');
        console.error('   2. Файлы находятся в папке data/');
        console.error('   3. GEMINI_API_KEY установлен в .env');
        console.error('\n🔧 Полная ошибка:', error);
        process.exit(1);
    }
}

// Запуск скрипта
main();
