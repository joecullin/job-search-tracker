// Made my own notifications component, as an excuse to try zustand.
// (Normally I'd prefer an off-the-shelf module like react-toastify.)

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface Notification {
    id?: string;
    notificationType?: "info" | "success" | "error";
    message: string;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (values: Notification) => void;
    removeNotification: (id: string) => void;
}

export const defaultNotificationValues = {
    id: "",
    message: "",
    notificationType: "info",
};

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
    notifications: [],
    addNotification: (values: Notification) => {
        const state = get();
        values.id = uuidv4();
        const updatedNotifications = state.notifications.concat(values);
        set({
            notifications: updatedNotifications,
        });
    },
    removeNotification: (id: string) => {
        const state = get();
        const updatedNotifications = state.notifications.filter((notification) => notification.id !== id);
        set({
            notifications: updatedNotifications,
        });
    },
}));
