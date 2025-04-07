import { useEffect, useRef, useState } from "react";

import * as Plot from "@observablehq/plot";

import { Application, ApplicationStatusId } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

const ApplicationsVsRejectionsTimeline = ({ applications }: ComponentProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);

    // Keep track of the div width, so we can tell the chart to fill 100% of it.
    useEffect(() => {
        if (containerRef?.current) {
            // when the component gets mounted
            setWidth(containerRef.current.offsetWidth);
            // handle resize
            const getwidth = () => {
                if (containerRef?.current) {
                    setWidth(containerRef.current.offsetWidth);
                }
            };
            window.addEventListener("resize", getwidth);
            // remove event listener before the component gets unmounted
            return () => window.removeEventListener("resize", getwidth);
        }
    }, []);

    useEffect(() => {
        if (containerRef?.current) {
            const rejectionStatuses: ApplicationStatusId[] = ["applicationRejected"];

            type statsForDate = {
                [key in string]?: {
                    applied: number;
                    rejected: number;
                };
            };
            const allDates: statsForDate = {};
            const emptyRecord = { applied: 0, rejected: 0 };
            applications.forEach((app) => {
                const applicationDate = app.firstContactDate;
                if (!allDates[applicationDate]) {
                    allDates[applicationDate] = { ...emptyRecord };
                }
                allDates[applicationDate].applied++;
                const rejectionLogEntry = app.statusLog.find((logEntry) => rejectionStatuses.includes(logEntry.status));
                if (rejectionLogEntry) {
                    const rejectionDate = rejectionLogEntry.timestamp.substring(0, 10);
                    if (!allDates[rejectionDate]) {
                        allDates[rejectionDate] = { ...emptyRecord };
                    }
                    allDates[rejectionDate].rejected++;
                }
            });

            const plotData: { date: object; count: number; event: string }[] = [];
            Object.keys(allDates)
                .sort((a, b) => a.localeCompare(b))
                .forEach((date) => {
                    if (allDates[date]?.applied) {
                        plotData.push({
                            date: new Date(date),
                            count: allDates[date]?.applied || 0,
                            event: "applied",
                        });
                    }
                    if (allDates[date]?.rejected) {
                        plotData.push({
                            date: new Date(date),
                            count: allDates[date]?.rejected || 0,
                            event: "rejected",
                        });
                    }
                });

            const plot = Plot.plot({
                y: { grid: true },
                grid: true,
                width: width,
                height: Math.ceil(width / 6),
                color: { scheme: "Category10" },
                marks: [
                    Plot.ruleY([0]),
                    Plot.rectY(plotData, {
                        x: "date",
                        y: "count",
                        interval: "day",
                        fill: "event",
                    }),
                ],
            });

            plot.style.border = "1px solid lightgray";
            plot.style.padding = "1rem";

            containerRef.current.append(plot);
            // Clean up before unmount
            return () => plot.remove();
        }
    }, [applications, width]);

    return <div ref={containerRef} />;
};

export default ApplicationsVsRejectionsTimeline;
