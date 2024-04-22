import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header, Label } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function LoginForm() {

    const {userStore} = useStore();

    return (
        <>
        <Header as='h2' content='Login' color='teal' textAlign='center' />
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values)
                                                    .catch(error => setErrors({error: 'Invalid email or password'}))}>

            {({handleSubmit, isSubmitting, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage name='error' render={() => <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />} />
                    <Button loading={isSubmitting} positive content='login' type='submit' fluid />
                </Form>
            )}

        </Formik>
        </>
    )

});