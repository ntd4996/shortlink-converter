import { ActionFunction, json } from "@remix-run/node";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const urlId = formData.get("urlId");

  if (!urlId || typeof urlId !== "string") {
    return json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    await db.shortUrl.delete({
      where: { id: urlId },
    });
    return json({ success: true });
  } catch (error) {
    return json({ error: "Có lỗi xảy ra khi xóa URL" }, { status: 500 });
  }
};
