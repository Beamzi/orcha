import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = await request.json();
  const { searchQuery } = response;
  const searchRequest = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
      searchQuery
    )}&result_filter=web&count=10`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": process.env.BRAVE_API_KEY!,
      },
    }
  );
  const searchResponse = await searchRequest.json();
  console.log({searchResponse});

  return NextResponse.json({ searchResponse });
}
