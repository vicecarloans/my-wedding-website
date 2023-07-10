export type TravelInfo = "international" | "domestic";

export interface IUserInvite {
  id: string;
  name: string;
  qrCode: string;
  travel: TravelInfo;
  eligibleForReimburse: boolean;
}

export interface IUserInviteSubmission {
  inviteId: string;
  isGoing: string;
  additionalGuests: Array<{
    name: string;
  }>;
  flight: {
    flightNumber: string;
    arrivalDateTime: string;
    arrivalDateTimeTZ: string;
    needsPickup: string;
    // Only for domestic
    reimburseAccountNumber: string;
    reimburseAccountHolderName: string;
    reimburseBankName: string;
    reimburseAmount: string;
  };
  hotel: {
    stayFrom: string;
    stayTo: string;
    needsTransport: string;
    proposedStayTo?: string;
  };
  wishes: string;
}

export interface IGetInviteResponse {
  invite?: IUserInvite;
  inviteSubmission?: IUserInviteSubmission;
  error?: string;
}
