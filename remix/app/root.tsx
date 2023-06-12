import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import primetheme from "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import primecore from "primereact/resources/primereact.min.css"; //core css
import primeicons from "primeicons/primeicons.css"; //icons
import primeflex from "primeflex/primeflex.min.css"; //primeflex

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),

  { rel: "stylesheet", href: primeflex },
  { rel: "stylesheet", href: primetheme },
  { rel: "stylesheet", href: primecore },
  { rel: "stylesheet", href: primeicons }
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
