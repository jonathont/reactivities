import React, { Fragment } from 'react';
//import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';


function App() {

  return (
    <Fragment>
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route
          path={'/*'} element={ 
            <>
              <><NavBar /></>
            
              <Container style={{ marginTop: '7em' }}>
          
              {/* <ActivityDashboard /> */}
              <Routes>
                <Route path='activities' element={<ActivityDashboard />} />
                <Route path='/activities/:id' element={<ActivityDetails />} />

                <Route path='/createActivity' element={<ActivityForm key="create" />} />
                <Route path='/manage/:id' element={<ActivityForm  key="edit" />} />                
              </Routes>
            </Container>

            </>
          } />
      </Routes>


    </Fragment>
  );
}

export default observer(App);
