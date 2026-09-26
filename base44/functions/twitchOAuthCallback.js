import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function (req) {
  try {
    const url = new URL(req.url);

    // Twitch sends ?code=... after the user authorizes the app
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
      return new Response(
        "Missing Twitch authorization code.",
        {
          status: 400,
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
          },
        }
      );
    }

    // These values come from Base44 Secrets / Environment Variables.
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

    // Exchange the authorization code for Twitch tokens.
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

    // Check that Twitch actually gave us the permissions we requested.
    const scopes = tokenData.scope || [];

    if (!scopes.includes("moderator:read:followers")) {
      return new Response(
        `
        <html>
          <body style="
            background:#0d0610;
            color:white;
            font-family:Arial,sans-serif;
            padding:40px;
            text-align:center;
          ">
            <h1>⚠️ Twitch Permission Missing</h1>
            <p>
              Twitch connected, but the required
              <strong>moderator:read:followers</strong>
              permission was not granted.
            </p>
            <p>Please authorize the KittyCandyVT Twitch application again.</p>
          </body>
        </html>
        `,
        {
          status: 403,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        }
      );
    }

    /*
     * IMPORTANT:
     *
     * We intentionally DO NOT display the access token or refresh token.
     *
     * The next step will securely store these credentials and use them
     * from another Base44 backend function.
     *
     * Never put the tokens into your React code or GitHub.
     */

    console.log("Twitch OAuth successful.");
    console.log("Granted scopes:", scopes);

    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Twitch Connected</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>

        <body style="
          margin:0;
          min-height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#0d0610;
          color:white;
          font-family:Arial,sans-serif;
        ">
          <div style="
            width:min(90%,520px);
            padding:40px;
            border-radius:24px;
            text-align:center;
            background:linear-gradient(145deg,#24102d,#100812);
            border:1px solid rgba(236,72,153,.25);
            box-shadow:0 20px 60px rgba(0,0,0,.5);
          ">
            <div style="font-size:48px;">🐱</div>

            <h1 style="
              margin:15px 0 10px;
              font-size:28px;
            ">
              Twitch Connected!
            </h1>

            <p style="
              color:rgba(255,255,255,.7);
              line-height:1.6;
            ">
              Your KittyCandyVT Twitch account has been successfully
              authorized.
            </p>

            <p style="
              color:#f472b6;
              font-weight:bold;
            ">
              ✓ Follower access granted
            </p>

            <p style="
              color:rgba(255,255,255,.45);
              font-size:13px;
              margin-top:25px;
            ">
              You can safely close this window.
            </p>
          </div>
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
