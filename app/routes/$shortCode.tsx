import { LoaderFunction, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const { shortCode } = params;

  if (!shortCode) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const shortUrl = await db.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!shortUrl) {
      throw new Response("Not Found", { status: 404 });
    }

    // Tăng số lượt click
    await db.shortUrl.update({
      where: { id: shortUrl.id },
      data: { clicks: { increment: 1 } },
    });

    return redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    throw new Response("Server Error", { status: 500 });
  }
};
