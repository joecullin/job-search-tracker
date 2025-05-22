import { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import JobSourcesContext from "../api/JobSourcesContext";
import { Application } from "../api/Application";
import { ApplicationStatusDefs, applicationStatusLabel } from "../api/Application";

interface ApplicationFormProps {
    application: Application;
    saveChanges: (changes: object) => void;
}

export default function ApplicationForm({ application, saveChanges }: ApplicationFormProps) {
    const [newSource, setNewSource] = useState("");
    const { jobSources, setJobSources } = useContext(JobSourcesContext);

    const handleChangeNote = (value: string) => {
        const newValue = value ? value.slice(0, 50000) : ""; //TODO: more explicit validation and feedback.
        saveChanges({ note: newValue });
    };

    const handleChangeRole = (value: string) => {
        saveChanges({ role: value });
    };

    const handleChangeCompany = (value: string) => {
        saveChanges({ companyName: value });
    };

    const handleChangeSource = (value: string) => {
        saveChanges({ source: value });
    };

    const handleChangeNewSource = (value: string) => {
        setNewSource(value);
    };

    const addNewSource = () => {
        // update sources list:
        const sources = jobSources;
        sources.push(newSource);
        sources.sort((a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()));
        setJobSources(sources);
        // update this application:
        saveChanges({ source: newSource });
        // reset the "add source" form:
        setNewSource("");
    };

    const handleChangeStatus = (value: string) => {
        saveChanges({ status: value });
    };

    const handleChangeFirstContact = (value: string) => {
        saveChanges({ firstContactDate: value });
    };

    const handleChangeLastContact = (value: string) => {
        saveChanges({ lastContactDate: value });
    };

    const handleChangeReminderDate = (value: string) => {
        saveChanges({ reminderDate: value });
    };

    const notesInputHeight = (note: string) => {
        const maxHeight = 20;
        let height = 1;

        const charCount = note.length;
        const lineBreakCount = [...note.matchAll(/$/gm)].length;
        if (lineBreakCount > 0) {
            height = lineBreakCount;
        } else if (charCount > 80) {
            height = Math.ceil(charCount / 80);
        }
        if (height > maxHeight) {
            height = maxHeight;
        }
        return height;
    };

    return (
        <Form>
            <Row>
                <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formCompany">
                        <Form.Label>Company</Form.Label>
                        <Form.Control
                            autoFocus={application.companyName === ""}
                            value={application.companyName}
                            placeholder="example: Acme Inc"
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeCompany(event.target.value);
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            value={application.role}
                            placeholder="example: Senior Eng Mgr"
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeRole(event.target.value);
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                            value={application.status}
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeStatus(event.target.value);
                            }}
                        >
                            <option value="" key="blank">
                                Choose a status
                            </option>
                            {ApplicationStatusDefs.map((statusDef) => {
                                const statusId = statusDef.id;
                                return (
                                    <option value={statusId} key={statusId}>
                                        {applicationStatusLabel(statusId)}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col xs={6}>
                    <Form.Group className="mb-3" controlId="formSource">
                        <Form.Label>Source</Form.Label>
                        {/* Make it easy to re-use a previous source. */}
                        <Form.Select
                            value={application.source}
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeSource(event.target.value);
                            }}
                        >
                            <option value="" key="blank">
                                Choose a source
                            </option>
                            {jobSources
                                .filter((source) => source !== "other")
                                .map((source) => {
                                    return (
                                        <option value={source} key={source}>
                                            {source}
                                        </option>
                                    );
                                })}
                            <option value="other" key="other">
                                other
                            </option>
                        </Form.Select>
                        {/* Define a new source. */}
                        {application.source === "other" && (
                            <Form.Group
                                className="mb-3"
                                controlId="formNewSource"
                                as={Row}
                                style={{
                                    padding: "0.5rem",
                                    margin: "1rem",
                                    border: "1px solid white",
                                }}
                            >
                                <Form.Label column sm={3}>
                                    New source:
                                </Form.Label>
                                <Col sm={7}>
                                    <Form.Control
                                        value={newSource}
                                        placeholder="example: Indeed"
                                        onChange={(event) => {
                                            event.preventDefault();
                                            handleChangeNewSource(event.target.value);
                                        }}
                                    />
                                </Col>
                                <Col sm={2}>
                                    <Button
                                        variant="secondary"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            addNewSource();
                                        }}
                                    >
                                        add
                                    </Button>
                                </Col>
                            </Form.Group>
                        )}
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3" controlId="formNotes">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={notesInputHeight(application.note)}
                    value={application.note}
                    onChange={(event) => {
                        event.preventDefault();
                        handleChangeNote(event.target.value);
                    }}
                />
            </Form.Group>
            <Row>
                <Col xs={4}>
                    <Form.Group className="mb-3" controlId="formFirstContact">
                        <Form.Label>First Contact</Form.Label>
                        <Form.Control
                            value={application.firstContactDate}
                            type="date"
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeFirstContact(event.target.value);
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs={4}>
                    <Form.Group className="mb-3" controlId="formLastContact">
                        <Form.Label>Last Contact</Form.Label>
                        <Form.Control
                            value={application.lastContactDate}
                            type="date"
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeLastContact(event.target.value);
                            }}
                        />
                    </Form.Group>
                </Col>
                <Col xs={4}>
                    <Form.Group className="mb-3" controlId="formReminder">
                        <Form.Label>Reminder</Form.Label>
                        <Form.Control
                            value={application.reminderDate}
                            type="date"
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeReminderDate(event.target.value);
                            }}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}
