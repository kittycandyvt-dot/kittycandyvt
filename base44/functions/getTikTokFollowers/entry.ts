Deno.serve(async () => {
  try {
    const profileUrl = "https://www.tiktok.com/@kittycandyvt";

    const response = await fetch(
      `https://pulse.walls.sh/profile?url=${encodeURIComponent(profileUrl)}`
    );

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Pulse returned a non-JSON response:",
        response.status,
        responseText
      );

      return Response.json(
        {
          success: false,
          error:
            response.status === 502
              ? "TikTok profile lookup is temporarily unavailable. Please try again."
              : "TikTok follower service returned an invalid response.",
        },
        { status: response.status }
      );
    }

    if (!response.ok) {
      console.error("Pulse TikTok profile request failed:", data);

      return Response.json(
        {
          success: false,
          error:
            response.status === 502
              ? "TikTok profile lookup is temporarily unavailable. Please try again."
              : "Could not retrieve TikTok follower information.",
        },
        { status: response.status }
      );
    }

    if (
      data.platform !== "tiktok" ||
      typeof data.followers !== "number"
    ) {
      console.error("Unexpected Pulse response:", data);

      return Response.json(
        {
          success: false,
          error: "Invalid TikTok profile response.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      username: data.handle || "kittycandyvt",
      followers: data.followers,
      updated_at:
        data.fetchedAt || new Date().toISOString(),
    });

  } catch (error) {
    console.error("getTikTokFollowers error:", error);

    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
});
