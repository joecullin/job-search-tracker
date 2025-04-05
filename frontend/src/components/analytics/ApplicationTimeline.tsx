import { useEffect, useRef, useState } from "react";

import * as Plot from "@observablehq/plot";

import { Application } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

const ApplicationTimeline = ({ applications }: ComponentProps) => {
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
            const plotData = Object.keys(dateCounts).map((date) => {
                return {
                    date: new Date(date),
                    count: dateCounts[date],
                };
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
                        ry2: 4, // rounded corners
                        ry1: -4, // compensate for rounded bottom corners
                        clip: "frame", // clip the bottom-most compensated corners
                        fill: 1, // constant so all bars use 1st color in scheme
                    }),
                ],
            });

            containerRef.current.append(plot);
            // Clean up before unmount
            return () => plot.remove();
        }
    }, [applications, width]);

    return <div ref={containerRef} />;
};

export default ApplicationTimeline;
