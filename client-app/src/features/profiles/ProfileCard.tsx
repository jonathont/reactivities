import React from 'react';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profile';
import { Link } from 'react-router-dom';

interface Props {
    profile: Profile;
}

export default function ProfileCard({ profile }: Props) {

    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />

            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description
                    style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {profile.bio || `${profile.displayName} hasn't written anything yet`}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                20 Followers
            </Card.Content>
        </Card>
    )

}