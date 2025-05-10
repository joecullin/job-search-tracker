import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { Application, getApplications } from "./api/Application";
import HighlightsRow from "./components/analytics/HighlightsRow";
import ApplicationCalendar from "./components/analytics/ApplicationCalendar";
import ApplicationsVsRejectionsTimeline from "./components/analytics/ApplicationsVsRejectionsTimeline";
import ApplicationProgress from "./components/analytics/ApplicationProgress";
import ApplicationFlow from "./components/analytics/ApplicationFlow";
import TopBar from "./components/TopBar";
import { useNotificationStore } from "./api/useNotificationStore";

function Screen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        const loadData = async () => {
            try {
                const allApplications = await getApplications();
                setApplications(allApplications);
            } catch (error) {
                console.log(`error loading data!`, error);
                addNotification({ notificationType: "error", message: "Error fetching data." });
            }
        };
        loadData();
    }, [addNotification]);

    return (
        <div>
            <TopBar currentItemLabel="Analysis" />
            <Container className="mt-4">
                <Row>
                    <Col xs={12} sm={6}>
                        <Row>
                            {applications && <HighlightsRow applications={applications} />}
                            <Col xs={12} style={{ paddingTop: "1rem" }}>
                                <b>Applications</b>
                                {applications && <ApplicationCalendar applications={applications} />}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} style={{ paddingTop: "1rem" }}>
                                <b>Applications vs. rejections</b>
                                {applications && <ApplicationsVsRejectionsTimeline applications={applications} />}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={12} sm={6}>
                        <b>Progress</b>
                        {applications && <ApplicationProgress applications={applications} />}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <b>Flow</b>
                        {applications && <ApplicationFlow applications={applications} />}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
