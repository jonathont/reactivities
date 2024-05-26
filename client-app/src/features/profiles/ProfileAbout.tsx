import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Profile } from '../../app/models/profile';
import { Button, Card, CardContent, CardHeader, Icon } from 'semantic-ui-react';
import ProfileEditForm from './ProfileEditForm';
import { useStore } from '../../app/stores/store';
import { runInAction } from 'mobx';

interface Props {
    profile: Profile;
}

export default observer(function ProfileAbout({ profile }: Props) {

    let { profileStore } = useStore();

    let [isEditing, setIsEditing] = useState<boolean>(false);

    let updateProfile = (profile: Partial<Profile>): Promise<void> => {
        var update = profileStore.updateProfile(profile);

        update.then(() => runInAction(() => setIsEditing(false)));

        return update;
    };

    return (
        <Card fluid>
            <CardContent>
                {profileStore.isCurrentUser && (
                    <Button
                        floated='right'
                        basic
                        style={{ marginBottom: 10 }}
                        onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                )}
                <CardHeader >
                    <div className="header">
                        <Icon name='user' /> {`About ${profile?.displayName}`}
                    </div>
                </CardHeader>
                {!isEditing &&
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{profile?.bio || `${profile?.displayName} hasn't written anything here yet`}</pre>
                }
                {isEditing &&
                    <ProfileEditForm profile={profile} updateProfile={updateProfile} />
                }
            </CardContent>
        </Card>
    );

});