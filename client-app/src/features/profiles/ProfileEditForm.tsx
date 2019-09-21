import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Form, Button } from 'semantic-ui-react'
import {Form as FinalForm, Field} from 'react-final-form';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { isRequired, combineValidators } from 'revalidate';
import { IProfileValues } from '../../app/models/profile';

const validate = combineValidators({
    displayName: isRequired({message: 'Display name is required'})
});

const ProfileEditForm = () => {
    const rootStore = useContext(RootStoreContext);
    const {loading, editProfile, profileValues} = rootStore.profileStore;

    const handleFinalFormSubmit = (values: IProfileValues) => {
        editProfile(values);
    };

    return (
            <FinalForm  
                onSubmit={handleFinalFormSubmit}
                validate={validate}
                initialValues={profileValues}
                render={({handleSubmit, invalid, pristine}) => (
                    <Form onSubmit={handleSubmit}>
                        <Field name='displayName' placeholder='Display Name' value={profileValues.displayName} component={TextInput} />
                        <Field name='bio' placeholder='Bio' value={profileValues.bio} component={TextAreaInput} rows={3} />
                        <Button floated='right' positive type='submit' content='Update profile' loading={loading}  disabled={invalid || pristine} />
                    </Form>
                )}
                >
                
            </FinalForm>
    )
}

export default observer(ProfileEditForm)
