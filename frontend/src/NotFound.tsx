import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router";

function Screen() {
    const { "*": splat } = useParams();

    return (
        <div>
            <h1 className="text-left mt-4">Page Not Found: {splat}</h1>
            <Container className="mt-4">
                <Row>
                    <Col>
                        <Button variant="link" href="/">
                            Home
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Screen;
