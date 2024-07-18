import React from 'react';
import { useMsal } from '@azure/msal-react';

const withMsal = (Component) => {
    return (props) => {
        const { instance } = useMsal();
        return <Component {...props} msalInstance={instance} />;
    };
};

export default withMsal;
