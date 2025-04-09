import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";
import dayjs from "dayjs";
import { Application, ApplicationStatusId } from "../../api/Application";

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
                const appData: plotDataEntry = {
                    applicationNumber: i + 1,
                    companyName: application.companyName,
                    endDays:
                        application.statusLog.length > 1
                            ? dayjs(application.statusLog[application.statusLog.length - 1].timestamp).diff(
                                  overallStartDate,
                                  "days",
                              )
                            : overallDays,
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

                // If rejected in less than a day, add half a day,
                // so the rejection dot doesn't cover the application dot.
                // TODO: I should generalize that for all statuses. Happens the most for rejections though.
                if (appData["rejected"] === appData["applied"]) {
                    const appliedDays = appData["applied"] as number;
                    appData["rejected"] = appData["endDays"] = appliedDays + 0.5;
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
                ],
            });

            containerRef.current.append(plot);
            // Clean up before unmount
            return () => plot.remove();
        }
    }, [applications]);

    return <div ref={containerRef} />;
};

export default ApplicationProgress;
