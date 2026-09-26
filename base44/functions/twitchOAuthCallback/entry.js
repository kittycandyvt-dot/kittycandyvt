import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function (req) {
  try {
    const url = new URL(req.url);

    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const errorDescription = url.searchParams.get("error_description");

    if (error) {
      return new Response(
        `Twitch authorization failed: ${error}${
          errorDescription ? ` - ${errorDescription}` : ""
        }`,
        {
          status: 400,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        }
      );
    }

    if (!code) {
      return new Response("Missing Twitch authorization code.", {
        status: 400,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const clientId = Deno.env.get("TWITCH_CLIENT_ID");
    const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET");
    const redirectUri = Deno.env.get("TWITCH_REDIRECT_URI");

    if (!clientId) {
      throw new Error("TWITCH_CLIENT_ID is not configured.");
    }

    if (!clientSecret) {
      throw new Error("TWITCH_CLIENT_SECRET is not configured.");
    }

    if (!redirectUri) {
      throw new Error("TWITCH_REDIRECT_URI is not configured.");
    }

    const tokenResponse = await fetch(
      "https://id.twitch.tv/oauth2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Twitch token exchange failed:", tokenData);

      return new Response(
        JSON.stringify({
          success: false,
          error: "Twitch token exchange failed.",
          details: tokenData,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const scopes = tokenData.scope || [];

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Twitch Connected</title>
        </head>
        <body style="
          background:#0d0610;
          color:white;
          font-family:Arial,sans-serif;
          padding:40px;
          text-align:center;
        ">
          <h1>🐱 Twitch Connected!</h1>
          <p>Your Twitch authorization was successful.</p>
          <p>Granted permissions:</p>
          <pre style="
            background:#1a0d20;
            padding:15px;
            border-radius:10px;
            display:inline-block;
          ">${scopes.join("\n")}</pre>
          <p>You can close this window.</p>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  } catch (error) {
    console.error("Twitch OAuth callback error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}