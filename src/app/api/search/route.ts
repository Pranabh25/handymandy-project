import { NextResponse, type NextRequest } from "next/server";
import { searchSuggestions } from "@/server/catalog";

/** Header autocomplete: GET /api/search?q=rose */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.slice(0, 60) ?? "";
  const items = await searchSuggestions(q);
  return NextResponse.json({
    items: items.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      mrp: p.mrp,
      image: p.image,
      categoryName: p.categoryName,
      group: p.group,
    })),
  });
}
