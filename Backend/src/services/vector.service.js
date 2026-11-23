const { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

const cohortChatGptIndex = pc.index({
    name: 'chatbot'
});


// Store memory
async function createMemory({
    messageId,
    chunkText,
    title,
    userId,
    chatId,
    role
}) {
    return await cohortChatGptIndex.documents.upsert({
        documents: [
            {
                _id: String(messageId),
                title,
                chunk_text: chunkText,
                user: String(userId),
                chat: String(chatId),
                role
            }
        ]
    });
}

// Retrieve relevant memories
async function queryMemory({
    queryText,
    limit = 5,
    userId
}) {
    const data = await cohortChatGptIndex.documents.search({
        scoreBy: [
            {
                type: 'embed',
                field: 'chunk_text',
                query: queryText
            }
        ],
        topK: limit,
        filter: {
            user: {
                $eq: String(userId)
            }
        },
        includeFields: [
            'title',
            'chunk_text',
            'user',
            'chat',
            'role'
        ]
    });

    return data.matches;
}

module.exports = {
    createMemory,
    queryMemory
};