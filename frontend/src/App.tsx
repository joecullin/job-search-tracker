import { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import type { Application } from './api/Application';

import ApplicationList from './components/ApplicationList';
import ApplicationDetail from './components/ApplicationDetail';

const applicationArray: Application[] = [
  {
    id: '2q34q23423',
    company: 'Acme Inc',
    role: 'Sr Eng Mgr',
    status: "applied",
  },
];

function App() {

  const [applications] = useState<Application[]>(applicationArray);
  const [selectedApplication, setSelecetedApplication] = useState<Application | null>(null);

  return (
    <div>
      <h1 className='text-center mt-4'>Application tracker</h1>
      <Container className='mt-4'>
        <Row>
          <Col>
            <ApplicationList applications={applications} onApplicationClick={(c) => setSelecetedApplication(c)} />
            <Button 
              variant="primary" 
              className='mt-4' 
              onClick={() => { setSelecetedApplication(null) }} >
              Deselect application
            </Button>
          </Col>
          <Col>
            <ApplicationDetail application={selectedApplication} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App