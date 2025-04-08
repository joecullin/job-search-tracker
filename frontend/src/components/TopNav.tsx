import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

interface ComponentProps {
    currentItemLabel: string;
}

const TopNav = ({ currentItemLabel }: ComponentProps) => {
    return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" active={currentItemLabel === "Home"}>Home</Nav.Link>
            <Nav.Link href="/Applications" active={currentItemLabel === "Applications"}>Applications</Nav.Link>
            <Nav.Link href="/Analysis" active={currentItemLabel === "Analysis"}>Analysis</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
};

export default TopNav;
