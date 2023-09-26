import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone'
import { PDFLoader } from 'langchain/document_loaders/fs/pdf'
import { downloadFromSupabase } from './supabase-server';
import {
    Document,
    RecursiveCharacterTextSplitter,
  } from "@pinecone-database/doc-splitter";
import md5 from "md5";
import { getEmbeddings } from './embeddings';


let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
    if(!pinecone){
        pinecone = new Pinecone({
            environment: process.env.PINECONE_ENVIRONMENT!,
            apiKey: process.env.PINECONE_API_KEY!
        });
    }
    return pinecone;
}

type PDFPage = {
    pageContent: string;
    metadata: {
      loc: { pageNumber: number };
    };
  };

export async function loadSupabaseIntoPinecone(filePath: string) {
    
    const file_name = await downloadFromSupabase(filePath);
    if(!file_name || typeof file_name !== "string"){
        throw new Error('could not download file from supabase')
    }

    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as PDFPage[];
    
    // split and segment the pdf
    const documents = await Promise.all(pages.map(prepareDocument));

    // vectorise and embed individual documents
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    const client = await getPineconeClient();
    const index = client.index('chat-pdfs')
    const namespace = convertToAscii(filePath);
    const ns = index.namespace(namespace);

    await ns.upsert(vectors)

    return documents[0];
}

function convertToAscii(inputString: string) {
    // remove non ascii characters
    const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
    return asciiString;
}

async function embedDocument(doc: Document) {
    try {
      const embeddings = await getEmbeddings(doc.pageContent);
      const hash = md5(doc.pageContent);
  
      return {
        id: hash,
        values: embeddings,
        metadata: {
          text: doc.metadata.text,
          pageNumber: doc.metadata.pageNumber,
        },
      } as PineconeRecord;
    } catch (error) {
      console.log("error embedding document", error);
      throw error;
    }
  }
  
  export const truncateStringByBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
  };
  
  async function prepareDocument(page: PDFPage) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, "");
    // split the docs
    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
      new Document({
        pageContent,
        metadata: {
          pageNumber: metadata.loc.pageNumber,
          text: truncateStringByBytes(pageContent, 36000),
        },
      }),
    ]);
    return docs;
  }