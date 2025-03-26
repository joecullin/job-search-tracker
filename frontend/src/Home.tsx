import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

function Screen() {
    return (
        <div>
            <h1 className="text-center mt-4">Job Search Tools</h1>
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Button variant="link" href="/applications">
                            Applications
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
