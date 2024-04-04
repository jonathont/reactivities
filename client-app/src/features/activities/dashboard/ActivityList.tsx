import React, { SyntheticEvent, useState } from 'react';
import { Activity } from '../../../app/models/activity';
import { Button, Item, Label, Segment } from 'semantic-ui-react';

interface Props {
    activities: Activity[];
    submitting: boolean;
    selectActivity: (id: string) => void;
    deleteActivity: (id: string) => void;
}

export default function ActivityList({ activities, submitting, selectActivity, deleteActivity }: Props) {

    const [target, setTarget] = useState('');

    function handleActivityDelete(e: any, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>

            <Item.Group divided>
                { activities.map((activity) => (
                  <Item key={activity.id}>
                    <Item.Content>
                        <Item.Header as='a'>{ activity.title} </Item.Header>
                        <Item.Meta>{ activity.date }</Item.Meta>
                        <Item.Description>
                            <div>{ activity.description }</div>    
                            <div>{ activity.city }, { activity.venue }</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button disabled={submitting && target === activity.id} onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue'/>
                            <Button 
                                name={activity.id}
                                loading={submitting && target === activity.id} disabled={submitting && target === activity.id} onClick={(e) => handleActivityDelete(e, activity.id)} floated='right' content='Delete' color='red'/>
                            <Label basic content={ activity.category } />
                        </Item.Extra>
                    </Item.Content>
                  </Item>  
                )) }
            </Item.Group>

        </Segment>

    );
}