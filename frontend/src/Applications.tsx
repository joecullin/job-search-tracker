import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { Application, getApplications } from "./api/Application";

import ApplicationList from "./components/ApplicationList";


function Screen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [focusedApplications, setFocusedApplications] = useState<string[]>([]);
    const [editingApplications, setEditingApplications] = useState<string[]>([]);

    const focusApplication = (applicationId: string, focused: boolean) => {
        const focusedIds = focusedApplications.filter((id: string) => id !== applicationId);
        if (focused){
            focusedIds.push(applicationId);
        }
        setFocusedApplications(focusedIds);
    };

    const editingApplication = (applicationId: string, editing: boolean) => {
        const editingIds = editingApplications.filter((id: string) => id !== applicationId);
        if (editing){
            editingIds.push(applicationId);
        }
        setEditingApplications(editingIds);
        focusApplication(applicationId, editing);
    };

    useEffect(() => {
        const allApplications = getApplications();
        setApplications(allApplications);
    }, []);

    return (
        <div>
            <div>
                <h1 className="text-center mt-4">Applications</h1>
            </div>
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Button
                            variant="primary"
                            className="float-end"
                        >
                            New application
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ApplicationList
                            applications={applications}
                            focusedApplications={focusedApplications}
                            editingApplications={editingApplications}
                            focusApplication={(applicationId, focused) => focusApplication(applicationId, focused) }
                            editingApplication={(applicationId, editing) => editingApplication(applicationId, editing) }
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
