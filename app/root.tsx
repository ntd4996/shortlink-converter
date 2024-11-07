import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import Navigation from "~/components/Navigation";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export default function App() {
  return (
    <html lang="vi" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>URL Shortener by DatNT</title>
      </head>
      <body className="h-full" suppressHydrationWarning={true}>
        <div className="min-h-full">
          <Navigation />
          <main className="pt-16">
            <Outlet />
          </main>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="vi" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full" suppressHydrationWarning={true}>
        <div className="flex h-screen items-center justify-center">
          <div className="rounded-lg bg-red-100 p-6 text-red-700">
            <h1 className="text-lg font-bold">Có lỗi xảy ra!</h1>
            <p>{error?.message}</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
