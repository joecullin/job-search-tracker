import { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { Application, getApplications } from "./api/Application";
import ApplicationCalendar from "./components/analytics/ApplicationCalendar";
import ApplicationsVsRejectionsTimeline from "./components/analytics/ApplicationsVsRejectionsTimeline";

import NavBreadcrumbs from "./components/NavBreadcrumbs";

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
            <NavBreadcrumbs currentItemLabel="Analysis" />
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
