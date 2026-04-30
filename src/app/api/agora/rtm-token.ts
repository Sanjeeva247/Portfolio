import { NextRequest, NextResponse } from 'next/server';
import Agora from "agora-access-token";

const APP_ID = process.env.AGORA_APP_ID!;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const roomId = searchParams.get("roomId");

    if (!userId || !roomId) {
      return NextResponse.json({ error: "Missing userId or roomId" }, { status: 400 });
    }

    // Agora RTM Token
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);

    const token = Agora.RtmTokenBuilder.buildToken(
      APP_ID,
      APP_CERTIFICATE,
      userId,
      Agora.RtmRole.Rtm_User,
      currentTimestamp + expirationTimeInSeconds
    );

    return NextResponse.json({ token });
  } catch (err) {
    console.error("RTM Token API error:", err);
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 });
  }
}
