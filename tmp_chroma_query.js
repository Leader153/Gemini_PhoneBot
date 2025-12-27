const { ChromaClient } = require('chromadb');
const { COLLECTION_NAME } = require('./rag/vectorStore');

const CHROMA_URL = 'http://localhost:8000';

async function queryChroma() {
    try {
        const client = new ChromaClient({ path: CHROMA_URL });
        const collection = await client.getCollection({ name: COLLECTION_NAME });

        const count = await collection.count();
        console.log(`\nВ коллекции "${COLLECTION_NAME}" найдено ${count} документов.`);

        console.log(`\nВсе метаданные документов в коллекции "${COLLECTION_NAME}":`);
        
        // Получаем все документы с их метаданными
        const allDocuments = await collection.get({
            include: ["metadatas"] // Запрашиваем только метаданные
        });

        if (allDocuments.metadatas && allDocuments.metadatas.length > 0) {
            allDocuments.metadatas.forEach((metadata, index) => {
                console.log(`--- Документ ${index + 1} ---`);
                console.log(metadata);
            });
        } else {
            console.log("Метаданные документов не найдены.");
        }

    } catch (error) {
        console.error("Ошибка при запросе ChromaDB:", error);
    }
}

queryChroma();

//node tmp_chroma_query.js