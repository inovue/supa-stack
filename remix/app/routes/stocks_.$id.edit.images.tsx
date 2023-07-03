import type { DataFunctionArgs } from "@remix-run/node";

import { createServerClient } from "~/utils/supabase.server";
import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { db } from "~/services/db.server";
import { supabaseUploadHandler } from "~/utils/uploader.server";
import { Link, Outlet, useLoaderData, useParams } from "@remix-run/react";
import MediaUploadButton from "~/components/form/features/MediaUploadButton";
import { classNames } from "primereact/utils";
import { ImageCard } from "~/components/form/features/ImageCard";

export const loader = async ({ request, context, params }:DataFunctionArgs) => {
  console.log("medias loader");
  const stockId = params.id;
  if(!stockId) throw new Response('Missing id', {status: 400} );
  if(isNaN(+stockId)) throw new Response('Invalid id', {status: 400} );
  
  const stock = await db.stock.findUnique({
    where: { id: +stockId },
    select: { id: true, 
      mediaBox:{
        select:{
          medias:{
            select:{ id:true, path:true, contentType:true, filename:true },
            where:{ contentType: {startsWith: 'image/'} }
          }
        }
      }
    }
  });

  if (!stock) throw new Response(`stock ${stockId} doesn't exist`, { status: 404 });

  const response = new Response(null, { status: 200 });
  const supabaseClient = createServerClient({request, response});
  const modifiedStock = {
    ...stock, 
    mediaBox: {
      medias: stock?.mediaBox?.medias.map((media) => ({
        ...media,
        publicUrl: supabaseClient.storage.from('images').getPublicUrl(media.path).data.publicUrl
      }))
    }
  };

  // const firstMediaId = modifiedStock?.mediaBox?.medias?.[0]?.id;
  // const responseInit = !firstMediaId ? {status: 200} : {status: 302, headers: { Location: `/stocks/${params.id}/edit/images/${firstMediaId}`}};
  
  return json(modifiedStock);
};

export const action = async ({ request, context, params }:DataFunctionArgs) => {

  const stockId = params.id;
  
  if (!stockId)  return new Response("Stock ID is required", { status: 400 });
  if (isNaN(+stockId)) return new Response("Stock ID is not number", { status: 400 });

  const response = new Response(null, { status: 200 });
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET ?? 'images';
  
  // ★Required session 
  // const { data: { session } } = await supabaseClient.auth.getSession();
  // if (!session) return redirect('/?index', { headers: response.headers});

  try{
    const supabaseClient = createServerClient({request, response});
    
    const stock = await db.stock.findUnique({where: {id: +stockId}, select: {id: true, mediaBoxId: true}})
    if(!stock) return new Response(`Stock [${stockId}] not found`, { status: 404 });

    let mediaBoxId = stock.mediaBoxId;
    if(!mediaBoxId){
      const newMediaBox = await db.mediaBox.create({data: {}});
      mediaBoxId = newMediaBox.id;
      await db.stock.update({where: {id: +stockId}, data: {mediaBoxId: mediaBoxId}});
    } 

    const uploadHandler = composeUploadHandlers(
      supabaseUploadHandler(supabaseClient, bucketName, mediaBoxId), 
      createMemoryUploadHandler()
    );

    // const formData = await request.formData();
    const formData = await parseMultipartFormData(request, uploadHandler);
    
    console.log('============formData=============')
    for (const [key, value] of formData.entries()) { console.log(`${key}: ${value}`); }
    console.log('=================================')
    
    //return redirect(`/stocks/${stockId}`, { headers: response.headers});
    return json({ message: "success" });
  
  }catch(e){
    if(e instanceof TypeError) return new Response(e.message, { status: 400 });
    else if(e instanceof Error) return new Response(e.message, { status: 500 });
    else return new Response("Unknown error", { status: 500 });
  }
};



export default function StockEditImage() {
  const {mediaId} = useParams()
  const {mediaBox:{medias}} = useLoaderData<typeof loader>();
  const colsClassNames = classNames(['col-6', 'sm:col-4', 'lg:col-3', 'xl:col-2'])
  const isActive = (id: number) => !!mediaId && +mediaId===id
  const mediaCount =  medias?.length ?? 0;

  const getMediaId = (offset:number=0) => {
    if(!Array.isArray(medias)) return null;
    const index = mediaId ? medias?.findIndex(media => media.id === +mediaId) ?? -1 : -1;
    try{
      return medias[index+offset]?.id ?? null;
    }catch(e){
      return null;
    }
  }
  const prevMediaId = getMediaId(-1);
  const nextMediaId = getMediaId(1);
  
  return (
    <>
      { mediaId && 0 < mediaCount &&
        <div style={{height:'60vh', backgroundColor:'black'}} className={classNames(['w-full', 'relative', 'py-3', 'mb-4'])}>
          <Outlet />
          { 1 < mediaCount &&
            <div className={classNames(['flex', 'h-full', 'absolute', 'top-0', 'w-full', 'text-white', 'align-items-center'])}>
              {prevMediaId && 
                <Link to={`${prevMediaId}`}>
                  <i className={classNames(['pi','pi-arrow-left','px-3'])} />
                </Link>
              }
              <div className={classNames(['flex-1'])} />
              {nextMediaId &&
                <Link to={`${nextMediaId}`}>
                  <i className={classNames(['pi','pi-arrow-right','px-3'])} />
                </Link>
              }
            </div>
          }
        </div>
      }
      <ul className={classNames(['grid', 'm-2'])}>
        <li className={colsClassNames} >
          <MediaUploadButton id="files" name="files" accept="image/*" multiple />
        </li>
        {medias && medias.map(media => (
          <li key={media.id} className={colsClassNames} >
            <Link to={`${media.id}`}>
              <ImageCard src={media.publicUrl} alt={media.filename} active={isActive(media.id)}/>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
