import { observer } from 'mobx-react-lite';
import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { Profile } from '../../../app/models/profile';
import ProfileCard from '../../profiles/ProfileCard';

interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({attendees}: Props) {
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    };

    return (
        <List horizontal>
            { attendees.map(a => (
                <Popup hoverable key={a.username} trigger={
                    <List.Item key={a.username}>
                        <Image size='mini' 
                               circular 
                               bordered
                               style={a.following ? styles : null}
                               src={a.image || '/assets/user.png'}/>
                    </List.Item>
                }>
                    <Popup.Content>
                        <ProfileCard profile={a} />
                    </Popup.Content>
                </Popup>
            ))}                        
        </List>
    )

});