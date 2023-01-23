import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'semantic-ui-css/semantic.min.css';
import { Header, List } from 'semantic-ui-react';

import logo from './logo.svg';
import './App.css';


function App() {

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities').then(
      response => {
        console.log(response);
        setActivities(response.data);
      })
  }, [])

  return (
    <div>
      
      <Header as='h2' icon='users' content="Reactivities" />


      <List>
      { activities.map((a: any) => (
        <List.Item key={a.id}>
          {a.title}
        </List.Item>
      )) }
      </List> 

        <ul>

        </ul>


    </div>
  );
}

export default App;
