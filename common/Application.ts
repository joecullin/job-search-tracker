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
    { id: <ApplicationStatusId>"recruiterOutreach", label: "recruiter outreach", active: true },
    { id: <ApplicationStatusId>"applied", label: "applied", active: true },
    { id: <ApplicationStatusId>"initialScreen", label: "initial screen", active: true },
    { id: <ApplicationStatusId>"interview1", label: "interview #1", active: true },
    { id: <ApplicationStatusId>"interview2", label: "interview #2", active: true },
    { id: <ApplicationStatusId>"interview3", label: "interview #3", active: true },
    { id: <ApplicationStatusId>"interview4", label: "interview #4", active: true },
    { id: <ApplicationStatusId>"interview5", label: "interview #5", active: true },
    { id: <ApplicationStatusId>"offered", label: "offered", active: true },
    { id: <ApplicationStatusId>"unresponsive", label: "stopped responding", active: false },
    { id: <ApplicationStatusId>"applicationIgnored", label: "application ignored", active: false },
    { id: <ApplicationStatusId>"applicationRejected", label: "application rejected", active: false },
    { id: <ApplicationStatusId>"declinedOffer", label: "declined offer", active: false },
    { id: <ApplicationStatusId>"acceptedOffer", label: "accepted offer", active: false },
    { id: <ApplicationStatusId>"withdrew", label: "withdrew myself", active: false },
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
    firstContactDate: string;
    lastContactDate: string;
    reminderDate: string;
    /* TODO: other fields to track:
      - add date to each statusLog entry
  */
};
