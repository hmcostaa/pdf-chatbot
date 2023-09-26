"use client";
import { useChat } from "ai/react";
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";


const ChatComponent = ({ chatId }: { chatId: number }) => {

    const { input, handleInputChange, handleSubmit, messages } = useChat({
        api: '/api/chat',
        body: {
            chatId,
        },
    })

    return (
        <div>
            <div>
                <h1>Chat</h1>
            </div>

            <MessageList messages={messages} />

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