// Made my own notifications component, as an excuse to try zustand.
// (Normally I'd prefer an off-the-shelf module like react-toastify.)

import ToastContainer from "react-bootstrap/ToastContainer";

import { useNotificationStore } from "../api/useNotificationStore";
import Notification from "./Notification";

const Notifications = () => {
    const notifications = useNotificationStore((state) => state.notifications);
    const removeNotification = useNotificationStore((state) => state.removeNotification);

    return (
        <ToastContainer className="p-3 position-fixed" position="top-end" style={{ zIndex: 10000 }}>
            {notifications.length > 0 &&
                notifications.map((notification) => {
                    return (
                        <Notification
                            key={notification.id}
                            message={notification.message}
                            notificationType={notification.notificationType}
                            removeNotification={() => {
                                if (notification.id) {
                                    removeNotification(notification.id);
                                }
                            }}
                        />
                    );
                })}
        </ToastContainer>
    );
};

export default Notifications;
