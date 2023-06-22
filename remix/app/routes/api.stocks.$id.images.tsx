import type { ActionFunction } from "@remix-run/node";

import { createServerClient } from "~/utils/supabase.server";

import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
  json
} from "@remix-run/node";
import type { UploadHandler } from "@remix-run/node";

import type { SupabaseClient } from "@supabase/auth-helpers-remix"

import sharp from "sharp";
import type { ResizeOptions } from "sharp";


const supabaseUploadHandler = (supabaseClient: SupabaseClient, bucketName: string): UploadHandler => {
  return async (file) => {
    if (file.name !== "files") throw new Error("Files are required");
    if (!file.filename) throw new Error("Filename is required");
    let contentType = file.contentType;
    let filename = file.filename;
    console.log('>>>>',filename)
    try {
      const stream = await cropImage(file.data);
      console.log('    cropped',filename)
      

      /*
      if (contentType && contentType !== "image/webp") {
        contentType = "image/webp";
        filename = filename.replace(/\.[^/.]+$/, "") + ".webp"; 
      } else if (!contentType) {
        throw new Error("Content type is required")
      }
      */
      
      const { data, error } = await supabaseClient.storage.from(bucketName).upload(filename, stream, {
        contentType: contentType,
        upsert: true,
      });
      if (error) throw new Error(`Supabase Storage Error,` + error.message);
      if (!data) throw new Error("Supabase Storage Error, no data returned");

      return data.path + ' :)';

    } catch (e) {
      if (e instanceof Error) throw e;
    }
    
  };
};




export const cropImage = async ( data: AsyncIterable<Uint8Array>, options?: ResizeOptions ) => {
  const chunks = [];
  for await (const chunk of data) {
    chunks.push(chunk);
  }

  return sharp(Buffer.concat(chunks))
    .resize( options || { height: 150, width: 150, fit: sharp.fit.cover})
    //.toFormat("webp")
    .toBuffer();
};


export const action: ActionFunction = async ({ request, context, params }) => {
  const stockId = params.id;
  
  if (!stockId)  return new Response("Stock ID is required", { status: 400 });

  const response = new Response(null, { status: 200 });
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET ?? 'images';
  
  // ★Required session 
  // const { data: { session } } = await supabaseClient.auth.getSession();
  // if (!session) return redirect('/?index', { headers: response.headers});

  try{
    const supabaseClient = createServerClient({request, response});
    
    const uploadHandler = composeUploadHandlers(
      supabaseUploadHandler(supabaseClient, bucketName), 
      createMemoryUploadHandler()
    );
    
    const formData = await parseMultipartFormData( request, uploadHandler );
    // const imageUrl = formData.get("avatar");

    console.log('============formData=============')
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log('=================================')
    

    return json({ message: "success" });
  
  }catch(e){
    if(e instanceof TypeError){
      return new Response(e.message, { status: 400 });
    }else if(e instanceof Error){
      return new Response(e.message, { status: 500 });
    }else{
      return new Response("Unknown error", { status: 500 });
    }
  }
};


