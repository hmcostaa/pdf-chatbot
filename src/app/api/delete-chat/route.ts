import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const POST = async (req: Request) => {
    const { chatId } = await req.json();
    const deletedPdfs: { pdfName: string }[]= await db.delete(chats).where(eq(chats.id, chatId)).returning({ pdfName: chats.pdfName })
    return NextResponse.json(deletedPdfs[0]);
}