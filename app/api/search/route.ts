import { NextResponse } from "next/server";
import { searchTitles } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim().slice(0, 80);

  if (query.length < 2) {
    return NextResponse.json(
      { results: [] },
      { headers: { "Cache-Control": "public, s-maxage=30" } },
    );
  }

  const data = await searchTitles(query, 1);

  return NextResponse.json(
    { results: data.items.slice(0, 8) },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
