import { Pinecone, PineconeRecord, QueryResponse, RecordMetadata } from "@pinecone-database/pinecone";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(embeddings: number[], filePath: string) {
    
    try {
        // const pinecone = new Pinecone({
        //     environment: process.env.PINECONE_ENVIRONMENT!,
        //     apiKey: process.env.PINECONE_API_KEY!
        // });
        // const index = pinecone.index('chat-pdfs')
        // const ns = index.namespace(convertToAscii(filePath))

        // const queryResponse = await ns.query({
        //     topK: 5,
        //     vector: embeddings,
        //     includeMetadata: true,
        //     includeValues: false,
        // });

        const url = `${process.env.PINECONE_HOST!}/query`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                "Api-Key": process.env.PINECONE_API_KEY!
            },
            body: JSON.stringify({
                includeValues: false,
                includeMetadata: true,
                topK: 5,
                vector: embeddings,
                namespace: convertToAscii(filePath),
            })
        })

        // Handle the response
        if (!res.ok) {
            throw new Error(`Pinecone API responded with ${res.status}: ${res.statusText}`);
        }
        const queryResponse = await res.json();
        return queryResponse.matches || [];
    } catch (error) {
        console.log('error querying embeddings', error)
        throw error
    }
}

export async function getContext(query: string, filePath: string) {
    const queryEmbeddings = await getEmbeddings(query)
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, filePath)
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