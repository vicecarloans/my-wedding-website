import { get } from "@vercel/edge-config";
import { NextRequest, NextResponse } from "next/server";

export interface IGetParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: IGetParams }
) {
  try {
    const invite = await get(params.id);
    const inviteSubmission = await get(`${params.id}-rsvp`);

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }
    return NextResponse.json({ invite, inviteSubmission });
  } catch (err) {
    console.error("Unable to validate", { err });
  }
}
