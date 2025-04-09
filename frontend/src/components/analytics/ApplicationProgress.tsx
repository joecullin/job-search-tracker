import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import dayjs from "dayjs";
import { Application, ApplicationStatusId, applicationStatusIsActive } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

const ApplicationProgress = ({ applications }: ComponentProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef?.current) {
            applications.sort((a, b) => a.statusLog[0].timestamp.localeCompare(b.statusLog[0].timestamp));
            const overallStartDate = dayjs(applications[0]?.firstContactDate);
            const overallEndDate = dayjs();
            const overallDays = overallEndDate.diff(overallStartDate, "days");

            type plotDataEntry = {
                [key in "applicationNumber" | "companyName" | "endDays" | "interview" | ApplicationStatusId]?: number | string;
            };

            const plotData = applications.map((application, i) => {
                const mostRecentLogEntry = application.statusLog[application.statusLog.length - 1];
                const stillActive = applicationStatusIsActive(mostRecentLogEntry.status);

                const appData: plotDataEntry = {
                    applicationNumber: i + 1,
                    companyName: application.companyName,
                    endDays: stillActive ? overallDays : dayjs(mostRecentLogEntry.timestamp).diff(overallStartDate, "days"),
                };
                application.statusLog.forEach((logEntry) => {
                    appData[logEntry.status] = dayjs(logEntry.timestamp).diff(overallStartDate, "days");
                });

                // If there's no "applied" (e.g. if a recruiter reached out to me), treat first contact as applied date.
                if (!application.statusLog.find((logEntry) => logEntry.status === "applied")) {
                    appData["applied"] = dayjs(application.firstContactDate).diff(overallStartDate, "days");
                }

                // merge a couple "rejected" statuses into just "rejected"
                if (appData["applicationRejected"] && !appData["rejected"]) {
                    appData["rejected"] = appData["applicationRejected"];
                }

                // merge all interview statuses into just "interview"
                if (appData["interview1"]) {
                    appData["interview"] = appData["interview1"];
                }
                for (const interviewStatus of ["interview1", "interview2", "interview3", "interview4", "interview5"]) {
                    if (appData[interviewStatus as ApplicationStatusId]) {
                        appData["interview"] = appData[interviewStatus as ApplicationStatusId];
                    }
                }

                // TODO: generalize this for all statuses. Only covering the couple most common so far.
                // If rejected in less than a day, add half a day, so the rejection doesn't obscure the application.
                if (appData["rejected"] && appData["rejected"] === appData["applied"]) {
                    const appliedDays = appData["applied"] as number;
                    appData["rejected"] = appData["endDays"] = appliedDays + 0.5;
                } else if (appData["withdrew"] && appData["withdrew"] === appData["initialScreen"]) {
                    const screenDays = appData["initialScreen"] as number;
                    appData["endDays"] = appData["withdrew"] = screenDays + 0.5;
                }
                return appData;
            });

            // console.log(`plotData: ${JSON.stringify(plotData, null, 2)}`); //JOE

            const plot = Plot.plot({
                y: {
                    label: "applications",
                    tickPadding: 6,
                    tickSize: 0,
                },
                x: {
                    label: "days",
                    grid: true,
                    tickSize: 0,
                },
                color: { scheme: "Category10" },
                height: 500, //TODO revisit this. hardcoded for now.
                marks: [
                    // Plot.tickY([0,applications.length+1]),
                    // Plot.tickX([0,overallDays]),
                    Plot.ruleY(plotData, {
                        x1: "applied",
                        x2: "endDays",
                        y: "applicationNumber",
                        strokeOpacity: 0.5,
                        strokeWidth: 2,
                    }),
                    Plot.dot(plotData, { x: "applied", y: "applicationNumber", title: "companyName", r: 4, fill: "gray" }),
                    Plot.dot(plotData, { x: "initialScreen", y: "applicationNumber", r: 4, fill: "#007595" }),
                    Plot.dot(plotData, { x: "interview", y: "applicationNumber", r: 4, fill: "#00c950" }),
                    Plot.dot(plotData, { x: "offer", y: "applicationNumber", r: 4, fill: "#008236" }),
                    //TODO: account for other statuses. Something fun like icon or emoji for offers? Or just bigger?
                    Plot.dot(plotData, { x: "rejected", y: "applicationNumber", r: 4, fill: "red" }),
                    Plot.dot(plotData, { x: "withdrew", y: "applicationNumber", r: 4, fill: "red" }),
                    Plot.dot(plotData, { x: "unresponsive", y: "applicationNumber", r: 4, fill: "gray" }),

                    //TODO: add a legend?
                ],
            });

            plot.style.border = "1px solid lightgray";

            containerRef.current.append(plot);
            // Clean up before unmount
            return () => plot.remove();
        }
    }, [applications]);

    return <div ref={containerRef} />;
};

export default ApplicationProgress;
