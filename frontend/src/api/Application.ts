import { Application, ApplicationFilter, ApplicationStatusDefs, ApplicationStatusId } from "../../../common/Application";
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

export const filterApplications = (applications: Application[], filters: ApplicationFilter[]): Application[] => {
    if (filters.length) {
        type StatusMapping = {
            [key in ApplicationStatusId]?: {
                active: boolean;
                progressing: boolean | undefined;
            };
        };
        const statusMappings: StatusMapping = {};
        ApplicationStatusDefs.forEach((statusDef) => {
            statusMappings[statusDef.id] = {
                active: statusDef.active,
                progressing: statusDef.progressing,
            };
        });
        let filtered = applications;
        for (const filter of filters) {
            if (filter === "status:active") {
                filtered = filtered.filter((app) => statusMappings[app.status]?.active);
            } else if (filter === "status:inactive") {
                filtered = filtered.filter((app) => !statusMappings[app.status]?.active);
            } else if (filter === "status:progressing") {
                filtered = filtered.filter((app) => statusMappings[app.status]?.progressing);
            }
        }
        return filtered;
    } else {
        return applications;
    }
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
    //TODO: make this save local time. Or just switch to saving iso 8601.
    //Not a high priority. only matters for applications submitted after 8pm.
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
