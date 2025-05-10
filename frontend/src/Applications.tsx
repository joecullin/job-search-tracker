import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import dayjs from "dayjs";

import { Application, ApplicationFilter, getApplications, saveApplications, newApplication } from "./api/Application";
import { inDemoMode } from "./api/Config";
import { useSessionStore } from "./api/Session";
import { useNotificationStore } from "./api/useNotificationStore";

import ApplicationList from "./components/ApplicationList";
import CloseOldApplications from "./components/CloseOldApplications";
import TopBar from "./components/TopBar";

function Screen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [focusedApplications, setFocusedApplications] = useState<string[]>([]);
    const [editingApplications, setEditingApplications] = useState<string[]>([]);
    const [closingOld, setClosingOld] = useState<boolean>(false);
    const [filters, setFilters] = useState<ApplicationFilter[]>(["status:active"]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useSearchParams();
    const hideDemoWarning = useSessionStore((state) => state.hideDemoWarning);
    const setHideDemoWarning = useSessionStore((state) => state.setHideDemoWarning);
    const addNotification = useNotificationStore((state) => state.addNotification);

    const focusApplication = (applicationId: string, focused: boolean) => {
        const focusedIds = focusedApplications.filter((id: string) => id !== applicationId);
        if (focused) {
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

    const saveChanges = async (applicationId: string, application: Application) => {
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
        try {
            await saveApplications(applications);
            addNotification({ notificationType: "success", message: "Saved changes!" });
        } catch (error) {
            console.log(`error saving data!`, error);
            addNotification({ notificationType: "error", message: "Error saving changes." });
        }

        // Close edit mode.
        editingApplication(applicationId, false);
    };

    const addApplication = () => {
        const application = newApplication();
        applications.push(application);
        // Don't save to backend yet. We'll do that when user clicks "save."
        setApplications(applications);
        editingApplication(application.id, true);
    };

    const deleteApplication = async (applicationId: string) => {
        const remainingApplications = applications.filter((app) => app.id !== applicationId);
        setApplications(remainingApplications);
        // Save to backend.
        try {
            await saveApplications(remainingApplications);
            addNotification({ notificationType: "success", message: "Saved changes!" });
        } catch (error) {
            console.log(`error saving data!`, error);
            addNotification({ notificationType: "error", message: "Delete failed. Error saving to server." });
        }
        // Reset edit mode.
        editingApplication(applicationId, true);
    };

    const handleSearchQueryChange = (queryText: string) => {
        setSearchQuery(queryText); // update our own state
        setSearchParams(queryText); // update the browser url
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const allApplications = await getApplications();
                setApplications(allApplications);
            } catch (error) {
                console.log(`error loading data!`, error);
                addNotification({ notificationType: "error", message: "Error fetching data." });
            }
        };

        const searchQuery = searchParams.get("search") || "";
        setSearchQuery(searchQuery);
        if (searchQuery !== "") {
            setFilters([]);
        }
        loadData();
    }, [searchParams, addNotification]);

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
            <TopBar
                currentItemLabel="Applications"
                handleSearchQueryChange={(queryText) => handleSearchQueryChange(queryText)}
                searchQuery={searchQuery}
            />
            {inDemoMode && !hideDemoWarning && (
                // Consider moving this to its own component. For now, we only need it on this page.
                <Alert variant="warning" onClose={() => setHideDemoWarning(true)} dismissible>
                    <Alert.Heading>Demo Mode</Alert.Heading>
                    <ul>
                        <li>Company names and notes have been sanitized.</li>
                        <li>Feel free to try everything, including edit, save, and delete.</li>
                        <li>Your changes won't be permanently saved.</li>
                    </ul>
                </Alert>
            )}
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
                        {searchQuery && (
                            <Button
                                style={{ marginLeft: "1rem" }}
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    handleSearchQueryChange("");
                                }}
                            >
                                {searchQuery}
                                &nbsp;&nbsp;&nbsp; x
                            </Button>
                        )}
                    </Col>
                    <Col>
                        <Dropdown as={ButtonGroup} className="float-end">
                            <Button variant="primary" onClick={() => addApplication()}>
                                New Application
                            </Button>

                            <Dropdown.Toggle split variant="primary" id="dropdown-split-basic" />

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setClosingOld(true)}>Close old applications</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                {closingOld && (
                    <Row style={{ margin: "2rem" }}>
                        <Col>
                            <CloseOldApplications
                                applications={applications}
                                saveChanges={(applicationId, changes) => saveChanges(applicationId, changes)}
                                cancel={() => setClosingOld(false)}
                            />
                        </Col>
                    </Row>
                )}
                <Row>
                    <Col>
                        <ApplicationList
                            applications={applications}
                            focusedApplications={focusedApplications}
                            editingApplications={editingApplications}
                            focusApplication={(applicationId, focused) => focusApplication(applicationId, focused)}
                            editingApplication={(applicationId, editing) => editingApplication(applicationId, editing)}
                            saveChanges={(applicationId, changes) => saveChanges(applicationId, changes)}
                            deleteApplication={(applicationId) => deleteApplication(applicationId)}
                            filters={filters}
                            searchQuery={searchQuery}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
