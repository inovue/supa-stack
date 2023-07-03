import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import {Avatar} from 'primereact/avatar';
import {AvatarGroup} from 'primereact/avatargroup';
import { json } from "@remix-run/node";
import type { DataFunctionArgs } from '@remix-run/node';
import { db } from "~/services/db.server";
import { createServerClient } from "~/utils/supabase.server";


export const loader = async ({ request, context, params }:DataFunctionArgs) => {
  const id = params.id;
  if(!id) throw new Response('Missing id', {status: 400} );
  if(isNaN(+id)) throw new Response('Invalid id', {status: 400} );
  
  const stock = await db.stock.findUnique({
    where: { id: +id },
    select: { 
      id: true, 
      title: true, 
      mediaBox:{
        select:{
          _count: {
            select: { medias: true }
          },
          medias:{
            select:{ id:true, path:true },
            where:{ contentType: {startsWith: 'image/'} },
            take: 1
          }
        }
      }
    }
  });

  if (!stock) throw new Response(`stock ${id} doesn't exist`, { status: 404 });

  const response = new Response(null, { status: 200 });
  const supabaseClient = createServerClient({request, response});
  const modifiedStock = {
    ...stock, 
    mediaBox: {
      ...stock.mediaBox,
      medias: stock?.mediaBox?.medias.map((media) => ({
        ...media,
        publicUrl: supabaseClient.storage.from('images').getPublicUrl(media.path).data.publicUrl
      }))
    }
  };

  return json(modifiedStock);
}

export default function Stock() {
  const stock = useLoaderData<typeof loader>();
  const firstMediaId = stock?.mediaBox?.medias?.[0]?.id ?? '';
  const firstMediaUrl = stock?.mediaBox?.medias?.[0]?.publicUrl ?? '';
  const mediaCount = stock?.mediaBox?._count?.medias ?? 0;
  return (
    <div>
      <nav className={classNames(['flex', 'align-items-center', 'mx-2', 'my-1', 'gap-2'])}>
        <Link to={`images/${firstMediaId}`}>
          <Button text className={classNames(['p-0'])} >
            {firstMediaUrl ?
              <AvatarGroup>
                <Avatar className={classNames(['p-overlay-badge'])} image={firstMediaUrl} size="large" shape="circle" />
                {1 < mediaCount &&
                  <Avatar label={`+${mediaCount-1}`} shape="circle" size="large" className={classNames(['bg-primary', 'text-white'])} style={{ fontSize:'1rem' }} />
                }
              </AvatarGroup> :
              <Avatar icon="pi pi-question" size="large" className={classNames(['text-gray-900'])} shape="circle" />

            }
          </Button>
        </Link>
        <Link to={``}>
          <Button label={stock.title||'Untitled'} text />
        </Link>
        
        <div className={classNames(['flex-1'])}/>
        <Link to="/stocks">
          <Button text rounded icon="pi pi-times"  aria-label="Back" />
        </Link>
      </nav>
      <Outlet />
    </div>
  );
}
