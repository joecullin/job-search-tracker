import { useEffect, useState, Fragment } from "react";
import { useNavigate, Link } from "react-router";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Notifications from "./Notifications";

interface ComponentProps {
    currentItemLabel: string;
    handleSearchQueryChange?: (queryText: string) => void;
    searchQuery?: string;
}

const TopBar = ({ currentItemLabel, handleSearchQueryChange, searchQuery }: ComponentProps) => {
    const [searchTextRaw, setSearchTextRaw] = useState<string>("");
    const navigate = useNavigate();

    const searchApplications = () => {
        const searchTextCleaned = searchTextRaw ? searchTextRaw.trim() : "";
        if (handleSearchQueryChange) {
            // If we're already on a page that cares about search box state, update that
            handleSearchQueryChange(searchTextCleaned);
        }
        let searchUrl = "/Applications?mode=search";
        if (searchTextCleaned !== "") {
            searchUrl += "&search=" + encodeURIComponent(searchTextCleaned);
        }
        navigate(searchUrl);
    };

    useEffect(() => {
        if (searchQuery !== undefined) {
            setSearchTextRaw(searchQuery);
        }
    }, [searchQuery]);

    return (
        <Fragment>
            <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top" className="justify-content-between">
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" active={currentItemLabel === "Home"}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/Applications" active={currentItemLabel === "Applications"}>
                            Applications
                        </Nav.Link>
                        <Nav.Link as={Link} to="/Analysis" active={currentItemLabel === "Analysis"}>
                            Analysis
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Form
                    style={{ marginRight: "1rem" }}
                    onSubmit={(event) => {
                        event.preventDefault();
                        searchApplications();
                    }}
                >
                    <InputGroup>
                        <Form.Control
                            placeholder="example: Acme Inc"
                            value={searchTextRaw}
                            onChange={(event) => {
                                event.preventDefault();
                                setSearchTextRaw(event.target.value);
                            }}
                        />
                        <Button variant="outline-secondary" onClick={() => searchApplications()}>
                            Search
                        </Button>
                    </InputGroup>
                </Form>
            </Navbar>
            <Notifications />
        </Fragment>
    );
};

export default TopBar;
