export interface IUserInvite {
  id: string;
  email: string;
  name: string;
  qrCode: string;
  travel: "international" | "domestic";
  language: "en" | "vi";
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
    needsPickup: boolean;
  };
  hotel: {
    stayFrom: string;
    stayTo: string;
    needsTransport: boolean;
  };
  wishes: string;
}

export interface IGetInviteResponse {
  invite?: IUserInvite;
  inviteSubmission?: IUserInviteSubmission;
  error?: string;
}
