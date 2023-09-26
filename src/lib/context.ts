import { Pinecone, PineconeRecord, QueryResponse, RecordMetadata } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[], filePath: string) {
    
    try {
        console.log("aqui1")
        const pinecone = new Pinecone({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!
        });
        console.log("aqui2")
        const index = pinecone.index('chat-pdfs')
        console.log("aqui3")
        const ns = index.namespace(convertToAscii(filePath))
        console.log("aqui4")

        const queryResponse = await ns.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true
        })
        console.log("aqui5")
        console.log(queryResponse)
        return queryResponse.matches || []
    } catch (error) {
        console.log('error querying embeddings', error)
        throw error
    }
}

export async function getContext(query: string, filePath: string) {
    console.log("10")
    const queryEmbeddings = await getEmbeddings(query)
    console.log("11")
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, filePath)
    console.log("12")
    const qualifyingDocs = matches.filter(match => match.score && match.score > 0.7)
    
    type Metadata = {
        text: string,
        pageNumber: number
    }

    let docs = qualifyingDocs.map(match => (match.metadata as Metadata).text)
    
    return docs.join('\n').substring(0, 3000);
}

function convertToAscii(inputString: string) {
    // remove non ascii characters
    const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
    return asciiString;
}