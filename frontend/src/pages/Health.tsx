import React, { useState } from 'react';
import { FETCH_SERVER_HEALTH_STATUS } from '../constants/URLs';

const Health: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const fetchHealth = async () => {
    setIsFetching(true);

    try {
      const res = await fetch(FETCH_SERVER_HEALTH_STATUS, { method: 'GET' });

      if (res.status !== 200) {
        setMessage('Server is Not Working Properly');
      } else {
        setMessage('Server Health is Good');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div>
      <h4>Check Backend Health</h4>
      <br />
      <button onClick={fetchHealth}>Click Here to fetch the health of Backend</button>
      <br />
      <br />
      {isFetching ? 'fetching server health status' : message}
    </div>
  );
};

export default Health;
