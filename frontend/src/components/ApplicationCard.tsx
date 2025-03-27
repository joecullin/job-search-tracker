import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Fragment } from "react/jsx-runtime";
import { Application, applicationStatusLabel } from "../api/Application";
import ApplicationForm from "./ApplicationForm";

interface ApplicationDetailProps {
    application: Application | null;
    isFocused: boolean;
    isEditing: boolean;
    focusApplication: (applicationId: string, focused: boolean) => void;
    editingApplication: (applicationId: string, editing: boolean) => void;
}

export default function ApplicationCard({ application, isEditing, isFocused, focusApplication, editingApplication }: ApplicationDetailProps) {
    if (!application){
        return <Card className="applications-application-card">-</Card>;
    }
    return (
        <Card
            border={isEditing ? "primary" : isFocused ? "dark" : ""}
            className="applications-application-card"
            onClick={() => focusApplication(application.id, !isFocused)}
        >
            <Card.Header>
                    {applicationStatusLabel(application.status)}
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    {application.companyName}
                </Card.Title>
                    {
                    !isFocused
                    ? (
                        <Card.Text>
                            {application.role}
                        </Card.Text>
                    )
                    : !isEditing
                        ? (
                            <Fragment>
                                <div>
                                    {application.role}
                                </div>
                                <div>
                                    <b>Source:</b> {application.source}
                                </div>
                                <div>
                                    <b>Notes:</b>
                                    {application.note?.includes("\n") ?
                                    (<p
                                    style={{ // TODO: move to stylesheet
                                        wordWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                        margin: "0 0 0 1rem",
                                        fontStyle: "italic",
                                    }}
                                    >
                                        {application.note}
                                    </p>)
                                    : <span style={{fontStyle: "italic"}}> {/* TODO: move to stylesheet  */}
                                        {application.note}
                                    </span>
                                    }
                                </div>
                            </Fragment>
                        )
                        : (
                        <ApplicationForm
                            application={application}
                        />
                    )
                }
            </Card.Body>
            <Card.Footer>
                {!isEditing &&
                    <Button variant="link"
                        onClick={(event) => {
                            event.stopPropagation();
                            editingApplication(application.id, true);
                    }}>
                        edit
                    </Button>
                }
                {isEditing &&
                    <Fragment>
                        <Button className="float-end" variant="link"
                            onClick={(event) => {
                                event.stopPropagation();
                                editingApplication(application.id, false);
                        }}>
                            save
                        </Button>
                        <Button className="float-end" variant="link"
                            onClick={(event) => {
                                event.stopPropagation();
                                editingApplication(application.id, false);
                        }}>
                            cancel
                        </Button>
                    </Fragment>
                }
            </Card.Footer>
        </Card>
    );
}

