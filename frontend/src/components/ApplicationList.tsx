import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Application, ApplicationFilter, filterApplications } from "../api/Application";
import ApplicationCard from "./ApplicationCard";
import { Fragment } from "react/jsx-runtime";

interface ApplicationListProps {
    applications: Application[];
    editingApplications: string[];
    focusedApplications: string[];
    focusApplication: (applicationId: string, focused: boolean) => void;
    editingApplication: (applicationId: string, focused: boolean) => void;
    saveChanges: (applicationId: string, application: Application) => void;
    deleteApplication: (applicationId: string) => void;
    filters: ApplicationFilter[];
    searchQuery: string;
}

export default function ApplicationList({
    applications,
    editingApplications,
    focusedApplications,
    focusApplication,
    editingApplication,
    saveChanges,
    deleteApplication,
    filters,
    searchQuery,
}: ApplicationListProps) {
    // When a card is focused, make it twice as wide.
    const cardWidth = (size: string, applicationId: string) => {
        if (focusedApplications.includes(applicationId)) {
            return 12;
        } else {
            return size === "md" ? 2 : 6;
        }
    };

    const filteredApplications = filterApplications(applications, filters, searchQuery);

    // Show the "new application" form for a not-yet-saved application, even if it doesn't match filters.
    applications
        .filter(
            (app) =>
                app.statusLog.length === 0 && // no status yet (never saved)
                editingApplications.includes(app.id) && // edit form is open
                !filteredApplications.find((filteredApp) => app.id === filteredApp.id), // filters would've excluded it
        )
        .forEach((app) => {
            filteredApplications.unshift(app);
        });

    return (
        <Fragment>
            <Row>
                <Col>
                    {filters.length > 0 || searchQuery !== ""
                        ? `Filtered to ${filteredApplications.length} of ${applications.length} total applications.`
                        : `Showing all ${applications.length} applications.`}
                </Col>
            </Row>
            <Row>
                {filteredApplications
                    .sort((a, b) => {
                        const firstContact = b.firstContactDate.localeCompare(a.firstContactDate);
                        if (firstContact !== 0) {
                            return firstContact;
                        }
                        // sub-sort by status timestamp
                        const statusB = b.statusLog[0]?.timestamp;
                        const statusA = a.statusLog[0]?.timestamp;
                        if (statusA && statusB) {
                            return statusB.localeCompare(statusA);
                        } else if (statusA) {
                            return 1;
                        } else if (statusB) {
                            return -1;
                        }
                        return 0;
                    })
                    .map((application) => (
                        <Col key={application.id} sm={cardWidth("sm", application.id)} md={cardWidth("md", application.id)}>
                            <ApplicationCard
                                key={application.id}
                                application={application}
                                isEditing={editingApplications.includes(application.id)}
                                isFocused={focusedApplications.includes(application.id)}
                                focusApplication={focusApplication}
                                editingApplication={editingApplication}
                                saveChanges={saveChanges}
                                deleteApplication={deleteApplication}
                            />
                        </Col>
                    ))}
            </Row>
        </Fragment>
    );
}
