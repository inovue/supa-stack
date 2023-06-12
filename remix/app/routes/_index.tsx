import type { V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { Button } from "primereact/button";

import { PrismaClient } from "@prisma/client";
import { useState } from "react";


export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};


export let loader = async () => {
  const prisma = new PrismaClient()
  let items = await prisma.stock.findMany({
    orderBy: [ { id: 'desc', } ],
    include: {
      commentBoard: {
        include: {
          comments: {
            orderBy: [ { id: 'desc', } ],
          },
        },
      }
    },
  });
  await prisma.$disconnect();
  return json(items);
}

export default function Index() {
  const [count, setCount] = useState(0);

  let stocks = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      
      <Button label="Click" icon="pi pi-plus" onClick={e => setCount(count + 1)}></Button>
      <p>Count: {count}</p>
      
      <h2>Stocks</h2>
      {stocks.map((stock) => (
        <div key={stock.id}>
          <h3>{stock.title}</h3>
          <p>{stock.content}</p>
          {stock.commentBoard?.comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      ))}

      <ul>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/blog" rel="noreferrer" >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/tutorials/jokes" rel="noreferrer" >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
