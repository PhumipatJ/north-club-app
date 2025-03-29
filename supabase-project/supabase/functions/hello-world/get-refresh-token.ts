// get-refresh-token.ts
// รันด้วย Deno: deno run --allow-net --allow-read get-refresh-token.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { open } from "https://deno.land/x/opener@v1.0.1/mod.ts";

// ใส่ค่า Client ID และ Client Secret ที่ได้จาก Google Cloud Console
const CLIENT_ID = "207717173074-i1gp5qivrqj0f6jbd3i4q6pa0v7co5ui.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8000/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

// สร้าง URL สำหรับการ authorize
const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
authUrl.searchParams.set("client_id", CLIENT_ID);
authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authUrl.searchParams.set("response_type", "code");
authUrl.searchParams.set("scope", SCOPES.join(" "));
authUrl.searchParams.set("access_type", "offline");
authUrl.searchParams.set("prompt", "consent");

console.log("Opening browser for authorization...");
await open(authUrl.toString());

// สร้าง server เพื่อรับ callback
let codePromiseResolve: (code: string) => void;
const codePromise = new Promise<string>((resolve) => {
  codePromiseResolve = resolve;
});

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  if (url.pathname === "/oauth2callback") {
    const code = url.searchParams.get("code");
    if (code) {
      codePromiseResolve(code);
      return new Response("Authorization successful! You can close this window.", {
        headers: { "Content-Type": "text/html" },
      });
    }
    return new Response("No authorization code found", { status: 400 });
  }
  return new Response("Not found", { status: 404 });
};

const server = serve(handler, { port: 8000 });
console.log("Waiting for authorization...");

// รอรับ authorization code
const code = await codePromise;
console.log("Authorization code received!");

// แลกเปลี่ยน code เพื่อรับ tokens
const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }),
});

const tokenData = await tokenResponse.json();
console.log("Refresh token received:", tokenData.refresh_token);
console.log("Access token received:", tokenData.access_token);

// ปิด server
server.close();
console.log("Server closed");