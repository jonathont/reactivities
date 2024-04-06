import React, { SyntheticEvent, useState } from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

interface Props {
}

export default observer(function ActivityList() {

    const { activityStore } = useStore();
    const { activitiesByDate, deleteActivity, loading } = activityStore;
    
    const [target, setTarget] = useState('');


    function handleActivityDelete(e: any, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>

            <Item.Group divided>
                { activitiesByDate.map((activity) => (
                  <Item key={activity.id}>
                    <Item.Content>
                        <Item.Header as='a'>{ activity.title} </Item.Header>
                        <Item.Meta>{ activity.date }</Item.Meta>
                        <Item.Description>
                            <div>{ activity.description }</div>    
                            <div>{ activity.city }, { activity.venue }</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button disabled={loading && target === activity.id} onClick={() => activityStore.selectActivity(activity.id)} floated='right' content='View' color='blue'/>
                            <Button 
                                name={activity.id}
                                loading={loading && target === activity.id} disabled={loading && target === activity.id} onClick={(e) => handleActivityDelete(e, activity.id)} floated='right' content='Delete' color='red'/>
                            <Label basic content={ activity.category } />
                        </Item.Extra>
                    </Item.Content>
                  </Item>  
                )) }
            </Item.Group>

        </Segment>

    );
});