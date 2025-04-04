import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface RelativeDatetimeProps {
    timestamp: string;
    label: string | null;
}

export default function RelativeDatetime({ timestamp, label }: RelativeDatetimeProps) {
    const isDue = dayjs(timestamp).isBefore(dayjs().startOf("day"));
    const color = isDue ? "red" : "";

    return (
        <OverlayTrigger
            overlay={
                <Tooltip id="tooltip-datetime">
                    {label ?? label} {timestamp}
                </Tooltip>
            }
        >
            <span style={{ color }}>{dayjs(timestamp).fromNow(true)}</span>
        </OverlayTrigger>
    );
}
