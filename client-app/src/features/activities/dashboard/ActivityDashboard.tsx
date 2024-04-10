import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';


interface Props {

}

export default observer( function ActivityDashboard() {

    const { activityStore } = useStore();

    const { loadActivities, activityMap } = activityStore;

    useEffect(() => {
        if (activityMap.size <= 1)
            loadActivities();
    }, [activityMap.size, loadActivities])
  
  
    if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />
  

    return (

        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                <h2>Activity filter</h2>
            </Grid.Column>
        </Grid>


    );
});