import { writeFileSync, readFileSync } from "fs";
import { Application } from "../../../common/Application";

const applicationsDataFile = [process.env.LOCAL_FILESYSTEM_DATA_PATH, "applications.json"].join(
    "/",
);

export const getAll = async (): Promise<Application[]> => {
    const fileData = readFileSync(applicationsDataFile, "utf-8");
    const applications = JSON.parse(fileData);
    return applications;
};

export const saveAll = async (applicationArray: Application[]): Promise<void> => {
    await writeFileSync(applicationsDataFile, JSON.stringify(applicationArray, null, 4), "utf-8");
};
