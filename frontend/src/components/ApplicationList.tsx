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
}

export default function ApplicationList({
    applications,
    editingApplications,
    focusedApplications,
    focusApplication,
    editingApplication,
}: ApplicationListProps) {
    return (
        <Row>
            {applications.map((application) => (
                <Col
                    key={application.id}
                    xs={focusedApplications.includes(application.id) ? 6 : 3}
                >
                    <ApplicationCard
                        key={application.id}
                        application={application}
                        isEditing={editingApplications.includes(application.id)}
                        isFocused={focusedApplications.includes(application.id)}
                        focusApplication={focusApplication}
                        editingApplication={editingApplication}
                        />
                </Col>
            ))}
        </Row>
    );
}
