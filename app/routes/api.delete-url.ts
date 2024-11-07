import { json, type ActionFunction } from "@remix-run/node";
import connectDB from "~/utils/mongo.server";
import ShortUrl from "~/models/ShortUrl";
import { Types } from "mongoose";

export const action: ActionFunction = async ({ request }) => {
  await connectDB();

  const url = new URL(request.url);
  const urlId = url.searchParams.get("urlId");

  console.log("Received urlId:", urlId);

  if (!urlId) {
    return json(
      { success: false, message: "Không tìm thấy ID URL" },
      { status: 400 }
    );
  }

  if (!Types.ObjectId.isValid(urlId)) {
    return json(
      { success: false, message: "ID URL không hợp lệ" },
      { status: 400 }
    );
  }

  try {
    const result = await ShortUrl.findByIdAndDelete(urlId);
    if (!result) {
      return json(
        { success: false, message: "Không tìm thấy URL" },
        { status: 404 }
      );
    }
    return json({ success: true });
  } catch (error) {
    console.error("Lỗi khi xóa URL:", error);
    return json(
      { success: false, message: "Lỗi khi xóa URL" },
      { status: 500 }
    );
  }
};
