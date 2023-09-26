import UploadPdf from "@/components/UploadPdf";
import { ModeToggle } from "@/components/themeToggle";
import { Button } from "@/components/ui/button";
import { UserButton, auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {

  const { userId } = auth();
  const isAuth = !!userId;

  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-tl from-gray-700 via-gray-900 to-black">
      <div className="min-h-screen w-4/5 max-w-screen-2xl flex flex-col">
        <div className="flex justify-between mt-10">
          <Image 
            src="/ai-file.png"
            width={65}
            height={65}
            alt="Ai logo"
          />
          <div className="flex gap-x-6 items-center">
            <ModeToggle />
            <UserButton afterSignOutUrl="/"/>
          </div>
        </div>
        <div className="w-full flex justify-between pt-28">
          <div className="flex flex-col text-white">
            <h1 className="text-5xl font-semibold">Welcome to ChatPDFs</h1>
            <p className="mt-2 font-semibold">Upload your files and get your answers</p>
            <div className="mt-5">
              {isAuth ? (
                <div className="flex gap-x-10">
                  <Button>Go to Chats</Button>
                  <UploadPdf />
                </div>
              ) : (
              <Link href="/sign-in">
                <Button>
                  Login
                </Button>
              </Link>
              )}
          </div>
          </div>
          <div>
            <Image 
              src="/bot.png"
              width={395}
              height={395}
              alt="bot"
            />
          </div>
        </div>
        <div className="w-full flex justify-between gap-x-12 pt-12">
          <div className="flex flex-col gap-y-5 max-w-xs">
            <div className="flex items-end gap-x-5">
              <Image 
                src="/file.png"
                width={60}
                height={60}
                alt="file image"
              />
              <h2 className="text-2xl font-semibold text-white">Upload Your Files</h2>
            </div>
            <div>
              <p className="text-white font-semibold">Upload all the files that you want to interact with</p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 max-w-xs">
            <div className="flex items-end gap-x-5">
              <Image 
                src="/database.png"
                width={60}
                height={60}
                alt="file image"
              />
              <h2 className="text-2xl font-semibold text-white">Browse All The Available Files</h2>
            </div>
            <div>
              <p className="text-white font-semibold">
                Don't have the files that you want to interact with? Don't worry because someone might have uploaded it for you.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 max-w-xs">
            <div className="flex items-end gap-x-5">
              <Image 
                src="/live-chat.png"
                width={60}
                height={60}
                alt="file image"
              />
              <h2 className="text-2xl font-semibold text-white">Chat With Your Files</h2>
            </div>
            <div>
              <p className="text-white font-semibold">Select the files you want and you're ready!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
