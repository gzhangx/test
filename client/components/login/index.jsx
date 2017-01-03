import React from 'react';

import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

const responseFacebook = (response) => {
    console.log(response);
}

function Login(){
    return <FacebookLogin
        appId="769619706445616"
        autoLoad={true}
        fields="name,email,picture"
        //onClick={componentClicked}
        callback={responseFacebook} />;
}

export default Login;