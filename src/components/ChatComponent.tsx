"use client";
import { useChat } from "ai/react";
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";


const ChatComponent = ({ chatId }: { chatId: number }) => {

    const { data, isLoading } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await axios.post<Message[]>("/api/get-messages", {
              chatId,
            });
            return response.data;
        },
    })

    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: '/api/chat',
        body: {
            chatId,
        },
        initialMessages: data || [],
    })

    return (
        <div>
            <div>
                <h1>Chat</h1>
            </div>

            <MessageList messages={messages} isLoading={isLoading} />

            <form onSubmit={handleSubmit}>
                <Input value={input} onChange={handleInputChange} placeholder="Write your question..." className="w-full" />
                <Button>
                    <Send className="w-4 h-4"/>
                </Button>
            </form>
        </div>
    )
}

export default ChatComponent