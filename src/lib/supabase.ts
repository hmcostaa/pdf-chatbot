import { SupabaseClient, createClient } from '@supabase/supabase-js'


export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export async function uploadToSupabase(file: File) {

    const file_name = file.name;
    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

    const { data, error } = await supabase
    .storage
    .from("pdfs")
    .upload(file_key, file, {
        cacheControl: '3600',
        upsert: false
    })
    if(error || !file_name){
        console.log(error);
        return;
    }
    else{
        return { data, file_name };
    }
}

export function getSupabaseUrl(file_path: string) {
    const { data } = supabase
    .storage
    .from('pdfs')
    .getPublicUrl(file_path)

    return data.publicUrl;
}

