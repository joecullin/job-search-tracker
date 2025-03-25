import Card from 'react-bootstrap/Card';
import type { Application } from '../api/Application';

interface ApplicationDetailProps {
  application: Application | null;
}

export default function ApplicationDetail({ application }: ApplicationDetailProps) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {application ? `${application.company} ${application.role}` : 'Please select an application on the left'}
        </Card.Title>
        <Card.Text>
          {`Status: ${application ? application.status : "--"}`}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
