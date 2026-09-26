Deno.serve(async () => {
  try {
    const profileUrl = "https://x.com/KittyCandy_VT";

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
              ? "X profile lookup is temporarily unavailable. Please try again."
              : "X follower service returned an invalid response.",
        },
        { status: response.status }
      );
    }

    if (!response.ok) {
      console.error("Pulse X profile request failed:", data);

      return Response.json(
        {
          success: false,
          error:
            response.status === 502
              ? "X profile lookup is temporarily unavailable. Please try again."
              : "Could not retrieve X/Twitter follower information.",
        },
        { status: response.status }
      );
    }

    if (
      data.platform !== "x" ||
      typeof data.followers !== "number"
    ) {
      console.error("Unexpected Pulse response:", data);

      return Response.json(
        {
          success: false,
          error: "Invalid X/Twitter profile response.",
        },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      username: data.handle || "KittyCandy_VT",
      followers: data.followers,
      updated_at:
        data.fetchedAt || new Date().toISOString(),
    });

  } catch (error) {
    console.error("getTwitterFollowers error:", error);

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
