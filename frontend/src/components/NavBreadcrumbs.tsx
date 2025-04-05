import Breadcrumb from "react-bootstrap/Breadcrumb";

interface ComponentProps {
    currentItemLabel: string;
}

const NavBreadcrumbs = ({ currentItemLabel }: ComponentProps) => {
    return (
        <Breadcrumb
            style={{
                paddingLeft: "1rem",
            }}
        >
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>{currentItemLabel}</Breadcrumb.Item>
        </Breadcrumb>
    );
};

export default NavBreadcrumbs;
