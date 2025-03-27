import {Application} from "../../../common/Application";
export * from "../../../common/Application";

export const getApplications = () => {
    const applicationArray: Application[] = [
        {
            id: "1a",
            companyName: "Acme Inc",
            role: "Sr Eng Mgr",
            status: "applied",
            note: "example note ...",
            source: "Indeed",
            statusLog: [],
        },
        {
            id: "2b",
            companyName: "Moe's Tavern",
            role: "Barback",
            status: "applicationRejected",
            note: "example note ...",
            source: "Recruiter contacted me",
            statusLog: ["applied", "applicationRejected"],
        },
        {
            id: "3c",
            companyName: "Central Perk",
            role: "Senior associate barista",
            note: "example note ...",
            source: "Indeed",
            status: "applicationIgnored",
            statusLog: ["applied", "applicationIgnored"],
        },
        {
            id: "4d",
            companyName: "Initech",
            role: "Printer maintenance",
            note: "example note ...\nline 2\n\nline 3\nline 4",
            source: "jobs4U.com",
            status: "applicationRejected",
            statusLog: ["applied", "interview1", "interview2", "offered"],
        },
    ];
    return applicationArray;
}
