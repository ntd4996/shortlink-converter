import { LoaderFunction, redirect } from "@remix-run/node";
import connectDB from "~/utils/mongo.server";
import ShortUrl from "~/models/ShortUrl";

export const loader: LoaderFunction = async ({ params }) => {
  connectDB();
  const { shortCode } = params;

  if (!shortCode) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const shortUrl = await ShortUrl.findOne({ shortCode }).exec();

    if (!shortUrl) {
      throw new Response("Not Found", { status: 404 });
    }

    await ShortUrl.updateOne(
      { _id: shortUrl._id },
      { $inc: { clicks: 1 } }
    ).exec();

    return redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error("Error redirecting:", error);
    throw new Response("Server Error", { status: 500 });
  }
};
