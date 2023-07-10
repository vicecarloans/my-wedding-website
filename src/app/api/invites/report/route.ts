import { environment } from "@/environment";
import { IUserInvite, IUserInviteSubmission } from "@/models/invite";
import { Parser } from "@json2csv/plainjs";
import { get } from "@vercel/edge-config";
import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const adminTokenHeader = headers().get("x-admin-token");

    if (adminTokenHeader !== environment.adminToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [_, allSubmissionKeys] = await kv.scan(0, {
      match: "*-rsvp",
    });

    const allSubmissions = await Promise.all(
      allSubmissionKeys.map(
        async (key) => await kv.get<IUserInviteSubmission>(key)
      )
    );

    const allInvites = await Promise.all(
      allSubmissionKeys.map(
        async (key) => await get<IUserInvite>(key.replace("-rsvp", ""))
      )
    );

    const parser = new Parser({
      fields: [
        { label: "Invite ID", value: "inviteId" },
        { label: "Name", value: "name" },
        { label: "Travel Info", value: "travelInfo" },
        { label: "Is Going", value: "isGoing" },
        { label: "Additional Guest Name", value: "additionalGuestName" },
        { label: "Needs Pickup at Airport", value: "needsPickup" },
        { label: "Flight Number", value: "flightNumber" },
        { label: "Arrival Date Time", value: "arrivalDateTime" },
        { label: "Arrival Date Time TZ", value: "arrivalDateTimeTZ" },
        { label: "Reimburse Account Number", value: "reimburseAccountNumber" },
        {
          label: "Reimburse Account Holder Name",
          value: "reimburseAccountHolderName",
        },
        { label: "Reimburse Bank Name", value: "reimburseBankName" },
        { label: "Reimburse Amount", value: "reimburseAmount" },
        { label: "Needs Transport to Venue", value: "needsTransport" },
        { label: "Stay From", value: "stayFrom" },
        { label: "Stay To", value: "stayTo" },
        { label: "Proposed Stay To", value: "proposedStayTo" },
        { label: "Wishes", value: "wishes" },
      ],
    });

    const csv = parser.parse(
      allSubmissions.map((submission) => {
        const invite = allInvites.find((i) => i?.id === submission?.inviteId);

        return {
          inviteId: submission?.inviteId,
          name: invite?.name,
          travelInfo: invite?.travel,
          isGoing: submission?.isGoing ?? "N/A",
          additionalGuestName: submission?.additionalGuests?.[0]?.name ?? "N/A",
          needsPickup: submission?.flight?.needsPickup ?? "N/A",
          flightNumber: submission?.flight?.flightNumber ?? "N/A",
          arrivalDateTime: submission?.flight?.arrivalDateTime ?? "N/A",
          arrivalDateTimeTZ: submission?.flight?.arrivalDateTimeTZ ?? "N/A",
          reimburseAccountNumber:
            submission?.flight?.reimburseAccountNumber ?? "N/A",
          reimburseAccountHolderName:
            submission?.flight?.reimburseAccountHolderName ?? "N/A",
          reimburseBankName: submission?.flight?.reimburseBankName ?? "N/A",
          reimburseAmount: submission?.flight?.reimburseAmount ?? "N/A",
          needsTransport: submission?.hotel?.needsTransport ?? "N/A",
          stayFrom: submission?.hotel?.stayFrom ?? "N/A",
          stayTo: submission?.hotel?.stayTo ?? "N/A",
          proposedStayTo: submission?.hotel?.proposedStayTo ?? "N/A",
          wishes: submission?.wishes ?? "N/A",
        };
      })
    );

    const response = new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
      },
    });

    return response;
  } catch (err) {
    console.error("Unable to build report", { err });
  }
}

export const dynamic = "force-dynamic";
