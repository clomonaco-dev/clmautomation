export default async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return new Response(
      JSON.stringify({ error: "Variabili mancanti" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,rating,userRatingCount,reviews,googleMapsUri`;

    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({
          error: data.error?.message || "Errore Google Places",
          details: data
        }),
        {
          status: res.status,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    const formattedData = {
      rating: data.rating ?? 0,
      userRatingCount: data.userRatingCount ?? 0,
      googleMapsUri: data.googleMapsUri || "#",
      reviews: (data.reviews || []).map((review) => ({
        author: review.authorAttribution?.displayName || "Cliente",
        rating: review.rating || 0,
        text: review.text?.text || "",
        publishedAt: review.relativePublishTimeDescription || ""
      }))
    };

    return new Response(JSON.stringify(formattedData), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};