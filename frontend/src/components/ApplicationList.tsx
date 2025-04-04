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
    const cardWidth = (size: string, applicationId: string) => {
        if (focusedApplications.includes(applicationId)) {
            return 12;
        } else {
            return size === "md" ? 2 : 6;
        }
    };

    return (
        <Row>
            {applications
                .sort((a, b) => {
                    const firstContact = b.firstContactDate.localeCompare(a.firstContactDate);
                    if (firstContact !== 0) {
                        return firstContact;
                    }
                    // maybe sub-sort by status timestamp here?
                    return 0;
                })
                .map((application) => (
                    <Col
                        key={application.id}
                        sm={cardWidth("sm", application.id)}
                        md={cardWidth("md", application.id)}
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
