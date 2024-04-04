import React, { Fragment, useEffect, useState } from 'react';
//import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


function App() {

  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    agent.Activities.list().then(
      response => {

        let activities: Activity[] = [];
        response.forEach(a => {
          a.date = a.date.split('T')[0];
          activities.push(a);
        });

        setActivities(activities);
        setLoading(false);
      })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(a => a.id === id));
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose() {
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);
    
    if (activity && activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });    
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      });
    }

  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);

    if (selectedActivity?.id === id) {
      handleCancelSelectActivity();
      setEditMode(false);
    }

    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
      setSubmitting(false);
    });
  }

  if (loading) return <LoadingComponent content='Loading app' />

  return (
    <Fragment>
      
      {/* <Header as='h2' icon='users' content="Reactivities" style={{color: 'red'}} /> */}
      <NavBar openForm={handleFormOpen}/>

      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
          activities={ activities } 
          selectedActivity={ selectedActivity }
          selectActivity={ handleSelectActivity }
          cancelSelectActivity={ handleCancelSelectActivity }
          createOrEditActivity={ handleCreateOrEditActivity }
          deleteActivity={ handleDeleteActivity }
          editMode={ editMode }
          submitting={ submitting }
          openForm={ handleFormOpen }
          closeForm={ handleFormClose } />

      </Container>

    </Fragment>
  );
}

export default App;
