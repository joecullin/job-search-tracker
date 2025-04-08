import { useEffect, useRef } from "react";

import * as Plot from "@observablehq/plot";
import dayjs from "dayjs";

import { Application } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

// Notes about some shortcuts I took:
// - As in the rest of the app, I'm a little careless here with UTC vs local dates.
// - Hardcoded couple hundred day limit for now.

const ApplicationTimeline = ({ applications }: ComponentProps) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (containerRef?.current) {
            const dateList = applications.map((app) => app.firstContactDate).sort((a, b) => a.localeCompare(b));
            type plotDataEntry = {
                [key in string]?: number;
            };
            const dateCounts: plotDataEntry = {};
            dateList.forEach((date) => {
                if (!dateCounts[date]) {
                    dateCounts[date] = 0;
                }
                dateCounts[date]++;
            });

            const start = dayjs(dateList[0]).subtract(2, "weeks").startOf("month");
            const startDate = start.toDate();
            const getWeekNumber = (date: Date) => {
                return Math.ceil(((date.getTime() - startDate.getTime()) / 86400000 + startDate.getDay() + 1) / 7);
            };

            // Fill the rest of the calendar with blanks.
            // Also initialize month labels.
            const monthLabels = [
                {
                    weekNumber: getWeekNumber(startDate),
                    label: start.format("MMM"),
                },
            ];
            const maxDays = 190; // arbitrary choice for now.
            for (let i = 1; i < maxDays; i++) {
                const day = start.add(i, "day");

                // Bail out if we're near the end and it's a Sunday.
                // (Makes a clean right edge of the calendar.)
                if ((i + 7) > maxDays && day.day() === 0){
                    break;
                }

                dateCounts[day.format("YYYY-MM-DD")] ||= 0;

                // If we crossed into a new month, save the month label:
                const yesterday = start.add(i - 1, "day");
                if (day.get("month") !== yesterday.get("month")) {
                    monthLabels.push({
                        weekNumber: getWeekNumber(day.toDate()),
                        label: day.format("MMM"),
                    });
                }
            }

            const plotData = Object.keys(dateCounts).map((dateString) => {
                const date = new Date(dateString);
                const weekNumber = getWeekNumber(date);
                return {
                    displayDate: dayjs(date).format("MMM D"),
                    date,
                    dayOfWeek: date.getDay(),
                    monthNumber: date.getMonth(),
                    weekNumber,
                    count: dateCounts[dateString],
                };
            });

            const plot = Plot.plot({
                padding: 0,
                x: { axis: null },
                y: {
                    axis: "left",
                    domain: [-1, 0, 1, 2, 3, 4, 5, 6], // -1 for empty top row, 0-6 for Sun-Sat.
                    ticks: [1, 2, 3, 4, 5], // don’t show label for Months row, or for Sat & Sun.
                    tickSize: 0,
                    tickFormat: Plot.formatWeekday("en"),
                },
                fy: { tickFormat: "" },
                color: {
                    scheme: "BrBG",
                    tickFormat: "",
                    pivot: 0,
                },
                marks: [
                    Plot.cell(plotData, {
                        x: (d) => d.weekNumber,
                        y: (d) => d.dayOfWeek,
                        // I'm mid-year now. Revisit this if I wind up crossing a calendar year boundary:
                        // fy: (d) => d.date.getFullYear(),
                        fill: (d) => (d.count > 0 ? d.count * 2 + 1 : -2), // boost a bit, so 1's aren't too light.
                        title: (d) => (d.displayDate ? `${d.displayDate} (${d.count})` : "-"),
                        inset: 1,
                        r: 3,
                    }),

                    // Display count inside each cell. Can't decide whether to keep this.
                    // Plot.text(plotData, {
                    //     x: (d) => d.weekNumber,
                    //     y: (d) => d.dayOfWeek,
                    //     text: (d) => d.count > 0 ? d.count : "",
                    //     fill: "white",
                    // }),

                    Plot.text(monthLabels, {
                        text: (d) => d.label,
                        frameAnchor: "top-left",
                        x: (d) => d.weekNumber,
                        y: -1,
                    }),
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

export default ApplicationTimeline;
