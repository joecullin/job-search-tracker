// Input: tab-separated data copied from my google sheet.
// Output: data for https://sankeymatic.com/build/, copied to my clipboard.
// Example usage:
//   npm run sankey && echo "RESULT:" && pbpaste

import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";
import { execSync } from "child_process";

const inputPath = "./data/tracking-sheet.txt";

interface Application {
    company: string,
    role: string,
    reminder: string,
    lastContact: string,
    status: string,
    notes: string,
    source: string,
    history: string[],
};

// Raw csv rows are almost the same as the Application object
interface ApplicationRawData extends Omit<Application, "history">{
    history: string, // history cell has multi-line record, one line per status
};

const generateSankeyInput = async () => {
    const history = (await getData(inputPath)).map((application: Application) => application.history);

    interface StatusTransition {
        status: string,
        nextStatus: string,
        count: number,
    };
    const statusTransitions = [] as StatusTransition[];

    for (const applicationHistory of history){
        console.log(`history:`, applicationHistory);
        for (let i=0; i<applicationHistory.length; i++){
            const status = applicationHistory[i];
            let nextStatus: undefined | string;
            if (applicationHistory.length === 1){
                nextStatus = "unknown";
            }
            else if (i+1 < applicationHistory.length){
                nextStatus = applicationHistory[i+1];
            }
            if (nextStatus){
                const transitionIndex = statusTransitions.findIndex(transition => transition.status === status && transition.nextStatus === nextStatus);
                if (transitionIndex > -1){
                    statusTransitions[transitionIndex].count++;
                }
                else{
                    statusTransitions.push({
                        status,
                        nextStatus,
                        count: 1,
                    });
                }
            }
        }
    }

    // Sankeymatic doesn't require sorting, but it's easier for me to read when sorted.
    statusTransitions.sort((a, b) => a.status.localeCompare(b.status) || a.nextStatus.localeCompare(b.nextStatus));

    const sankeyLines = [] as string[];
    for (const statusTransition of statusTransitions){
        sankeyLines.push(`${statusTransition.status} [${statusTransition.count}] ${statusTransition.nextStatus}`);
    }
    return sankeyLines.join("\n");
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

//TODO: connect directly to live sheet, rather than reading copy-pasted text file.
const getData = async (inputPath: string) => {
    try {
        const fileContents = await fs.readFile(inputPath);
        const records = parse(fileContents, {
            delimiter: "\t",
            trim: true,
            skip_empty_lines: true,
            skip_records_with_empty_values: true,
            columns: header => header.map((column: string) => (column.charAt(0).toLowerCase() + column.slice(1)).replace(/\s/g, "")),
        })
        .map((application: ApplicationRawData) => {
            return {
                ...application,
                history: application.history.split("\n"),
            };
        });

        return records;
    }
    catch (error){
        console.error(`error reading file '${inputPath}'.`, error);
    }
}

(async () => {
    try {
        const sankeyInput = await generateSankeyInput();
        await copyTextToClipboard(sankeyInput);
        console.log(`Finished!`);
        process.exit(0);
    } catch (error) {
        console.error(`Caught error!\n${(error as Error).stack}`);
        process.exit(1);
    }
})();