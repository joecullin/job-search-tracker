// Input: tab-separated data copied from my google sheet.
// Output: data to load into backend of web app
// Example usage:
//   npm run import && echo "RESULT:" && pbpaste

import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";
import { execSync } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { Application, ApplicationStatusDefs, ApplicationStatusId } from "../../common/Application";

const inputPath = "/Users/joecullin/Downloads/job_tracking_export_20250401.txt";
const defaultYear = 2025;
const defaultTimestamp = "2025-03-01T13:00:00Z";

interface ApplicationRawData extends Omit<Application, "id"|"statusLog|companyName|firstContactDate|reminderDate|lastContactDate">{
    company: string, // slightly different column name
    firstContact: string, // slightly different column name
    lastContact: string, // slightly different column name
    reminder: string, // slightly different column name
    history: string, // history is a multi-line string, one line per status.
};

const getData = async (inputPath: string): Promise<Application[]> => {
    try {
        const fileContents = await fs.readFile(inputPath);
        const records = parse(fileContents, {
            delimiter: "\t",
            trim: true,
            skip_empty_lines: true,
            skip_records_with_empty_values: true,
            columns: header => header.map((column: string) => (column.charAt(0).toLowerCase() + column.slice(1)).replace(/\s/g, "")),
        })
        .map((rawApplication: ApplicationRawData) => {
            const formatDate = (monthSlashDay: string): string => {
                const date = new Date(`${defaultYear}/${monthSlashDay}`);
                return date.toISOString().substring(0,10);
            };
            const application = {
                id: uuidv4(),
                companyName: rawApplication.company,
                role: rawApplication.role,
                status: rawApplication.status,
                note: rawApplication.note,
                source: rawApplication.source,
                firstContactDate: formatDate(rawApplication.firstContact),
                lastContactDate: formatDate(rawApplication.lastContact),
                reminderDate: formatDate(rawApplication.reminder),
                statusLog: rawApplication.history.split("\n").map(statusLabel => {
                    let status = <ApplicationStatusId>"applied";
                    const statusProperties = ApplicationStatusDefs.find((statusDef) => statusLabel === statusDef.label);
                    if (statusProperties){
                        status = statusProperties.id;
                    }
                    return {status, timestamp: defaultTimestamp };
                }),
            };
            return application;
        });
        return records;
    }
    catch (error){
        console.error(`error reading file '${inputPath}'.`, error);
        return [];
    }
};

const copyTextToClipboard = async (text: string) => {
    // (mac-specific)
    try {
        execSync("pbcopy", {
            input: text,
        });
    }
    catch (error){
        console.error(`error copying output to clipboard: ${(error as Error).message}`);
        throw Error("error copying output to clipboard.");
    }
};

(async () => {
    try {
        const dataToImport = <Application[]> await getData(inputPath);
        await copyTextToClipboard(JSON.stringify(dataToImport, null, 4));
        console.log(`Finished!`);
        process.exit(0);
    } catch (error) {
        console.error(`Caught error!\n${(error as Error).stack}`);
        process.exit(1);
    }
})();