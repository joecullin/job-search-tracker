import { useEffect, useRef } from "react";

import * as Plot from "@observablehq/plot";
import dayjs from "dayjs";

import { Application } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

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

            // Fill the rest of the year with blanks.
            const januaryFirst = dayjs().startOf("year");
            for (let i = 1; i < 364; i++) {
                const day = januaryFirst.add(i, "day");
                dateCounts[day.format("YYYY-MM-DD")] ||= 0;
            }

            const plotData = Object.keys(dateCounts).map((dateString) => {
                const date = new Date(dateString);
                const firstOfYear = dayjs(dateString).startOf("year");
                return {
                    dateString,
                    date,
                    dayOfWeek: date.getDay(),
                    monthNumber: date.getMonth(),
                    weekNumber: Math.ceil(
                        ((date.getTime() - firstOfYear.toDate().getTime()) / 86400000 + firstOfYear.toDate().getDay() + 1) / 7,
                    ),
                    count: dateCounts[dateString],
                };
            });

            //TODO: month labels in x axis (like github profile) would be nice.

            const plot = Plot.plot({
                padding: 0,
                x: { axis: null },
                y: { tickFormat: Plot.formatWeekday("en", "narrow"), tickSize: 0 },
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
                        title: (d) => (d.dateString ? `${d.dateString}: ${d.count}` : "-"),
                        inset: 0.5,
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
