import React, { useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

import { useAuthContext } from '../auth/hooks/useAuthContext';


interface LeaguePickerProps { }

const LeaguePicker: React.FC<LeaguePickerProps> = () => {

  const { token } = useAuthContext();

  useEffect(() => {
    if (!token) return;
  }, [token]);

  return (
    <div className='text-left'>...coming soon</div>
  );
}

export default LeaguePicker;