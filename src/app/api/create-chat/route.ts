import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadSupabaseIntoPinecone } from "@/lib/pinecone";
import { getSupabaseUrl } from "@/lib/supabase";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {

    const { userId } = auth()
    if(!userId){
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { file_path, file_name } = body;
        await loadSupabaseIntoPinecone(file_path);
        const chat_id = await db.insert(chats).values({
            pdfKey: file_path,
            pdfName: file_name,
            pdfUrl: getSupabaseUrl(file_path),
            userId,
        }).returning(
            {
                insertedId: chats.id
            }
        )
        return NextResponse.json({
            chat_id: chat_id[0].insertedId,
        },
        { status: 200}
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "internal server error" }, { status: 500 })
    }
}