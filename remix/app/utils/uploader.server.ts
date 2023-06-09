import type { UploadHandler } from "@remix-run/node";
import type { SupabaseClient } from "@supabase/auth-helpers-remix";
import sharp from "sharp";
import type { JpegOptions, PngOptions, ResizeOptions, WebpOptions } from "sharp";
import mime from "mime/lite";

import crypt from "crypto";
import { db } from "~/services/db.server";


export const supabaseUploadHandler = (supabaseClient: SupabaseClient, bucketName: string, mediaBoxId: number): UploadHandler => {
  
  return async (file) => {
    if (file.name !== "files") throw new Error("Files are required");
    if (!file.filename) throw new Error("Filename is required");
    
    //console.log('>>>>', file.filename)
    try {
      const fileBuffer = await asyncIterableToBuffer(file.data)

      const {data:imageBuffer, contentType, filename } = await editImage(
        {data:fileBuffer, contentType:file.contentType, filename:file.filename}, 
        null, // {height: 150, width: 150, fit: sharp.fit.cover}, 
        {contentType: 'image/jpeg', quality: 75}
      );

      //console.log('cropped:', filename)
      
      const folderPath = ((now)=>`/${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}/`)(new Date())
      
      const { data, error } = await supabaseClient.storage.from(bucketName).upload(folderPath+filename, imageBuffer, { contentType: contentType, upsert: true });
      
      if (error) throw new Error(`Supabase Storage Error, ` + error.message);
      if (!data) throw new Error("Supabase Storage Error, no data returned");
      
      const media = await db.media.create({data: {mediaBoxId: mediaBoxId, path: data.path, filename: filename, contentType: contentType}});
      //console.log('media created:', media.id)

      return data.path;

    } catch (e) {
      if (e instanceof Error) throw e;
    }
    
  };
};


const asyncIterableToBuffer = async (iterable: AsyncIterable<Uint8Array>) => {
  const chunks = [];
  for await (const chunk of iterable) { chunks.push(chunk); }
  return Buffer.concat(chunks)
}


const editImage = async ( file: {data:Buffer, contentType:string, filename?:string}, resizeOptions?: ResizeOptions | null, exportOptions?: ({contentType:string} & (JpegOptions | PngOptions | WebpOptions)) | null ) => {
  if(!file.contentType) throw new Error("Content type is required");
  if(!file.contentType.match(/image\/(jpeg|png|webp)/)) throw new Error("Content type is not (jpeg|png|webp)");

  const sharpData = sharp(file.data);

  if(resizeOptions) sharpData.resize(resizeOptions);
  
  const {contentType, ...options} = exportOptions || {};
  if(contentType){
    if(contentType === 'image/jpeg') sharpData.jpeg(options);
    else if(contentType === 'image/png') sharpData.png(options);
    else if(contentType === 'image/webp') sharpData.webp(options);
  }

  const extension = mime.getExtension(exportOptions?.contentType || file.contentType);
  
  //const filename = `${file.filename?.replace(/\.[^/.]+$/, "") || ""+Math.floor(Date.now() / 1000)}.${extension}`
  //file name is uuid hyphen removed
  const filename = `${crypt.randomBytes(16).toString("hex")}.${extension}`;

  return {
    data: await sharpData.toBuffer(),
    contentType: exportOptions?.contentType || file.contentType,
    filename: filename
  };
};