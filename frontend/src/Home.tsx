import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TopNav from "./components/TopNav";

function Screen() {
    return (
        <div>
            <TopNav currentItemLabel="Home" />
            <Container className="mt-4">
                <Row>
                    <Col>
                        <p>
                            Job search tools
                        </p>
                        <p>
                            See <a href="https://github.com/joecullin/job-search-tracker" target="_blank">
                                github/joecullin/job-search-tracker
                            </a>.
                        </p>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
