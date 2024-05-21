import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Button, Label } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { Profile } from '../../app/models/profile';
import MyTextArea from '../../app/common/form/MyTextArea';

interface Props {
    profile: Profile;
    updateProfile: (profile: Partial<Profile>) => Promise<void>;
}

export default observer(function ProfileEditForm({profile, updateProfile}: Props) {

    const { profileStore } = useStore();

    return (
        <>
            <Formik
                initialValues={{ bio: profile?.bio || '', displayName: profile?.displayName || '', error: null }}
                onSubmit={(values, { setErrors }) => updateProfile(values)
                    .catch(error => setErrors({ error: 'Unable to update profile' }))}


                validationSchema={Yup.object({
                    displayName: Yup.string().required()
                })}
            >

                {({ handleSubmit, isSubmitting, errors }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput name='displayName' placeholder='Display Name' />
                        <MyTextArea name='bio' placeholder='Biography' rows={5} />
                        <ErrorMessage name='error' render={() => <Label style={{ marginBottom: 10 }} basic color='red' content={errors.error} />} />

                        <Button loading={isSubmitting} positive content='Update profile' type='submit' floated='right' />
                    </Form>
                )}

            </Formik>
        </>
    )

});