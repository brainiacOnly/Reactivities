import React, {useState, FormEvent} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import {v4 as uuid} from 'uuid';

interface IProps {
    setEditMode : (editMode:boolean) => void;
    activity: IActivity;
    createActivity: (activity : IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean
}

const ActivityForm : React.FC<IProps> = ({setEditMode, activity: initialFormState, createActivity, editActivity, submitting}) => {
    const initializeForm = () => {
        if(initialFormState) {
            return initialFormState;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = () => {
        if(activity.id.length === 0) {
            let newActivity = {...activity, id: uuid()};
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    const handleImputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleImputChange} name='title' placeholder='Title' value={activity.title} />
                <Form.TextArea onChange={handleImputChange} name='description' rows={2} placeholder='Description' value={activity.description} />
                <Form.Input onChange={handleImputChange} name='category' placeholder='Category' value={activity.category} />
                <Form.Input onChange={handleImputChange} name='date' type='datetime-local' placeholder='Date' value={activity.date} />
                <Form.Input onChange={handleImputChange} name='city' placeholder='City' value={activity.city} />
                <Form.Input onChange={handleImputChange} name='venue' placeholder='Venue' value={activity.venue} />
                <Button floated='right' positive type='submit' content='Submit' loading={submitting} />
                <Button floated='right' positive type='button' content='Cancel' onClick={() => setEditMode(false)} />
            </Form>
        </Segment>
    )
}

export default ActivityForm