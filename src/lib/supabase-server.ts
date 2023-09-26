import { supabase } from "./supabase";
import fs from 'fs'

export async function downloadFromSupabase(file_path: string) {

    const { data, error } = await supabase
    .storage
    .from('pdfs')
    .download(file_path)

    if(!data){
        return error;
    }

    const file_name = `/temp/pdf-${Date.now()}.pdf`
    const buffer = Buffer.from( await data.arrayBuffer() );
    fs.writeFileSync(file_name, buffer);

    return file_name;
}