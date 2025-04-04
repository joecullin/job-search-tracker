import { useEffect, useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import dayjs from "dayjs";

import { Application, ApplicationFilter, getApplications, saveApplications, newApplication } from "./api/Application";

import ApplicationList from "./components/ApplicationList";

function Screen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [focusedApplications, setFocusedApplications] = useState<string[]>([]);
    const [editingApplications, setEditingApplications] = useState<string[]>([]);
    const [filters, setFilters] = useState<ApplicationFilter[]>(["status:active"]);

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
        const applicationIndex = applications.findIndex((application: Application) => application.id === applicationId);
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
                        Filters:
                        <Dropdown
                            style={{
                                display: "inline-block",
                                paddingLeft: "1rem",
                            }}
                        >
                            <Dropdown.Toggle
                                variant={filters.length ? "secondary" : "outline-secondary"}
                                id="dropdown-basic"
                                size="sm"
                            >
                                Status
                                {filters.includes("status:active")
                                    ? ": active"
                                    : filters.includes("status:inactive")
                                      ? ": inactive"
                                      : filters.includes("status:progressing")
                                        ? ": progressing"
                                        : ""}
                            </Dropdown.Toggle>
                            <Dropdown.Menu variant="primary">
                                <Dropdown.Item
                                    onClick={() => {
                                        setFilters([]);
                                    }}
                                >
                                    All
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setFilters(["status:active"]);
                                    }}
                                >
                                    Active
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setFilters(["status:progressing"]);
                                    }}
                                >
                                    Progressing
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => {
                                        setFilters(["status:inactive"]);
                                    }}
                                >
                                    Inactive
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    <Col>
                        <Button variant="primary" className="float-end" onClick={() => addApplication()}>
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
                            focusApplication={(applicationId, focused) => focusApplication(applicationId, focused)}
                            editingApplication={(applicationId, editing) => editingApplication(applicationId, editing)}
                            saveChanges={(applicationId, changes) => saveChanges(applicationId, changes)}
                            filters={filters}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
