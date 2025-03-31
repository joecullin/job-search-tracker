import {Application} from "../../../common/Application";
import { v4 as uuidv4 } from 'uuid';

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
            firstContactDate: "2025-03-15",
            lastContactDate: "2025-03-28",
            reminderDate: "",
        },
        {
            id: "2b",
            companyName: "Moe's Tavern",
            role: "Barback",
            status: "applicationRejected",
            note: "example note ...",
            source: "Recruiter contacted me",
            statusLog: [
                { status: "applied", timestamp: "2025-03-15T13:00:00Z" },
                { status: "applicationRejected", timestamp: "2025-03-19:00:00Z" },
            ],
            firstContactDate: "2025-03-15",
            lastContactDate: "2025-03-19",
            reminderDate: "",
        },
        {
            id: "3c",
            companyName: "Central Perk",
            role: "Senior associate barista",
            note: "example note ...",
            source: "Indeed",
            status: "applicationIgnored",
            statusLog: [
                { status: "applied", timestamp: "2025-03-12T13:00:00Z" },
                { status: "applicationIgnored", timestamp: "2025-03-28:00:00Z" },
            ],
            firstContactDate: "2025-03-15",
            lastContactDate: "2025-03-28",
            reminderDate: "",
        },
        {
            id: "4d",
            companyName: "Initech",
            role: "Printer maintenance",
            note: "example note ...\nline 2\n\nline 3\nline 4",
            source: "jobs4U.com",
            status: "applicationRejected",
            statusLog: [
                { status: "applied", timestamp: "2025-03-12T13:00:00Z" },
                { status: "interview1", timestamp: "2025-03-21:00:00Z" },
                { status: "interview2", timestamp: "2025-03-21:00:00Z" },
                { status: "offered", timestamp: "2025-03-21:00:00Z" },
            ],
            firstContactDate: "2025-03-15",
            lastContactDate: "2025-03-28",
            reminderDate: "",
        },
    ];
    return applicationArray;
};

export const newApplication = () => {
    const currentDate = (new Date()).toISOString().substring(0,10);
    const application = <Application>{
        id: uuidv4(),
        companyName: "",
        role: "",
        status: "applied",
        note: "",
        source: "",
        statusLog: [],
        firstContactDate: currentDate,
        lastContactDate: currentDate,
        reminderDate: "",
    };
    return application;
};

