import { json } from "@remix-run/node";
import ShortUrl from "~/models/ShortUrl";

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const shortCode = formData.get("shortCode");

  try {
    await ShortUrl.deleteOne({ shortCode });
    return json({ success: true });
  } catch (error) {
    return json({ success: false, error: (error as Error).message });
  }
};
