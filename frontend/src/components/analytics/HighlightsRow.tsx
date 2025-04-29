import { Fragment } from "react";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import dayjs from "dayjs";
import { Application, filterApplications } from "../../api/Application";

interface ComponentProps {
    applications: Application[];
}

const HighlightsRow = ({ applications }: ComponentProps) => {
    const computeTotalDays = () => {
        applications.sort((a, b) => a.statusLog[0]?.timestamp?.localeCompare(b.statusLog[0]?.timestamp));
        const startDate = dayjs(applications[0]?.statusLog[0]?.timestamp);
        const endDate = dayjs();
        const totalDays = endDate.diff(startDate, "days");
        return totalDays;
    };

    return (
        <Fragment>
            <Col xs={6} sm={4} style={{ overflowX: "clip", whiteSpace: "nowrap", paddingTop: "1.5rem" }}>
                <Card>
                    <Card.Body style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        <Card.Title style={{ color: "gray", fontSize: "1rem", fontWeight: "normal", margin: 0 }}>
                            Searching:
                        </Card.Title>
                        <span style={{ fontSize: "3rem" }}>{computeTotalDays()}</span> days
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={6} sm={4} style={{ overflowX: "clip", whiteSpace: "nowrap", paddingTop: "1.5rem" }}>
                <Card>
                    <Card.Body style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        <Card.Title style={{ color: "gray", fontSize: "1rem", fontWeight: "normal", margin: 0 }}>
                            Submitted:
                        </Card.Title>
                        <span style={{ fontSize: "3rem" }}>{applications.length}</span> applications
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={6} sm={4} style={{ overflowX: "clip", whiteSpace: "nowrap", paddingTop: "1.5rem" }}>
                <Card>
                    <Card.Body style={{ fontSize: "1rem", fontWeight: "bold" }}>
                        <Card.Title style={{ color: "gray", fontSize: "1rem", fontWeight: "normal", margin: 0 }}>
                            Active:
                        </Card.Title>
                        <span style={{ fontSize: "3rem" }}>
                            {filterApplications(applications, ["status:progressing"]).length}
                        </span>{" "}
                        progressing
                    </Card.Body>
                </Card>
            </Col>
        </Fragment>
    );
};

export default HighlightsRow;
