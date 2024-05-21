
import React, { SyntheticEvent, useEffect } from 'react';
import { Card, Grid, Header, Tab, Image, TabProps, Loader } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default observer(function ProfileActivities() {

    const { profileStore } = useStore();
    const { profile, userActivities, loadingActivities, loadActivities } = profileStore;

    const activityImageStyle = {
        filter: 'brightness(80%)',
        minHeight: 100,
        objectFit: 'cover'
    };

    const panes = [
        { menuItem: 'Future Events', pane: { key : 'future' } },
        { menuItem: 'Past Events', pane: { key : 'past' } },
        { menuItem: 'Hosting', pane: { key : 'hosting' } }
    ];

    function onTabChange(event: SyntheticEvent, data: TabProps) {
        
        let index = data.activeIndex as number;
        let predicate = panes[index].pane.key;
        runInAction(() => {
            loadActivities(profile!.username, predicate);
        });
    }

    useEffect(() => {
        loadActivities(profile!.username, 'future');
    }, [loadActivities]);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='calendar'
                        content='Activities' />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={panes}

                        onTabChange={onTabChange} />
                </Grid.Column>
                { loadingActivities &&
                <Grid.Column width={16}>
                    <Loader active={loadingActivities} />
                </Grid.Column> }

                { !loadingActivities &&
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {userActivities.map(activity => (
                            <Card key={activity.id} as={Link} to={`/activities/${activity.id}`}>
                                <Image src={`/assets/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle} />
                                <Card.Content>
                                    <Card.Header textAlign='center'>{activity.title}</Card.Header>
                                    <Card.Meta textAlign='center'>
                                        <div>{format(new Date(activity.date!), 'do LLL')}</div>
                                        <div>{format(new Date(activity.date!), 'h:mm a')}</div>
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </Grid.Column> }
            </Grid>

        </Tab.Pane>
    );

});
