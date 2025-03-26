import Card from "react-bootstrap/Card";
import { Application, applicationStatusLabel } from "../api/Application";

interface ApplicationDetailProps {
    application: Application | null;
}

export default function ApplicationDetail({ application }: ApplicationDetailProps) {
    return (
        <Card>
            <Card.Body>
                <Card.Title>
                    {application
                        ? `${application.companyName} ${application.role}`
                        : "Please select an application on the left"}
                </Card.Title>
                <Card.Text>
                    {`Status: ${application ? applicationStatusLabel(application.status) : "--"}`}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}
