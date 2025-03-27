export type ApplicationStatusId =
    | "recruiterOutreach"
    | "applied"
    | "initialScreen"
    | "interview1"
    | "interview2"
    | "interview3"
    | "interview4"
    | "interview5"
    | "offered"
    | "unresponsive"
    | "applicationIgnored"
    | "applicationRejected"
    | "declinedOffer"
    | "acceptedOffer"
    | "withdrew";

export const ApplicationStatusDefs = [
    { id: "recruiterOutreach", label: "recruiter outreach", active: true },
    { id: "applied", label: "applied", active: true },
    { id: "initialScreen", label: "initial screen", active: true },
    { id: "interview1", label: "interview #1", active: true },
    { id: "interview2", label: "interview #2", active: true },
    { id: "interview3", label: "interview #3", active: true },
    { id: "interview4", label: "interview #4", active: true },
    { id: "interview5", label: "interview #5", active: true },
    { id: "offered", label: "offered", active: true },
    { id: "unresponsive", label: "stopped responding", active: false },
    { id: "applicationIgnored", label: "application ignored", active: false },
    { id: "applicationRejected", label: "application rejected", active: false },
    { id: "declinedOffer", label: "declined offer", active: false },
    { id: "acceptedOffer", label: "accepted offer", active: false },
    { id: "withdrew", label: "withdrew myself", active: false },
];

export const applicationStatusLabel = (statusId: ApplicationStatusId): string => {
    const statusProperties = ApplicationStatusDefs.find((statusDef) => statusId === statusDef.id);
    return statusProperties?.label ?? statusId;
};

export type Application = {
    id: string;
    companyName: string;
    role: string;
    status: ApplicationStatusId;
    note: string;
    source: string;
    statusLog: ApplicationStatusId[];
    /* TODO: other fields to track:
    - notes (freeform but short)
    - source (allow adding new on-the-fly, but encourage re-use)
    - dates:
      - first contact
      - most recent contact
      - reminder
      - add date to each statusLog entry
  */
};
