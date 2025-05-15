// See Notifications component and api/useNotificationStore.

import { useState } from "react";

import Toast from "react-bootstrap/Toast";

interface NotificationProps {
    message: string;
    notificationType?: string;
    removeNotification: () => void;
}

const Notification = ({ message, notificationType, removeNotification }: NotificationProps) => {
    const [show, setShow] = useState(true);

    let bg = "info";
    let headerText = "ⓘ";
    let delay = 3000;
    if (notificationType === "error") {
        bg = "danger";
        headerText = "Error";
        delay = 10000;
    } else if (notificationType === "success") {
        bg = "success";
        headerText = "✔ success";
        delay = 2000;
    }

    // This gets called automatically after delay, and/or when user clicks the "close" button.
    const hideAndRemove = () => {
        setShow(false);
        removeNotification();
    };

    return (
        <Toast onClose={() => hideAndRemove()} show={show} delay={delay} autohide bg={bg} className="text-white">
            <Toast.Header>
                <strong className="me-auto">{headerText}</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
        </Toast>
    );
};

export default Notification;
