import { Application, ApplicationFilter, ApplicationStatusDefs, ApplicationStatusId } from "../../../common/Application";
import { v4 as uuidv4 } from "uuid";
import { inDemoMode } from "./Config";
import { demoData } from "../../../sample_data/demo_data";

export * from "../../../common/Application";

const apiBaseUrl = "http://localhost:3000/api/v1";

const cleanApplicationHistory = (application: Application): Application => {
    // If we gave up on an application and marked it as ignored, then we got a later update, filter out the ignored status.
    // (If we don't do this, it throws off the sankey flow diagram significantly.)
    // Might be better to do this cleanup on write, but it's easier to do it as an afterthought on read for now.
    for (const skipStatus of ["applicationIgnored", "unresponsive"]) {
        if (
            application.statusLog.find((logEntry) => logEntry.status === skipStatus) &&
            application.statusLog[application.statusLog.length - 1].status !== skipStatus
        ) {
            application.statusLog = application.statusLog.filter((logEntry) => logEntry.status !== skipStatus);
        }
    }
    return application;
};

export const getApplications = async (): Promise<Application[]> => {
    if (inDemoMode) {
        return demoData;
    }
    const requestUrl = `${apiBaseUrl}/applications`;
    try {
        const response = await fetch(requestUrl);
        if (!response.ok) {
            throw Error(`Error response from server.`);
        }
        try {
            const applications = await response.json();
            return applications.map((app: Application) => cleanApplicationHistory(app));
        } catch (error) {
            console.log(`error parsing fetched data!`, error);
            throw Error(`Error parsing data from server.`);
        }
    } catch (error) {
        console.log(`error fetching data!`, error);
        throw error;
    }
    return [];
};

export const filterApplications = (
    applications: Application[],
    filters: ApplicationFilter[],
    searchQuery?: string,
): Application[] => {
    let filtered = applications;
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
        for (const filter of filters) {
            if (filter === "status:active") {
                filtered = filtered.filter((app) => statusMappings[app.status]?.active);
            } else if (filter === "status:inactive") {
                filtered = filtered.filter((app) => !statusMappings[app.status]?.active);
            } else if (filter === "status:progressing") {
                filtered = filtered.filter((app) => statusMappings[app.status]?.progressing);
            }
        }
    }
    if (searchQuery && searchQuery !== "") {
        const searchString = searchQuery.toLowerCase();

        const extractSearchableText = (application: Application): string => {
            const strings = [] as string[];
            const skipFields = [
                "id",
                "timestamp",
                "lastContactDate",
                "reminderDate", // all except firstContactDate
            ];
            const extractStrings = (input: object) => {
                Object.entries(input).forEach(([key, value]) => {
                    if (!skipFields.includes(key)) {
                        if (typeof value === "string") {
                            strings.push(value);
                        } else if (typeof value === "object") {
                            extractStrings(value);
                        }
                    }
                });
            };
            extractStrings(application);
            return strings.flat().join("\n").toLowerCase();
        };

        filtered = filtered.filter((app) => {
            const appText = extractSearchableText(app);
            return appText.includes(searchString);
        });
    }

    return filtered;
};

export const saveApplications = async (applications: Application[]): Promise<void> => {
    if (inDemoMode) {
        return;
    }
    const requestUrl = `${apiBaseUrl}/applications`;
    try {
        const response = await fetch(requestUrl, {
            method: "PUT",
            body: JSON.stringify(applications),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw Error(`Error response when saving data: ${response.status}`);
        }
    } catch (error) {
        console.log(`error saving data!`, error);
        throw Error("Server error while saving changes.");
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
