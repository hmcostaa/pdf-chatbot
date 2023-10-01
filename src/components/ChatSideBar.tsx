"use client";

import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import { useState } from "react";
import UploadPdf from "./UploadPdf";
import { cn } from "@/lib/utils";
import { MessageCircle, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Props = {
    chats: DrizzleChat[];
    chatId: number;
};

const ChatSideBar = ({ chats, chatId }: Props) => {

    const router = useRouter();
    
    const [loading, isLoading] = useState(false);


    const deleteChat = async (chatId: number | undefined, currentChatId: number) => {
        
        const response = await axios.post('/api/delete-chat', {
            chatId
        });
        if(!response.data.pdfName){
            toast.error("Something went wrong");
            return;
        }
        if(chatId === currentChatId){
            const chatRedirect = chats.find((chat) => chat.id !== currentChatId);
            router.push(`/chat/${chatRedirect?.id}`)
        }
        toast.success("Chat Deleted!")
        return;
    }

    return (
        <div className="w-full h-screen max-h-screen p-4 text-gray-200 bg-gray-900 overflow-auto">
            <UploadPdf buttonStyles="w-full border-dashed border-white border bg-transparent text-gray-200 hover:text-black" />

            <div className="flex flex-col gap-2 mt-4">
                {chats.map((chat) => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                            "bg-blue-600 text-white": chat.id === chatId,
                            "hover:text-white": chat.id !== chatId,
                        })}>
                            <MessageCircle className="mr-2"/>
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                {chat.pdfName}
                            </p>
                            <button onClick={() => deleteChat(chat.id, chatId)}><Trash2 className="ml-2"/></button>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

    )
}

export default ChatSideBar