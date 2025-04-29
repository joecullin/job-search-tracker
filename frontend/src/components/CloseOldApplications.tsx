import { useState } from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import dayjs from "dayjs";

import { Application, filterApplications, applicationStatusLabel, applicationStatusIsProgresssing } from "../api/Application";

interface ApplicationFormProps {
    applications: Application[];
    saveChanges: (applicationId: string, application: Application) => void;
    cancel: () => void;
}

export default function CloseOldApplications({ applications, saveChanges, cancel }: ApplicationFormProps) {
    const [weeksThreshold, setWeeksThreshold] = useState(4);

    // const handleChangeStatus = (value: string) => {
    //     saveChanges({ status: value });
    // };

    const matchingApplications = (): Application[] => {
        const cutoffDate = dayjs()
            .startOf("date")
            .subtract(Math.floor(weeksThreshold * 7), "days");

        return filterApplications(applications, ["status:active"]).filter((app) => {
            if (!app.lastContactDate) {
                return false;
            }
            const lastDate = dayjs(app.lastContactDate);
            return lastDate.isBefore(cutoffDate);
        });
    };

    const performChanges = () => {
        const applicationsToClose = matchingApplications();

        applicationsToClose.forEach((application) => {
            application.status = applicationStatusIsProgresssing(application.status) ? "unresponsive" : "applicationIgnored";
            application.reminderDate = "";
            saveChanges(application.id, application);
        });

        // close this card:
        cancel();
    };

    return (
        <Card border="dark">
            <Card.Body>
                <Card.Title>Close old applications</Card.Title>
                <Form>
                    <Row>
                        <Form.Group as={Row} className="mb-3" controlId="formWeeksSinceLastResponse">
                            <Form.Label column xs={2}>
                                Last contact:
                            </Form.Label>
                            <Col xs={2}>
                                <Form.Select
                                    value={weeksThreshold}
                                    onChange={(event) => {
                                        event.preventDefault();
                                        setWeeksThreshold(parseFloat(event.target.value));
                                    }}
                                >
                                    <option value="1" key="1">
                                        1 week
                                    </option>
                                    <option value="2" key="2">
                                        2 weeks
                                    </option>
                                    <option value="3" key="3">
                                        3 weeks
                                    </option>
                                    <option value="3.5" key="3.5">
                                        3.5 weeks
                                    </option>
                                    <option value="4" key="4">
                                        4 weeks
                                    </option>
                                </Form.Select>
                            </Col>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Label column xs={2}>
                            Included applications:
                        </Form.Label>
                        <Col xs={10} style={{ paddingTop: ".5rem" }}>
                            {matchingApplications().length ? (
                                <ol>
                                    {matchingApplications().map((application) => (
                                        <li key={application.id}>
                                            {application.companyName}
                                            <span style={{ fontStyle: "italic", padding: "1rem" }}>
                                                ({applicationStatusLabel(application.status)})
                                            </span>
                                            {new Date(application.lastContactDate).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                "No matching applications. Try a shorter threshold?"
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button
                                variant="danger"
                                className="float-end"
                                style={{ margin: ".5rem" }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    performChanges();
                                }}
                            >
                                Close these applications
                            </Button>
                            <Button
                                variant="secondary"
                                className="float-end"
                                style={{ margin: ".5rem" }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    cancel();
                                }}
                            >
                                cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
}
