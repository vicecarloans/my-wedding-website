import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export interface RSVPData {
  inviteId: string;
  submissionData: {
    additionalGuests: Array<{
      fullName: string;
      specialDietaryRequirements: string;
    }>;
  };
}

export async function POST(request: Request) {
  try {
    const res = await request.json();

    const data = await kv.set(`${res.inviteId}-rsvp`, res);

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Unable to update RSVP", { err });
  }
}
