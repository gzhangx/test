import React from 'react';
import Form from '../form/index.jsx';

function RecordVerses1() {
    return <Form formFields={
        [
            {id: 'email', text: 'Email'},
            {id: 'verese', text: 'Verese'}
        ]
    }/>;
}


function RecordVerses() {
    return <div>testtest</div>;
}
export default RecordVerses1;