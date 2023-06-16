import type { ActionFunction } from "@remix-run/node";
import {createServerClient} from "~/utils/supabase.server";
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

import type { UploadHandler } from "@remix-run/node";
import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { writeAsyncIterableToWritable } from "@remix-run/node";
import type { UploadApiOptions, UploadApiResponse, UploadStream } from "cloudinary";
import cloudinary from "cloudinary";

async function uploadImageToCloudinary( data: AsyncIterable<Uint8Array> ) {
  const uploadPromise = new Promise<UploadApiResponse>(
    async (resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream( { folder: "remix", },
          (error, result) => { if (error) { reject(error); return; } resolve(result); }
        );
      await writeAsyncIterableToWritable( data, uploadStream );
    }
  );

  return uploadPromise;
}

export const action: ActionFunction = async ({ request, context, params }) => {
  const stockId = params.id;
  if (!stockId)  return new Response("Stock ID is required", { status: 400 });
  
  const uploadHandler = unstable_composeUploadHandlers(
    async ({ name, contentType, data, filename }) => {
      if (name !== "image") return new Response("Images are required", { status: 400 });
      
      const uploadedImage = await uploadImageToCloudinary( data );
      return uploadedImage.secure_url;
    },
    // fallback to memory for everything else
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData( request, uploadHandler );

  const imageUrl = formData.get("avatar");

  // because our uploadHandler returns a string, that's what the imageUrl will be.
  // ... etc
};
