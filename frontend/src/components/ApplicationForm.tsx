import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Application } from "../api/Application";
import { ApplicationStatusDefs, applicationStatusLabel } from "../api/Application";

interface ApplicationFormProps {
    application: Application;
    saveChanges: (changes: object) => void;
}

export default function ApplicationForm({ application, saveChanges }: ApplicationFormProps) {
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
                        <Form.Control
                            value={application.source}
                            placeholder="example: Indeed"
                            onChange={(event) => {
                                event.preventDefault();
                                handleChangeSource(event.target.value);
                            }}
                        />
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
