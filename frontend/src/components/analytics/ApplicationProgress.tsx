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
                height: 500, //TODO revisit this. hardcoded for now.
                marks: [
                    Plot.ruleY(plotData, {
                        x1: "applied",
                        x2: "endDays",
                        y: "applicationNumber",
                        strokeOpacity: 0.5,
                        strokeWidth: 2,
                    }),

                    Plot.dot(plotData, { x: "applied", y: "applicationNumber", title: "companyName", r: 4, fill: "gray" }),
                    Plot.dot(plotData, { x: "initialScreen", y: "applicationNumber", r: 4, fill: "#00b8db" }), // cyan 500
                    Plot.dot(plotData, { x: "interview", y: "applicationNumber", r: 4, fill: "#00c950" }), // green 500
                    Plot.dot(plotData, { x: "offered", y: "applicationNumber", r: 6, fill: "#008236" }), // green 700, bigger
                    Plot.text(plotData, { x: "acceptedOffer", y: "applicationNumber", fontSize: 20, text: () => "🎉" }),
                    Plot.dot(plotData, { x: "rejected", y: "applicationNumber", r: 4, fill: "red" }),
                    Plot.dot(plotData, { x: "withdrew", y: "applicationNumber", r: 4, fill: "red" }),
                    Plot.dot(plotData, { x: "declinedOffer", y: "applicationNumber", r: 4, fill: "red" }),
                    Plot.dot(plotData, { x: "unresponsive", y: "applicationNumber", r: 4, fill: "gray" }),
                    Plot.dot(plotData, { x: "applicationIgnored", y: "applicationNumber", r: 4, fill: "gray" }),
                ],
            });

            // Gave up (for now) on creating a custom legend with Plot. Use basic jsx below instead.
            // const legendData = [
            //     { x: 1, y: 0, color: "#00b8db", text: "screen" },
            //     { x: 2, y: 0, color: "#00c950", text: "interview" },
            //     { x: 3, y: 0, color: "#008236", text: "offer" },
            // ];
            // const legend = Plot.plot({
            //     height: 50,
            //     x: {
            //         label: null,
            //         tickPadding: 6,
            //         tickSize: 0,
            //         // domain: [0, 0.1, 1, 1.1, 2, 2.1],
            //         type: "linear",
            //         range: [0,500],
            //     },
            //     marks: [
            //         Plot.dot(legendData, { x: (d) => d.x, y: () => 0, r: 4, fill: (d) => d.color }),
            //         Plot.text(legendData, { x: (d) => d.x+.1, y: () => 0, text: (d) => d.text }),
            //     ],
            // });

            plot.style.border = "1px solid lightgray";

            containerRef.current.append(plot);
            // Clean up before unmount
            return () => plot.remove();
        }
    }, [applications]);

    return (
        <div>
            <div ref={containerRef} />
            <div style={{ fontSize: ".6rem", paddingTop: 5 }}>
                <span style={{ color: "red", paddingLeft: "1rem" }}>⬤</span> rejected, unresponsive, withdrew
                <span style={{ color: "#00b8db", paddingLeft: "1rem" }}>⬤</span> screen
                <span style={{ color: "#00c950", paddingLeft: "1rem" }}>⬤</span> interview
                <span style={{ color: "#008236", paddingLeft: "1rem" }}>⬤</span> offer
            </div>
        </div>
    );
};

export default ApplicationProgress;
