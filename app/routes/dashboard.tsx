import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  try {
    const urls = await db.shortUrl.findMany({
      orderBy: { createdAt: "desc" },
    });
    return json({ urls });
  } catch (error) {
    console.error("Database error:", error);
    return json({
      urls: [],
      error: "Không thể kết nối với database",
    });
  }
};

export default function Dashboard() {
  const { urls, error } = useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();

  const stats = {
    totalUrls: urls.length,
    totalClicks: urls.reduce(
      (sum: number, url: { clicks: number }) => sum + url.clicks,
      0
    ),
    averageClicks: urls.length
      ? Math.round(
          urls.reduce(
            (sum: number, url: { clicks: number }) => sum + url.clicks,
            0
          ) / urls.length
        )
      : 0,
  };

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <div className="rounded-lg bg-red-100 p-4 text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-2xl font-bold">Quản lý URL</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold">Tổng số URL</h3>
          <p className="text-3xl font-bold">{stats.totalUrls}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold">Tổng lượt click</h3>
          <p className="text-3xl font-bold">{stats.totalClicks}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold">Trung bình click/URL</h3>
          <p className="text-3xl font-bold">{stats.averageClicks}</p>
        </div>
      </div>

      {urls.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="border p-3 text-left">URL Gốc</th>
                <th className="border p-3 text-left">URL Rút gọn</th>
                <th className="border p-3 text-left">Lượt click</th>
                <th className="border p-3 text-left">Ngày tạo</th>
                <th className="border p-3 text-left">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {urls.map(
                (url: {
                  id: string;
                  originalUrl: string;
                  shortCode: string;
                  clicks: number;
                  createdAt: Date;
                }) => (
                  <tr key={url.id} className="border-b">
                    <td className="border p-3 max-w-xs truncate">
                      {url.originalUrl}
                    </td>
                    <td className="border p-3">
                      <a
                        href={`/${url.shortCode}`}
                        className="text-blue-500 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`/${url.shortCode}`}
                      </a>
                    </td>
                    <td className="border p-3">{url.clicks}</td>
                    <td className="border p-3">
                      {new Date(url.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="border p-3">
                      <button
                        onClick={() => {
                          if (confirm("Bạn có chắc chắn muốn xóa URL này?")) {
                            const formData = new FormData();
                            formData.append("urlId", url.id);
                            deleteFetcher.submit(formData, {
                              method: "DELETE",
                              action: "/api/delete-url",
                            });
                          }
                        }}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          Chưa có URL nào được tạo
        </div>
      )}
    </div>
  );
}
