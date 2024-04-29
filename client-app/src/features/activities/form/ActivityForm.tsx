import React, { useEffect, useState } from 'react';
import { Button, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { Link, useParams } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';

import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { ActivityFormValues } from '../../../app/models/activity';

export default observer(function ActivityForm() {

    const { activityStore } = useStore();
    const { loadActivity, createActivity, updateActivity, loadingInitial } = activityStore;
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());
    

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is reqiured'),
        venue: Yup.string().required(),
        city: Yup.string().required()
    });

    useEffect(() => {
        if (id) {
            loadActivity(id).then((activity) => {
                setActivity(new ActivityFormValues(activity));
            });
        }
    }, [id, loadActivity]);


    const handleFormSubmit = async (activity: ActivityFormValues) => {
        let id: string | undefined = activity.id;

        if (activity.id == null || activity.id === '') {
            id = await createActivity(activity);
            
            // redirect to activity
            if (id && id !== '') {
                navigate(`/activities/${id}`);
                activity.id = id;
            } else 
                console.log('Failed to create activity..');

        } else {
            await updateActivity(activity);
            navigate(`/activities/${id}`);
        }
    }

    // function handleChange(event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) {
    //     const {name, value} = event.target;
    //     setActivity({...activity, [name]: value});
    // }

    if (loadingInitial) {
        return <LoadingComponent content='Loading activity...'/>
    }

    return (
        <Segment clearing>

            <Header content='Activity Details' sub color='teal' />
            
            <Formik 
                enableReinitialize 
                validationSchema={validationSchema}
                initialValues={ activity } onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
            
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    {/* <FormField>
                        <Field placeholder='Title' name="title"  />
                        <ErrorMessage name='title' render={error => <Label basic color='red' content={error} />} />
                    </FormField> */}

                    <MyTextInput name='title' placeholder='Title' />
                    <MyTextArea rows={3} name='description' placeholder='Description' />
                    <MySelectInput options={categoryOptions} name='category' placeholder='Category' />
                    <MyDateInput 
                        placeholderText='Date' 
                        name="date"
                        showTimeSelect
                        timeCaption='time'
                        dateFormat='MMMM d, yyyy h:mm aa'
                    />
                    
                    <Header content='Location Details' sub color='teal' />

                    <MyTextInput placeholder='City' name="city" />
                    <MyTextInput placeholder='Venue'name="venue" />

                    <Button 
                            disabled={isSubmitting || !dirty || !isValid }
                            loading={isSubmitting} floated='right' positive type='submit' content='Submit' />
                    <Button as={Link} to={activity.id ? `/activities/${activity.id}` : '/activities'} disabled={isSubmitting} floated='right' type='button' content='Cancel' />
                </Form>
            )}

            </Formik>



        </Segment>
    );
});