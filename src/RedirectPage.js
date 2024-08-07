import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bars } from 'react-loading-icons'

const RedirectPage = () => {
    const location = useLocation();
    const [googleToken, setGoogleToken] = useState('');
    const [microsoftToken, setMicrosoftToken] = useState('');

    useEffect(() => {
        // Extract the tokens from localStorage
        const storedGoogleToken = localStorage.getItem('googleToken');
        const storedMicrosoftToken = localStorage.getItem('microsoftToken');

        if (storedGoogleToken) {
            setGoogleToken(storedGoogleToken);
            // Optional: Exchange token for user info
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${storedGoogleToken}`,
                },
            })
                .then(response => response.json())
                .then(data => console.log('Google User Info:', data))
                .catch(error => console.log('Error fetching Google user info:', error));
        }

        if (storedMicrosoftToken) {
            setMicrosoftToken(storedMicrosoftToken);
            // Optional: Exchange token for user info
            fetch('https://graph.microsoft.com/v1.0/me', {
                headers: {
                    Authorization: `Bearer ${storedMicrosoftToken}`,
                },
            })
                .then(response => response.json())
                .then(data => console.log('Microsoft User Info:', data))
                .catch(error => console.log('Error fetching Microsoft user info:', error));
        }
    }, []);

    return (
        <div>
            <h2>RedirectPage</h2>
            <p>Redirected successful</p>
            <Bars />
        </div>
    );
};

export default RedirectPage;