import type { DataFunctionArgs } from "@remix-run/node";

import { createServerClient } from "~/utils/supabase.server";
import { json } from "@remix-run/node";
import { db } from "~/services/db.server";
import { useLoaderData, useRouteLoaderData, useSubmit } from "@remix-run/react";
import { classNames } from "primereact/utils";

export const loader = async ({ request, context, params }:DataFunctionArgs) => {
  
  const { mediaId } = params;
  if(!mediaId) throw new Response('Missing mediaId', {status: 400} );
  if(isNaN(+mediaId)) throw new Response('Invalid mediaId', {status: 400} );
  
  const media = await db.media.findUnique({
    where: { id: +mediaId },
    select: { id: true, path: true, filename: true, caption: true }
  });

  if (!media) throw new Response(`mediaId (${mediaId}) doesn't exist`, { status: 404 });

  const response = new Response(null, { status: 200 });
  const supabaseClient = createServerClient({request, response});
  const mediaWithPublicUrl = {
    ...media, 
    publicUrl: supabaseClient.storage.from('images').getPublicUrl(media.path).data.publicUrl
  };

  return json(mediaWithPublicUrl);
};

export const action = async ({ request, context, params }:DataFunctionArgs) => {
  const method = request.method.toLowerCase();
  if(method === 'delete'){
    const {mediaId} = params;
    if (!mediaId)  throw new Response("Media ID is required", { status: 400 });
    if (isNaN(+mediaId)) throw new Response("Media ID is not number", { status: 400 });

    try{
      const media = await db.media.findUnique({where: {id:+mediaId}, select:{id:true, path:true}})
      if(!media) throw new Response(`Media (${mediaId}) not found`, { status: 400 });

      const response = new Response(null, { status: 200 });
      const supabaseClient = createServerClient({request, response});
      const bucketName = process.env.SUPABASE_STORAGE_BUCKET ?? 'images';

      const {data:removeResult, error} = await supabaseClient.storage.from(bucketName).remove([media.path]);
      if(error) throw new Response(error.message, { status: 500 });

      return json({ files: removeResult });
    }catch(e){
      if(e instanceof TypeError) throw new Response(e.message, { status: 400 });
      else if(e instanceof Error) throw new Response(e.message, { status: 500 });
      else throw new Response("Unknown error", { status: 500 });
    }
  
  }
  
};



export default function StockEditImage() {
  const media = useLoaderData<typeof loader>();
  
  return (
    <div style={{height:'60vh', backgroundColor:'black'}} className={classNames(['w-full', 'relative', 'py-3'])}>
      <img src={media.publicUrl} alt={media.filename} style={{objectFit:"contain"}} className={classNames(['w-full', 'h-full'])} />
    </div>
  );
}
