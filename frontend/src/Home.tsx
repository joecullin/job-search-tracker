import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopBar from "./components/TopBar";

function Screen() {
    return (
        <div>
            <TopBar currentItemLabel="Home" />
            <Container className="mt-4">
                <Row>
                    <Col>
                        <p>Some tools for my 2025 job search.</p>
                        <p>
                            See{" "}
                            <a href="https://github.com/joecullin/job-search-tracker" target="_blank">
                                github/joecullin/job-search-tracker
                            </a>
                            .
                        </p>
                        <p>
                            Live demo on github pages at{" "}
                            <a href="https://joecullin.github.io/job-search-tracker/" target="_blank">
                                joecullin.github.io/job-search-tracker/
                            </a>
                            .
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
