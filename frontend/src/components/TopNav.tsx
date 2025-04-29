import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

interface ComponentProps {
    currentItemLabel: string;
    handleSearchQueryChange?: (queryText: string) => void;
    searchQuery?: string;
}

const TopNav = ({ currentItemLabel, handleSearchQueryChange, searchQuery }: ComponentProps) => {
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
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top" className="justify-content-between">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/job-search-tracker/" active={currentItemLabel === "Home"}>
                        Home
                    </Nav.Link>
                    <Nav.Link href="/job-search-tracker/Applications" active={currentItemLabel === "Applications"}>
                        Applications
                    </Nav.Link>
                    <Nav.Link href="/job-search-tracker/Analysis" active={currentItemLabel === "Analysis"}>
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
    );
};

export default TopNav;
