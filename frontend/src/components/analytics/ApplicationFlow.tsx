import ReactECharts from "echarts-for-react";
import {
    Application,
    ApplicationStatusId,
    ApplicationStatusDefs,
    applicationStatusLabel,
    applicationStatusColor,
    applicationStatusIsActive,
    applicationStatusIsProgresssing,
} from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

// First draft of Sankey with ECharts.
// So far, I'm impressed with the library but unimpressed by the docs & tutorials.
// But it's clear enough that I've been able to learn from examples.
// TODO:
//  - dummy records to improve spacing?
//  - explore levels: can I force "middle" statuses to middle, and only have "terminal" statuses on right?
//  - colors
//  - display counts?
//  - show every company as a leaf node?
//  - clean up (comments, console.logs, etc.)

const ApplicationFlow = ({ applications }: ComponentProps) => {
    const getOption = () => {
        interface StatusTransition {
            source: ApplicationStatusId | string;
            target: ApplicationStatusId | string;
            value: number;
        }
        const statusTransitions = [] as StatusTransition[];

        const fakeExtraStatuses = new Set<string>();
        applications.forEach((application) => {
            // Unique leaf node for every application. Interesting, but too packed.
            // fakeExtraStatuses.add(application.companyName);
            // statusTransitions.push({
            //     source: application.companyName,
            //     target: application.statusLog[0].status,
            //     value: 1,
            // });

            const countTransition = (source: ApplicationStatusId | string, target: ApplicationStatusId | string) => {
                const transitionIndex = statusTransitions.findIndex(
                    (transition) => transition.source === source && transition.target === target,
                );
                if (transitionIndex > -1) {
                    statusTransitions[transitionIndex].value++;
                } else {
                    statusTransitions.push({
                        source,
                        target,
                        value: 1,
                    });
                }
            };

            for (let i = 0; i < application.statusLog.length; i++) {
                const status = application.statusLog[i].status;
                let nextStatus: undefined | ApplicationStatusId;
                if (application.statusLog.length === 1) {
                    nextStatus = undefined;
                } else if (i + 1 < application.statusLog.length) {
                    nextStatus = application.statusLog[i + 1].status;
                }
                if (nextStatus) {
                    countTransition(status, nextStatus);
                } else {
                    // no nextStatus
                    let fakeNextStatus: string | undefined;
                    if (applicationStatusIsProgresssing(status)) {
                        fakeNextStatus = "progressing";
                    } else if (applicationStatusIsActive(status)) {
                        fakeNextStatus = "no response yet";
                    }
                    if (fakeNextStatus) {
                        fakeExtraStatuses.add(fakeNextStatus);
                        countTransition(status, fakeNextStatus);
                    }
                }
            }
        });
        // console.log(`statusTransitions: ${JSON.stringify(statusTransitions, null, 2)}`);

        interface StatusConfig {
            id: ApplicationStatusId | undefined;
            label: string;
            color: string;
        }

        const statusConfig: StatusConfig[] = ApplicationStatusDefs.filter((statusDef) =>
            statusTransitions.some((transition) => transition.source === statusDef.id || transition.target === statusDef.id),
        ).map((statusDef) => {
            return {
                id: statusDef.id,
                label: applicationStatusLabel(statusDef.id),
                color: applicationStatusColor(statusDef.id),
            };
        });
        if (fakeExtraStatuses.size) {
            [...fakeExtraStatuses].forEach((fakeStatus) => {
                statusConfig.push({
                    id: "offered",
                    label: fakeStatus,
                    color: "#fe9a00", // amber 500
                });
            });
        }
        // console.log(`statusConfig: ${JSON.stringify(statusConfig, null, 2)}`);

        return {
            tooltip: {
                trigger: "item",
                triggerOn: "mousemove",
            },
            series: {
                type: "sankey",
                layoutIterations: 100,
                nodeGap: 8,
                lineStyle: {
                    color: "gradient",
                    curveness: 0.5,
                },
                // Saving some options I played with:
                // layout: 'none',
                // lineStyle: { curveness: .8 },
                // nodeWidth: 32,
                // emphasis: { focus: "adjacency" },

                data: [
                    statusConfig
                        // TODO (maybe): custom sort statusConfig (like below) to minimize overlap?
                        //  - I liked this slightly better, but I don't want to hardcode this list of transitions.
                        //  - If I do that, remember to also set layoutIterations to zero.
                        // [
                        //     { "id": "recruiterOutreach", "label": "recruiter outreach" },
                        //     { "id": "applied", "label": "applied" },
                        //     { "id": "interview3", "label": "interview #3" },
                        //     { "id": "interview2", "label": "interview #2" },
                        //     { "id": "interview1", "label": "interview #1" },
                        //     { "id": "initialScreen", "label": "initial screen" },
                        //     { "id": "offered", "label": "progressing" },
                        //     { "id": "withdrew", "label": "withdrew myself" },
                        //     { "id": "unresponsive", "label": "stopped responding" },
                        //     { "id": "rejected", "label": "rejected" },
                        //     { "id": "applicationRejected", "label": "application rejected" },
                        //     { "id": "offered", "label": "no response yet" },
                        //     { "id": "applicationIgnored", "label": "application ignored" },
                        // ]
                        .map((config) => {
                            return {
                                name: config.label,
                                itemStyle: {
                                    color: config.color,
                                },
                            };
                        }),

                    // https://github.com/apache/echarts/issues/19375 has tip to reduce overlap:
                    // Add a few transparent dummy points. Also set a bigger nodegap (above).
                    Array.from({ length: 2 }, (_, i) => {
                        return { name: `dummy${i}`, itemStyle: { color: "transparent" }, label: { show: false } };
                    }),
                ].flat(),
                links: [
                    statusTransitions.map((transition) => {
                        return {
                            ...transition,
                            source: applicationStatusLabel(transition.source),
                            target: applicationStatusLabel(transition.target),
                        };
                    }),
                ].flat(),
            },
        };
    };

    return (
        <ReactECharts
            style={{
                border: "solid 1px lightgray",
                height: "500px",
            }}
            option={getOption()}
            notMerge={true}
            lazyUpdate={true}
            opts={{
                renderer: "svg",
            }}
        />
    );
};

export default ApplicationFlow;
