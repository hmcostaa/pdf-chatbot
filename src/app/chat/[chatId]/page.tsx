import ChatComponent from '@/components/ChatComponent'
import ChatSideBar from '@/components/ChatSideBar'
import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'

type Props = {
    params: {
        chatId: string
    }
}

const ChatPage = async ({params: { chatId }}: Props) => {

    const { userId } = auth()
    if(!userId){
        return redirect('/sign-in')
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    if(!_chats){
        return redirect('/')
    }
    if(!_chats.find((chat) => chat.id === parseInt(chatId))){
        return redirect('/')
    }
    
    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
    
    return (
        <div className='flex max-h-screen'>
            <div className='flex w-full max-h-screen'>
                <div className='flex-auto w-1/4 max-h-screen bg-red-50'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
                </div>
                <div className='flex-auto w-3/4 max-h-screen'>
                    <ChatComponent chatId={parseInt(chatId)} />
                </div>
            </div>
        </div>
    )
}

export default ChatPage