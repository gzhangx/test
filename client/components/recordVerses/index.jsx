import React from 'react';
import Form from '../form/index.jsx';

function recordVerses1(email,verse, group) {
    return <Form formFields={
        [
            {id: 'email', text: 'Email'},
            {id: 'verese', text: 'Verese'}
        ]
    }/>;
}


function recordVerses(email,verse, group) {
    return <div>testtest</div>;
}
export default recordVerses;