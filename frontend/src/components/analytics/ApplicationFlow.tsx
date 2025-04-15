import ReactECharts from 'echarts-for-react';
import { Application, ApplicationStatusId, ApplicationStatusDefs, applicationStatusLabel } from "../../api/Application";

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
        // let links = [
        //         // { source: 'dummy1', target: "dummy2", value: 0 },
        //           {
        //             source: "Applied (20)",
        //             target: "Application rejected",
        //             value: 5
        //           },
        //           {
        //             source: "Applied (20)",
        //             target: "Recruiter screen",
        //             value: 3
        //           },
        //           {
        //             source: "Recruiter outreach",
        //             target: "Recruiter screen",
        //             value: 1
        //           },
        //           {
        //             source: "Recruiter screen",
        //             target: "Application rejected",
        //             value: 4
        //           },
        //           {
        //             source: "Applied (20)",
        //             target: "Application ignored",
        //             value: 8
        //           },
        //         ];

        interface StatusTransition {
            source: ApplicationStatusId,
            target: ApplicationStatusId,
            value: number,
        };
        const statusTransitions = [] as StatusTransition[];

        applications.forEach(application => {
            for (let i=0; i<application.statusLog.length; i++){
                const status = application.statusLog[i].status;
                let nextStatus: undefined | ApplicationStatusId;
                if (application.statusLog.length === 1){
                    nextStatus = undefined;
                }
                else if (i+1 < application.statusLog.length){
                    nextStatus = application.statusLog[i+1].status;
                }
                if (nextStatus){
                    const transitionIndex = statusTransitions.findIndex(transition => transition.source === status && transition.target === nextStatus);
                    if (transitionIndex > -1){
                        statusTransitions[transitionIndex].value++;
                    }
                    else{
                        statusTransitions.push({
                            source: status,
                            target: nextStatus,
                            value: 1,
                        });
                    }
                }
            }
        });
        // console.log(`statusTransitions: ${JSON.stringify(statusTransitions, null, 2)}`);

        const statusConfig = ApplicationStatusDefs.filter(statusDef => statusTransitions.some(transition => transition.source === statusDef.id || transition.target === statusDef.id))
        .map(statusDef => {
            return {
                id: statusDef.id,
            };
        });
        // console.log(`statusConfig: ${JSON.stringify(statusConfig, null, 2)}`);

        return {
            series: {
                type: 'sankey',
                // layout: 'none',
                layoutIterations: 32,
                nodeGap: 24,
                nodeWidth: 32,
                emphasis: {
                  focus: 'adjacency'
                },
                data: statusConfig.map(config => {
                    return {
                        name: applicationStatusLabel(config.id),
                    };
                }),
                // [
                // // https://github.com/apache/echarts/issues/19375 has tip about these dummy points to reduce overlap
                //   { name: 'dummy1', itemStyle: {color: 'transparent'}, label: {show: false} },
                //   { name: 'dummy2', itemStyle: {color: 'transparent'}, label: {show: false} },

                //   { name: "Recruiter outreach" },
                //   { name: "Applied (20)" },
                //   { name: "Recruiter screen" },
                //   { name: "Application rejected" },
                //   { name: "Application ignored" },
                // ],
                links: statusTransitions.map(transition => {
                    return {
                        ...transition,
                        source: applicationStatusLabel(transition.source),
                        target: applicationStatusLabel(transition.target),
                    };
                }),
              }
          };
    };

    return <ReactECharts
        style={{border: "solid 1px lightgray"}}
        option={getOption()}
        notMerge={true}
        lazyUpdate={true}
        opts={{
            renderer: 'svg',
            // height: 1000,
        }}
    />;
};

export default ApplicationFlow;
