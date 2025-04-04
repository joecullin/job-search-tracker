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

export type ApplicationFilter = "status:active" | "status:inactive" | "status:progressing";

export const ApplicationStatusDefs = [
    { id: <ApplicationStatusId>"recruiterOutreach", label: "recruiter outreach", active: true },
    { id: <ApplicationStatusId>"applied", label: "applied", active: true },
    { id: <ApplicationStatusId>"initialScreen", label: "initial screen", active: true, progressing: true },
    { id: <ApplicationStatusId>"interview1", label: "interview #1", active: true, progressing: true },
    { id: <ApplicationStatusId>"interview2", label: "interview #2", active: true, progressing: true },
    { id: <ApplicationStatusId>"interview3", label: "interview #3", active: true, progressing: true },
    { id: <ApplicationStatusId>"interview4", label: "interview #4", active: true, progressing: true },
    { id: <ApplicationStatusId>"interview5", label: "interview #5", active: true, progressing: true },
    { id: <ApplicationStatusId>"offered", label: "offered", active: true, progressing: true },
    { id: <ApplicationStatusId>"unresponsive", label: "stopped responding", active: false },
    { id: <ApplicationStatusId>"applicationIgnored", label: "application ignored", active: false },
    { id: <ApplicationStatusId>"applicationRejected", label: "application rejected", active: false },
    { id: <ApplicationStatusId>"declinedOffer", label: "declined offer", active: false },
    { id: <ApplicationStatusId>"acceptedOffer", label: "accepted offer", active: false },
    { id: <ApplicationStatusId>"withdrew", label: "withdrew myself", active: false },
];

// Move these to css later? Not sure how I'll use them in charts yet.
export const applicationStatusColor = (statusId: ApplicationStatusId): string => {
    if (
        [
            "initialScreen",
            "interview1",
            "interview2",
            "interview3",
            "interview4",
            "interview5",
            "offered",
            "acceptedOffer",
        ].includes(statusId)
    ) {
        return "#198754";
    }
    const statusProperties = ApplicationStatusDefs.find((statusDef) => statusId === statusDef.id);
    if (statusProperties?.active === false) {
        return "#6a7282";
    }
    return "#0084d1";
};

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
    statusLog: {
        status: ApplicationStatusId;
        timestamp: string;
    }[];
    firstContactDate: string;
    lastContactDate: string;
    reminderDate: string;
};
