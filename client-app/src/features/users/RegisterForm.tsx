import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Header } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

export default observer(function RegisterForm() {

    const {userStore} = useStore();

    return (
        <>
        <Header as='h2' content='Sign up' color='teal' textAlign='center' />
        <Formik
            initialValues={{displayName: '', username: '', email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => userStore.register(values)
                                                        .catch(error => setErrors({error}))}
                                                    
            validationSchema={Yup.object({
                displayName: Yup.string().required(),
                username: Yup.string().required(),
                email: Yup.string().required(),
                password: Yup.string().required()
            })}
            >

            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextInput name='username' placeholder='Username' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage name='error' render={() => 
                                  <ValidationErrors errors={errors.error} />} 
                    />
                    <Button disabled={!isValid || !dirty || isSubmitting} 
                            loading={isSubmitting} positive content='login' type='submit' fluid />
                </Form>
            )}

        </Formik>
        </>
    )

});