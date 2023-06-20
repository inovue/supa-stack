import type { ActionFunction } from "@remix-run/node";

import { createServerClient } from "~/utils/supabase.server";

import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
  redirect,
} from "@remix-run/node";
import type { UploadHandler } from "@remix-run/node";

import type { SupabaseClient } from "@supabase/auth-helpers-remix"


const supabaseUploadHandler = (supabaseClient:SupabaseClient, bucketName:string):UploadHandler => {
  return async (file) => {
    
    if (file.name !== "files") throw new Error("Files are required");
    const stream = asyncIterableToStream(file.data);
    const filepath = `${file.filename}`;
    if(!stream) throw new Error("Stream is required");
    
    try{
      const { data, error } = await supabaseClient.storage.from(bucketName).upload(filepath, stream, {
        contentType: file.contentType,
        upsert: true,
      });
      if (error) throw new Error(`Supabase Storage Error,`+error.message);
    }catch(e){
      if(e instanceof Error) throw e;
    }
    return filepath;
  }
}



const asyncIterableToStream = (asyncIterable: AsyncIterable<Uint8Array>) => {
  console.log("inside stream");
  try {
    return new ReadableStream({
      async pull(controller) {
        for await (const entry of asyncIterable) {
          controller.enqueue(entry);
        }
        controller.close();
      },
    });
  } catch (e) {
    console.log(e);
    if(e instanceof Error) throw e;
  }
};

export const action: ActionFunction = async ({ request, context, params }) => {
  const stockId = params.id;
  console.log("stockId", stockId);
  if (!stockId)  return new Response("Stock ID is required", { status: 400 });

  const response = new Response(null, { status: 200 });
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET ?? 'images';

  // ★Required session 
  // const { data: { session } } = await supabaseClient.auth.getSession();
  // if (!session) return redirect('/?index', { headers: response.headers});

  try{
    const supabaseClient = createServerClient({request, response});
    const { data: { user }, } = await supabaseClient.auth.getUser()
    console.log("user", user);

    const uploadHandler = composeUploadHandlers(
      supabaseUploadHandler(supabaseClient, bucketName), 
      createMemoryUploadHandler()
    );
    console.log("uploadHandler", uploadHandler);
    const formData = await parseMultipartFormData( request, uploadHandler );
    //const imageUrl = formData.get("avatar");
    // log all formdata
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
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



/*
export const action: ActionFunction = async ({ request, context, params }) => {
  const stockId = params.id;

  if (!stockId)  return new Response("Stock ID is required", { status: 400 });
  
  const formData = await request.formData();
  const images = formData.get("images");
  
  if (!images) return new Response("Images are required", { status: 400 });
  
  const { data, error } = await supabase.storage
    .from("stocks")
    .upload(`stocks/${stockId}`, images as File);
  
}
*/