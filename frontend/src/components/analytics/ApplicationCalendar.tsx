import { useEffect, useRef } from "react";

import * as Plot from "@observablehq/plot";
import dayjs from "dayjs";

import { Application } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

// Note:
// - I didn't think through boundaries or local vs UTC much.
//   - Hopefully I won't still be job hunting in December–January,
//   - For this kind of graphical view, I'm not worried about timezones being off by one day.

//TODO:
// - make the boxes square instead of rectangle?
// - rounded corners on boxes?

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

            const jan1 = dayjs().startOf("year");
            const jan1Date = jan1.toDate();
            const getWeekNumber = (date: Date) => {
                return Math.ceil(((date.getTime() - jan1Date.getTime()) / 86400000 + jan1Date.getDay() + 1) / 7);
            };

            // Fill the rest of the year with blanks.
            // Also initialize month labels.
            const monthLabels = [
                {
                    weekNumber: getWeekNumber(jan1Date),
                    label: jan1.format("MMM"),
                },
            ];
            for (let i = 1; i < 364; i++) {
                const day = jan1.add(i, "day");
                dateCounts[day.format("YYYY-MM-DD")] ||= 0;

                // If we crossed into a new month, save the month label:
                const yesterday = jan1.add(i - 1, "day");
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
                    scheme: "PiYG",
                    tickFormat: "",
                    pivot: 0,
                },
                marks: [
                    Plot.cell(plotData, {
                        x: (d) => d.weekNumber,
                        y: (d) => d.dayOfWeek,
                        fy: (d) => d.date.getFullYear(),
                        fill: (d) => (d.count > 0 ? d.count + 3 : 0), // boost a bit, so 1's aren't too light.
                        title: (d) => (d.displayDate ? `${d.displayDate}: ${d.count} applications` : "-"),
                        inset: 0.5,
                    }),

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
