import React, { Fragment, useEffect } from 'react';
//import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ScrollToTop from './ScrollToTop';



function App() {

    const location = useLocation();
    const {commonStore, userStore} = useStore();

    useEffect(() => {
      if (commonStore.token)
        userStore.getUser().finally(() => commonStore.setAppLoaded());
      else
        commonStore.setAppLoaded();        
    }, [commonStore, userStore]);

    if (!commonStore.appLoaded)
      return <LoadingComponent content='Loading app...' />

    return (
      <Fragment>
        <ScrollToTop />        
        <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
        <ModalContainer />
        
        { location.pathname === '/' ? <HomePage /> : (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Outlet />
            </Container>
          </>

        )}
      </Fragment>

    );

}

export default observer(App);
