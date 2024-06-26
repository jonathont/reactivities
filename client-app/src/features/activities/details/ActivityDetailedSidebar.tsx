import React from 'react'
import { Segment, List, Label, Item, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Activity } from '../../../app/models/activity';


interface Props {
    activity: Activity;
}

export default observer(function ActivityDetailedSidebar({ activity: { attendees, host } }: Props) {
    if (!attendees)
        return (<></>);

    return (
        <>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendees.length} {attendees.length === 1 ? 'person' : 'people'} going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {attendees.map(a => (
                        <Item key={a.username} style={{ position: 'relative' }}>
                            <Image size='tiny' src={a.image || '/assets/user.png'} />
                            <Item.Content verticalAlign='middle'>
                                {a.username === host?.username &&
                                    <Label
                                        style={{ position: 'absolute' }}
                                        color='orange'
                                        ribbon='right'>Host</Label>
                                }

                                <Item.Header as='h3'>
                                    <Link to={`/profiles/${a.username}`}>{a.displayName}</Link>
                                </Item.Header>
                                {a.following &&
                                    <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                                }
                            </Item.Content>
                        </Item>
                    ))}
                </List>
            </Segment>
        </>

    )
})