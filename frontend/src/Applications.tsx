import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import dayjs from "dayjs";

import { Application, getApplications, saveApplications, newApplication } from "./api/Application";

import ApplicationList from "./components/ApplicationList";

function Screen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [focusedApplications, setFocusedApplications] = useState<string[]>([]);
    const [editingApplications, setEditingApplications] = useState<string[]>([]);

    const focusApplication = (applicationId: string, focused: boolean) => {
        const focusedIds = focusedApplications.filter((id: string) => id !== applicationId);
        const isEditing = editingApplications.includes(applicationId);
        if (focused || isEditing) {
            focusedIds.push(applicationId);
        }
        setFocusedApplications(focusedIds);
    };

    const editingApplication = (applicationId: string, editing: boolean) => {
        const editingIds = editingApplications.filter((id: string) => id !== applicationId);
        if (editing) {
            editingIds.push(applicationId);
        }
        setEditingApplications(editingIds);
        focusApplication(applicationId, editing);
    };

    const saveChanges = (applicationId: string, application: Application) => {
        // Add a record to statusLog, if this is a new application or if status changed.
        if (
            application.statusLog.length === 0 ||
            application.statusLog[application.statusLog.length - 1].status !== application.status
        ) {
            application.statusLog.push({
                status: application.status,
                timestamp: new Date().toISOString(),
            });
        }

        // Update our local copy.
        const applicationIndex = applications.findIndex(
            (application: Application) => application.id === applicationId,
        );
        if (applicationIndex > -1) {
            applications[applicationIndex] = application;
            setApplications(applications);
        }

        // Save to backend.
        saveApplications(applications);

        // Close edit mode.
        editingApplication(applicationId, false);
    };

    const addApplication = () => {
        const application = newApplication();
        applications.push(application);
        setApplications(applications);
        editingApplication(application.id, true);
    };

    const loadData = async () => {
        const allApplications = await getApplications();
        setApplications(allApplications);
    };

    useEffect(() => {
        loadData();
    }, []);

    // Some rough counts for now, until I add a better stats view.
    const startOfToday = dayjs().startOf("date");
    const threeDaysAgo = dayjs().startOf("date").subtract(3, "day");
    const todayCount = applications.filter((app) => {
        if (app.statusLog.length) {
            const createDate = dayjs(app.statusLog[0].timestamp);
            return createDate.isAfter(startOfToday);
        }
        return false;
    }).length;
    const lastThreeDaysCount = applications.filter((app) => {
        if (app.statusLog.length) {
            const createDate = dayjs(app.statusLog[0].timestamp);
            return createDate.isAfter(threeDaysAgo);
        }
        return false;
    }).length;

    return (
        <div>
            <div>
                <h1 className="text-center mt-4">Applications</h1>
            </div>
            <Container className="mt-4">
                <Row>
                    <Col>
                        <b>Today: {todayCount}</b>. past 3 days: {lastThreeDaysCount}.
                    </Col>
                    <Col>
                        <Button
                            variant="primary"
                            className="float-end"
                            onClick={() => addApplication()}
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
                            focusApplication={(applicationId, focused) =>
                                focusApplication(applicationId, focused)
                            }
                            editingApplication={(applicationId, editing) =>
                                editingApplication(applicationId, editing)
                            }
                            saveChanges={(applicationId, changes) =>
                                saveChanges(applicationId, changes)
                            }
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
