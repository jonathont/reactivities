import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useNavigate } from 'react-router-dom';

interface Props {
}

export default observer(function ActivityForm() {

    const { activityStore } = useStore();
    const { selectedActivity, loadActivity, createActivity, updateActivity, loadingInitial, loading } = activityStore;
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });
    

    useEffect(() => {
        if (id) {
            loadActivity(id).then((activity) => {
                setActivity(activity!);
            });
        }
    }, [id, loadActivity]);


    const handleSubmit = async () => {
        let id: string | undefined = activity.id;

        if (activity.id == null || activity.id === '') {
            id = await createActivity(activity);
            // redirect to activity
            if (id && id !== '') {
                navigate(`/activities/${id}`);
            } else 
                console.log('Failed to create activity..');

        } else {
            await updateActivity(activity);
            navigate(`/activities/${id}`);
        }
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
        const {name, value} = event.target;
        setActivity({...activity, [name]: value});
    }

    if (loadingInitial) {
        return <LoadingComponent content='Loading activity...'/>
    }

    return (
        <Segment clearing>

            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name="title" onChange={handleInputChange}  />
                <Form.TextArea placeholder='Description' value={activity.description} name="description" onChange={handleInputChange} />
                <Form.Input placeholder='Category' value={activity.category} name="category" onChange={handleInputChange} />
                <Form.Input type="date" placeholder='Date' value={activity.date} name="date" onChange={handleInputChange} />
                <Form.Input placeholder='City' value={activity.city} name="city" onChange={handleInputChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name="venue" onChange={handleInputChange} />

                <Button loading={loading} disabled={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to={activity.id ? `/activities/${activity.id}` : '/activities'} disabled={loading} floated='right' type='button' content='Cancel' />

            </Form>

        </Segment>
    );
});