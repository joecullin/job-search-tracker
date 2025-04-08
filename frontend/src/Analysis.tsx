import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { Application, getApplications } from "./api/Application";
import ApplicationCalendar from "./components/analytics/ApplicationCalendar";
import ApplicationsVsRejectionsTimeline from "./components/analytics/ApplicationsVsRejectionsTimeline";

import TopNav from "./components/TopNav";

function Screen() {
    const [applications, setApplications] = useState<Application[]>([]);

    const loadData = async () => {
        const allApplications = await getApplications();
        setApplications(allApplications);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div>
            <TopNav currentItemLabel="Analysis" />
            <Container className="mt-4">
                <Row>
                    <Col xs={12}>
                        <b>Applications</b>
                        {applications && <ApplicationCalendar applications={applications} />}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} style={{ paddingTop: "1rem" }}>
                        <b>Applications &amp; rejections</b>
                        {applications && <ApplicationsVsRejectionsTimeline applications={applications} />}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
