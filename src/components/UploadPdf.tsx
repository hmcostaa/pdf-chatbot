"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { useDropzone } from 'react-dropzone';
 
import { Button } from "./ui/button";
import { Inbox, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import toast from "react-hot-toast";
import { useState } from "react";
import { uploadToSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const UploadPdf = ({ buttonStyles }: { buttonStyles?: string}) => {

  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ file_path, file_name } : { file_path: string, file_name: string } ) => {
      const response = await axios.post('/api/create-chat', { file_path, file_name })
      return response.data;
    }
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (pdf) => {
      const file = pdf[0]
      if(file.size > 10 * 1024 * 1024){
        toast.error('Files must be smaller than 10MB');
        return;
      }
      try {
        setUploading(true);
        const result = await uploadToSupabase(file);
        console.log("data", result);
        if(!result?.data.path || !result?.file_name){
          toast.error("something went wrong");
          return;
        }
        const { data, file_name } = result;
        mutate({ file_path: data?.path, file_name }, {
          onSuccess: ({ chat_id, doc }) => {
            toast.success("Chat Created!")
            router.push(`/chat/${chat_id}`)
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err)
          }
        })
      } catch (error) {
        console.log(error)
      } finally {
        setUploading(false);
      }
    }
  })

  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button className={buttonStyles}>Upload PDF</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Upload Your PDF</DialogTitle>
            </DialogHeader>
            <div {...getRootProps({
              className: "border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
            })}>
              <input {...getInputProps()} />
              {(uploading || isLoading) ? (
                <>
                  <Loader2 className="h-10 w-10 text-blue-500 animate-spin"/>
                  <p className="mt-2 text-sm text-slate-500">Uploading...</p>
                </>
              ) : (
                <>
                  <Inbox className="w-10 h-10 text-blue-500"/>
                  <p className="mt-2 text-sm text-slate-400">Upload PDF Here</p>
                </>
              )}
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default UploadPdf