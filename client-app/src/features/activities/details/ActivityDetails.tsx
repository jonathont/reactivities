import React from 'react';
import { Card, CardContent, CardHeader, CardMeta, CardDescription, Icon, Image, Button } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import LoadingComponent from '../../../app/layout/LoadingComponent';

interface Props {
}

export default function ActivityDetails() {

    const { activityStore } = useStore();
    const { openForm, cancelSelectedActivity, selectedActivity: activity } = activityStore;

    if (!activity) return <LoadingComponent content={'Loading'} />;

    return (        
        <Card fluid>
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
                    <Button onClick={() => openForm(activity.id)} basic color='blue' content='Edit' />
                    <Button onClick={ cancelSelectedActivity } basic color='grey' content='Cancel' />
                </Button.Group>
            </CardContent>
        </Card>
    );
}