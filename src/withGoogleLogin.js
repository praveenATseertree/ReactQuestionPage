import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const withGoogleLogin = (Component) => {
    return (props) => {
        const googleLogin = useGoogleLogin({
            clientId: "974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com",
            onSuccess: async tokenResponse => {
                const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.access_token}`
                    }
                }).then(response => response.json());

                console.log('Google User Details:', userInfo);
                sessionStorage.setItem('googleToken', tokenResponse.access_token);
                window.location.href = '/request';
            },
            onError: error => console.log('Login Failed:', error)
        });

        return <Component {...props} googleLogin={googleLogin} />;
    };
};

export default withGoogleLogin;
