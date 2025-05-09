import { useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Fragment } from "react/jsx-runtime";
import { Application, applicationStatusColor, ApplicationStatusId, applicationStatusLabel } from "../api/Application";
import ApplicationForm from "./ApplicationForm";
import RelativeDatetime from "./RelativeDatetime";

interface ApplicationDetailProps {
    application: Application | null;
    isFocused: boolean;
    isEditing: boolean;
    focusApplication: (applicationId: string, focused: boolean) => void;
    editingApplication: (applicationId: string, editing: boolean) => void;
    saveChanges: (applicationId: string, application: Application) => void;
    deleteApplication: (applicationId: string) => void;
}

export default function ApplicationCard({
    application,
    saveChanges,
    isEditing,
    isFocused,
    focusApplication,
    editingApplication,
    deleteApplication,
}: ApplicationDetailProps) {
    const [draft, setDraft] = useState<Application | null>(application);
    const cardRef = useRef<HTMLDivElement | null>(null);

    if (!application || !draft) {
        return <Card className="applications-application-card">-</Card>;
    }

    const draftChanges = (changes: object) => {
        if (draft) {
            setDraft({
                ...draft,
                ...changes,
            });
        }
    };

    const scrollCardIntoView = () => {
        if (cardRef?.current) {
            cardRef.current.scrollIntoView();
        }
    };

    return (
        <Card
            border={isEditing ? "primary" : isFocused ? "dark" : ""}
            className="applications-application-card"
            // click anywhere in collapsed card to expand:
            onClick={() => !isEditing && !isFocused && focusApplication(application.id, !isFocused)}
            ref={cardRef}
        >
            <Card.Body>
                <Card.Title
                    style={{
                        overflowX: "clip",
                        whiteSpace: "nowrap",
                    }}
                >
                    {application.companyName !== ""
                        ? application.companyName
                        : `New application (${application.id.split("-")[0]})`}

                    {isFocused && !isEditing && (
                        // For expanded card: click the "▲" button to collapse.
                        // if isEditing, then use the "cancel" button.
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="float-end"
                            onClick={() => {
                                focusApplication(application.id, false);
                            }}
                        >
                            ▲
                        </Button>
                    )}
                </Card.Title>
                {!isEditing && (
                    <div>
                        <Fragment>
                            <div>{application.role || "-"}</div>
                            <div
                                style={{
                                    fontSize: ".8rem",
                                }}
                            >
                                <span
                                    style={{
                                        fontStyle: "italic",
                                        color: applicationStatusColor(application.status),
                                    }}
                                >
                                    {applicationStatusLabel(application.status)}{" "}
                                </span>
                                {application.reminderDate && (
                                    <span className="float-end">
                                        ⏰ <RelativeDatetime label="reminder:" timestamp={application.reminderDate} />
                                    </span>
                                )}
                            </div>
                        </Fragment>
                        {isFocused && (
                            <Fragment>
                                <div style={{ marginTop: ".5rem" }}>
                                    <b>Source:</b> {application.source}
                                </div>
                                <div style={{ marginTop: ".5rem" }}>
                                    <b>Notes:</b>
                                    {application.note?.includes("\n") ? (
                                        <p
                                            style={{
                                                wordWrap: "break-word",
                                                whiteSpace: "pre-wrap",
                                                margin: "0 0 0 1rem",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {application.note}
                                        </p>
                                    ) : (
                                        <span
                                            style={{
                                                margin: "0 0 0 0.25rem",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {application.note}
                                        </span>
                                    )}
                                </div>
                                <div style={{ marginTop: ".5rem" }}>
                                    <b>History:</b>
                                    <ul>
                                        {application.statusLog.map(
                                            (
                                                logEntry: {
                                                    status: ApplicationStatusId;
                                                    timestamp: string;
                                                },
                                                i: number,
                                            ) => {
                                                return (
                                                    <li key={i}>
                                                        {new Date(logEntry.timestamp).toLocaleDateString("en-US", {
                                                            weekday: "long",
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                        {" - "}
                                                        {applicationStatusLabel(logEntry.status)}
                                                    </li>
                                                );
                                            },
                                        )}
                                    </ul>
                                </div>
                            </Fragment>
                        )}
                    </div>
                )}
                {isEditing && (
                    <div
                        style={{
                            backgroundColor: "lightgray",
                            padding: "1rem",
                        }}
                    >
                        <ApplicationForm application={draft} saveChanges={draftChanges} />
                    </div>
                )}
            </Card.Body>
            <Card.Footer style={{ padding: ".1rem" }}>
                {!isEditing && (
                    <Button
                        variant="link"
                        onClick={(event) => {
                            event.stopPropagation();
                            editingApplication(application.id, true);
                            scrollCardIntoView();
                        }}
                    >
                        edit
                    </Button>
                )}
                {isEditing && (
                    <Fragment>
                        <Button
                            variant="primary"
                            className="float-end"
                            style={{ margin: ".5rem" }}
                            onClick={(event) => {
                                event.stopPropagation();
                                saveChanges(application.id, draft);
                            }}
                        >
                            save changes
                        </Button>
                        <Button
                            variant="secondary"
                            className="float-end"
                            style={{ margin: ".5rem" }}
                            onClick={(event) => {
                                event.stopPropagation();
                                editingApplication(application.id, false);
                            }}
                        >
                            cancel
                        </Button>
                        {application.statusLog.length > 0 && ( // no delete button for new (not-yet-saved) applications.
                            <Button
                                variant="danger"
                                className="float-end"
                                style={{ margin: ".5rem" }}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    deleteApplication(application.id);
                                }}
                            >
                                delete
                            </Button>
                        )}
                    </Fragment>
                )}
            </Card.Footer>
        </Card>
    );
}
