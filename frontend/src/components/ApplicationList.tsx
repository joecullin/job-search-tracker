import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem";

import type { Application } from "../api/Application";

interface ApplicationListProps {
    applications: Application[];
    onApplicationClick: (application: Application) => void;
}

export default function ApplicationList({
    applications,
    onApplicationClick,
}: ApplicationListProps) {
    return (
        <div>
            <ListGroup>
                {applications.map((application) => {
                    return (
                        <ListGroupItem
                            key={application.id}
                            action
                            onClick={() => onApplicationClick(application)}
                        >
                            {`${application.companyName}: ${application.role}`}
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
        </div>
    );
}
