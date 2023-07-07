import { environment } from "@/environment";
import { v4 } from "uuid";
import axios from "axios";
import { has } from "@vercel/edge-config";
import { NextResponse } from "next/server";
import { IUserInvite } from "@/models/invite";
import { headers } from "next/headers";

export async function POST(request: Request) {
  try {
    const adminTokenHeader = headers().get("x-admin-token");

    if (adminTokenHeader !== environment.adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newInvite = await request.json();

    // The first 6 digit
    const inviteId = v4().substring(0, 6);

    if (await has(inviteId)) {
      return NextResponse.json(
        { error: "Retry the request for new invite" },
        { status: 409 }
      );
    }

    const userInvite: IUserInvite = {
      id: inviteId,
      email: newInvite.email,
      name: newInvite.name,
      qrCode: `${environment.websiteUrl}/rsvp?code=${inviteId}`,
      travel: newInvite.travel,
      language: newInvite.language,
    };

    const { data } = await axios.patch(
      environment.edgeConfig.apiUrl,
      {
        items: [
          {
            operation: "create",
            key: inviteId,
            value: userInvite,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${environment.edgeConfig.apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ invite: userInvite });
  } catch (err) {
    console.error("Unable to create invite", { err });
  }
}
