Deno.serve(async () => {
  try {
    const profileUrl = "https://x.com/KittyCandy_VT";
    const pulseUrl = `https://pulse.walls.sh/profile?url=${encodeURIComponent(profileUrl)}`;

    let lastStatus = 500;
    let lastResponseText = "";

    // Try up to 3 times in case Pulse temporarily returns a 502
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(pulseUrl);
        const responseText = await response.text();

        lastStatus = response.status;
        lastResponseText = responseText;

        let data;

        try {
          data = JSON.parse(responseText);
        } catch {
          console.error(
            `Pulse attempt ${attempt} returned non-JSON:`,
            response.status,
            responseText
          );

          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }

          break;
        }

        if (
          response.ok &&
          data.platform === "x" &&
          typeof data.followers === "number"
        ) {
          return Response.json({
            success: true,
            username: data.handle || "KittyCandy_VT",
            followers: data.followers,
            updated_at:
              data.fetchedAt || new Date().toISOString(),
          });
        }

        console.error(
          `Pulse attempt ${attempt} failed:`,
          response.status,
          data
        );

        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
      } catch (error) {
        console.error(`Pulse attempt ${attempt} error:`, error);

        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
      }
    }

    return Response.json(
      {
        success: false,
        error:
          lastStatus === 502
            ? "X profile lookup is temporarily unavailable. Please try again."
            : "Could not retrieve X/Twitter follower information.",
      },
      { status: lastStatus }
    );

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
