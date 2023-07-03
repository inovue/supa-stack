import type { DataFunctionArgs } from "@remix-run/node";

import { createServerClient } from "~/utils/supabase.server";
import { json, redirect } from "@remix-run/node";
import { db } from "~/services/db.server";
import { Form, useLoaderData } from "@remix-run/react";
import { classNames } from "primereact/utils";


export const loader = async ({ request, context, params }:DataFunctionArgs) => {
  //const {mediaBox:{medias}} = await (await parentLoader({request, context, params})).json();
  //console.log("medias", medias);

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

      const {error} = await supabaseClient.storage.from(bucketName).remove([media.path]);
      if(error) throw new Response(error.message, { status: 500 });

      await db.media.delete({where:{id:+mediaId}});
      
      return redirect('../')
    }catch(e){
      if(e instanceof TypeError) throw new Response(e.message, { status: 400 });
      else if(e instanceof Error) throw new Response(e.message, { status: 500 });
      else throw new Response("Unknown error", { status: 500 });
    }
  
  }else{
    throw new Response("Method not allowed", { status: 405 });
  }
  
};



export default function StockEditImage() {
  const media = useLoaderData<typeof loader>();
  //const data = useRouteLoaderData('routes/stocks_.$id.edit.images') as typeof parentLoader;
  
  return (
    <div style={{height:'60vh', backgroundColor:'black'}} className={classNames(['w-full', 'relative', 'py-3'])}>
      <img src={media.publicUrl} alt={media.filename} style={{objectFit:"contain"}} className={classNames(['w-full', 'h-full'])} />
      <Form method="delete" className={classNames(['absolute', 'top-0', 'right-0', 'p-3', 'z-1'])}>
        <button type="submit" className={classNames(['p-button', 'p-button-danger'])}>Delete</button>
      </Form>
    </div>
  );
}
