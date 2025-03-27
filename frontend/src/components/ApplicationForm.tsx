import Form from 'react-bootstrap/Form';
import { Application, applicationStatusLabel } from "../api/Application";

interface ApplicationFormProps {
    application: Application;
    saveChanges: (application: Application) => void;
}

//JOE - stopped here.
// Next:
// - Implement form for edits. (Same form for adds?)
// - Implement saveChanges. (Still no db, just temp in browser.)

export default function ApplicationCard({ application, saveChanges }: ApplicationFormProps) {
    return (
        <Form>
            <div>
                {application.role}
            </div>
            <div>
                <b>Source:</b> {application.source}
            </div>
            <div>
                <b>Notes:</b>
                <p
                style={{ // TODO: move to stylesheet
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    margin: "0 0 0 1rem",
                }}
                >
                    {application.note}
                </p>
            </div>
        </Form>
    );
}

