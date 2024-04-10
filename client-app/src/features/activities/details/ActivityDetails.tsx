import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Icon, Image, Button, Grid } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Link, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

interface Props {
}

export default observer(function ActivityDetails() {

    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;

    const { id } = useParams<{ id: string }>();


    useEffect(() => {
        if (id)
            loadActivity(id);

    }, [id, loadActivity]);

    if (loadingInitial || !activity) 
        return <LoadingComponent content={'Loading'} />;

    return (
        <Grid centered>
            <Grid.Row>
                <Card>
                    <Image src={`/assets/categoryImages/${activity.category}.jpg`} wrapped ui={false} />
                    <CardContent>
                        <CardHeader>{ activity.title }</CardHeader>
                        <CardMeta>
                            <span>{ activity.date }</span>
                        </CardMeta>
                        <CardDescription>
                            { activity.description }
                        </CardDescription>
                    </CardContent>
                    <CardContent extra>
                        <Button.Group widths='2'>
                            <Button as={Link} to={`/manage/${activity.id}`} basic color='blue' content='Edit' />
                            <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
                        </Button.Group>
                    </CardContent>
                </Card>
            </Grid.Row>
        </Grid>
    );
})