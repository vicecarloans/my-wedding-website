import { environment } from "@/environment";
import { has } from "@vercel/edge-config";
import axios from "axios";
import { NextResponse } from "next/server";

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

    const submissionExists = await has(res.inviteId);

    const { data } = await axios.patch(
      environment.edgeConfig.apiUrl,
      {
        items: [
          {
            operation: submissionExists ? "update" : "create",
            key: `${res.inviteId}-rsvp`,
            value: res.submissionData,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${environment.edgeConfig.apiToken}`,
        },
      }
    );

    return NextResponse.json({ status: data.status });
  } catch (err) {
    console.error("Unable to update RSVP", { err });
  }
}
