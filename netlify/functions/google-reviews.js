export default async (request) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  const headers = { "Content-Type": "application/json; charset=utf-8" };
  if (!apiKey || !placeId)
    return new Response(
      JSON.stringify({ error: "Reviews are not configured" }),
      { status: 503, headers },
    );
  try {
    const language =
      new URL(request.url).searchParams.get("lang") === "en" ? "en" : "it";
    const url =
      "https://places.googleapis.com/v1/places/" +
      encodeURIComponent(placeId) +
      "?languageCode=" +
      language;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri",
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error("Google request failed");
    const data = await res.json();
    return new Response(
      JSON.stringify({
        rating: data.rating ?? 0,
        userRatingCount: data.userRatingCount ?? 0,
        googleMapsUri: data.googleMapsUri,
        reviews: (data.reviews || []).map((r) => ({
          author: r.authorAttribution?.displayName || "Google user",
          authorUri: r.authorAttribution?.uri,
          rating: r.rating || 0,
          text: r.text?.text || "",
          publishedAt: r.relativePublishTimeDescription || "",
        })),
      }),
      { headers },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Reviews temporarily unavailable" }),
      { status: 502, headers },
    );
  }
};
