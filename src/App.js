import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import CreateAcc from './CreateAcc';
import Questionnaire from './Questionnaire';

const msalConfig = {
  auth: {
    clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:3000/request'
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
    const account = event.payload.account;
    msalInstance.setActiveAccount(account);
    window.location.href = '/request';
  }
});

class App extends Component {
  render() {
    return (
      <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
        <MsalProvider instance={msalInstance}>
          <Router>
            <Routes>
              <Route path="/" element={<CreateAcc />} />
              <Route path="/request" element={<Questionnaire />} />
            </Routes>
          </Router>
        </MsalProvider>
      </GoogleOAuthProvider>
    );
  }
}

export default App;
