import { Application } from "../../../common/Application";
import { v4 as uuidv4 } from "uuid";

export * from "../../../common/Application";

const apiBaseUrl = "http://localhost:3000/api/v1";

export const getApplications = async (): Promise<Application[]> => {
    // const applicationArray: Application[] = [];

    const request = `${apiBaseUrl}/applications`;
    try {
        const response = await fetch(request);
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
