import React, { useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import { Grid } from 'semantic-ui-react';
import ProfileContent from './ProfileContent';
import { useParams } from 'react-router-dom';
import { useStore } from '../../app/stores/store';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { observer } from 'mobx-react-lite';

interface Props {
    username: string;
}

export default observer(function ProfilePage() {

    const {username} = useParams<{username: string}>();
    const {profileStore} = useStore();
    const {loadingProfile, loadProfile, profile} = profileStore;

    useEffect(() => {
        if (username)
            loadProfile(username);
    }, [loadProfile, username]);

    if (loadingProfile)
        return <LoadingComponent content='Loading profile...' />

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!} />
                <ProfileContent  profile={profile!} />
            </Grid.Column>
        </Grid>
    )
});