import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function SelfPage() {
  const params = useParams();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const url = '/api/time/' + params.self;
    fetch(url).then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, [params]);

  return (
    <div >
      <header className="App-header">

        ... no changes in this part ...

        <p>Yourself time is {currentTime}.</p>
        <Link to='/'>Go to Home</Link>
      </header>
    </div>
  );
}

export default SelfPage;
