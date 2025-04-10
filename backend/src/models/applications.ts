import { writeFileSync, readFileSync } from "fs";
import { Application } from "../../../common/Application";

// const dataFile = "demo.json";
const dataFile = "applications.json";
const applicationsDataFile = [process.env.LOCAL_FILESYSTEM_DATA_PATH, dataFile].join("/");

export const getAll = async (): Promise<Application[]> => {
    try {
        const fileData = readFileSync(applicationsDataFile, "utf-8");
        const applications = JSON.parse(fileData);
        return applications;
    } catch (error) {
        if (error instanceof Error) {
            console.error(`error reading applications data from disk: ${error.stack}`);
        }
        return [];
    }
};

export const saveAll = async (applicationArray: Application[]): Promise<void> => {
    try {
        await writeFileSync(applicationsDataFile, JSON.stringify(applicationArray, null, 4), "utf-8");
    } catch (error) {
        if (error instanceof Error) {
            console.error(`error writing applications data to disk: ${error.stack}`);
        }
    }
};
