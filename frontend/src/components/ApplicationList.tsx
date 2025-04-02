import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import type { Application } from "../api/Application";
import ApplicationCard from "./ApplicationCard";

interface ApplicationListProps {
    applications: Application[];
    editingApplications: string[];
    focusedApplications: string[];
    focusApplication: (applicationId: string, focused: boolean) => void;
    editingApplication: (applicationId: string, focused: boolean) => void;
    saveChanges: (applicationId: string, application: Application) => void;
}

export default function ApplicationList({
    applications,
    editingApplications,
    focusedApplications,
    focusApplication,
    editingApplication,
    saveChanges,
}: ApplicationListProps) {
    // When a card is focused, make it twice as wide.
    const adjustCardWidth = (cols: number, applicationId: string) =>
        focusedApplications.includes(applicationId) ? cols * 2 : cols;

    return (
        <Row>
            {applications.map((application) => (
                <Col
                    key={application.id}
                    sm={adjustCardWidth(6, application.id)}
                    md={adjustCardWidth(2, application.id)}
                >
                    <ApplicationCard
                        key={application.id}
                        application={application}
                        isEditing={editingApplications.includes(application.id)}
                        isFocused={focusedApplications.includes(application.id)}
                        focusApplication={focusApplication}
                        editingApplication={editingApplication}
                        saveChanges={saveChanges}
                    />
                </Col>
            ))}
        </Row>
    );
}
