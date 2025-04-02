import { Application } from "../../../common/Application";
import { v4 as uuidv4 } from "uuid";

export * from "../../../common/Application";

const apiBaseUrl = "http://localhost:3000/api/v1";

export const getApplications = async (): Promise<Application[]> => {
    const requestUrl = `${apiBaseUrl}/applications`;
    try {
        const response = await fetch(requestUrl);
        try {
            const applications = await response.json();
            return applications;
        } catch (error) {
            console.log(`error parsing fetched data!`, error);
        }
    } catch (error) {
        console.log(`error fetching data!`, error);
    }
    return [];
};

export const saveApplications = async (applications: Application[]): Promise<void> => {
    const requestUrl = `${apiBaseUrl}/applications`;
    try {
        await fetch(requestUrl, {
            method: "PUT",
            body: JSON.stringify(applications),
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.log(`error saving data!`, error);
    }
};

export const newApplication = () => {
    const currentDate = new Date().toISOString().substring(0, 10);
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
