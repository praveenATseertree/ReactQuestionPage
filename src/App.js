import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import CreateAcc from './CreateAcc';
import Questionnaire from './Questionnaire';
import RedirectPage from './RedirectPage';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import Swal from 'sweetalert2';

const msalConfig = {
  auth: {
    clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:3000/request'
  }
};

//hgx
const msalInstance = new PublicClientApplication(msalConfig);

const App = () => {
  const [loading, setLoading] = useState(false);

  const extractUserInfo = (email) => {
    const [localPart, domainPart] = email.split('@');
    if (!domainPart) {
      return {
        firstName: localPart,
        lastName: '',
        companyName: ''
      };
    }

    const [firstName, lastName] = localPart.split('.');
    const companyName = domainPart.split('.')[0];

    return {
      firstName: firstName || localPart,
      lastName: lastName || '',
      companyName: companyName || ''
    };
  };

  const checkDomainName = async (domainName) => {
    const sessionId = sessionStorage.getItem('session_id'); // Retrieve session ID
    try {
      const response = await axios.post("http://localhost:8080/Kuber_Fixed/CheckDomainCount", {
        domain_name: domainName
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId // Add Authorization header
        }
      });
  
      const { count } = response.data;
  
      if (count > 0) {
        Swal.fire({
          title: 'Domain Already Found',
          text: `The domain ${domainName} already exists with ${count} records.`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return false; // Domain exists, stop further processing
      }
  
      return true; // Domain does not exist, continue processing
  
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error);
      return false; // Handle API error gracefully
    }
  };
  

  const checkEmailExists = async (email) => {
    const sessionId = sessionStorage.getItem('session_id');
    try {
      const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId
        }
      });

      const userEmails = response.data.user_emails || [];
      const emails = userEmails.map((obj) => obj.user_email);

      return emails.includes(email); // Return true if email exists, else false

    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error);
      return false; // Handle API error gracefully
    }
  };

  const handleLoginSuccess = async (account) => {
    msalInstance.setActiveAccount(account);
    sessionStorage.setItem('userMEmail', account.username); // Store Microsoft email
  
    const email = account.username;
    const sessionId = sessionStorage.getItem('session_id');
  
    try {
      setLoading(true);
  
      // Fetch user emails
      const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId
        }
      });
  
      const userEmails = response.data.user_emails || [];
      const emails = userEmails.map((obj) => obj.user_email);
  
      // Check if the email exists
      if (emails.includes(email)) {
        window.location.href = "/redirect"; // Redirect if email exists
        return; // Skip further processing
      }
  
      // Extract domain from the email
      const domain = email.split('@')[1];
  
      // Check if the domain exists in any of the existing emails
      const domainExists = emails.some(existingEmail => existingEmail.split('@')[1] === domain);
  
      if (domainExists) {
        Swal.fire({
          title: 'Domain Already Found',
          text: `The domain ${domain} already exists.`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        window.location.href = "/redirect"; // Redirect if domain exists
      } else {
        window.location.href = "/request"; // Redirect if domain does not exist
      }
  
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const eventCallbackId = msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        handleLoginSuccess(event.payload.account);
      }
    });

    // Cleanup event callback
    return () => {
      msalInstance.removeEventCallback(eventCallbackId);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
      <MsalProvider instance={msalInstance}>
        <Router>
          <Routes>
            <Route path="/" element={<CreateAcc />} />
            <Route path="/request" element={<Questionnaire />} />
            <Route path="/redirect" element={<RedirectPage />} />
          </Routes>
        </Router>
        {loading && (
          <div className="loading-overlay">
            <PulseLoader
              size={15}
              margin={2}
              color={"#045D8C"}
              loading={loading}
              cssOverride={{ display: 'block', margin: '0 auto' }}
              speedMultiplier={1}
            />
          </div>
        )}
      </MsalProvider>
    </GoogleOAuthProvider>
  );
};

export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication, EventType } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Questionnaire from './Questionnaire';
// import RedirectPage from './RedirectPage';
// import axios from 'axios';
// import { PulseLoader } from 'react-spinners';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// const App = () => {
//   const [loading, setLoading] = useState(false);

//   const handleLoginSuccess = async (account) => {
//     msalInstance.setActiveAccount(account);
//     sessionStorage.setItem('userMEmail', account.username); // Store Microsoft email

//     const email = account.username;
//     const sessionId = sessionStorage.getItem('session_id');

//     try {
//       setLoading(true);
//       const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': sessionId
//         }
//       });

//       const userEmails = response.data.user_emails || [];
//       const emails = userEmails.map((obj) => obj.user_email);

//       if (emails.includes(email)) {
//         window.location.href = "/redirect"; // Redirect if email exists
//       } else {
//         window.location.href = "/request"; // Redirect if email does not exist
//       }
//     } catch (error) {
//       console.error('API Error:', error.response ? error.response.data : error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   msalInstance.addEventCallback((event) => {
//     if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//       handleLoginSuccess(event.payload.account);
//     }
//   });

//   return (
//     <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//       <MsalProvider instance={msalInstance}>
//         <Router>
//           <Routes>
//             <Route path="/" element={<CreateAcc />} />
//             <Route path="/request" element={<Questionnaire />} />
//             <Route path="/redirect" element={<RedirectPage />} />
//           </Routes>
//         </Router>
//         {loading && (
//           <div className="loading-overlay">
//             <PulseLoader
//               size={15}
//               margin={2}
//               color={"#045D8C"}
//               loading={loading}
//               cssOverride={{ display: 'block', margin: '0 auto' }}
//               speedMultiplier={1}
//             />
//           </div>
//         )}
//       </MsalProvider>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication, EventType } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Questionnaire from './Questionnaire';
// import RedirectPage from './RedirectPage';
// import axios from 'axios';


// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// const handleLoginSuccess = async (account) => {
  
//   msalInstance.setActiveAccount(account);
//   sessionStorage.setItem('userMEmail', account.username); // Store Microsoft email

//   const email = account.username;
//   const sessionId = sessionStorage.getItem('session_id');

//   try {
//     const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': sessionId
//       }
//     });

//     const userEmails = response.data.user_emails || [];
//     const emails = userEmails.map((obj) => obj.user_email);

//     if (emails.includes(email)) {
//       window.location.href = "/redirect"; // Redirect if email exists
//     } else {
//       window.location.href = "/request"; // Redirect if email does not exist
//     }
//   } catch (error) {
//     console.error('API Error:', error.response ? error.response.data : error);
//   }
// };

// msalInstance.addEventCallback((event) => {

//   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//     handleLoginSuccess(event.payload.account);
//   }
// });

// const App = () => {
//   return (
//     <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//       <MsalProvider instance={msalInstance}>
//         <Router>
//           <Routes>
//             <Route path="/" element={<CreateAcc />} />
//             <Route path="/request" element={<Questionnaire />} />
//             <Route path="/redirect" element={<RedirectPage />} />
//           </Routes>
//         </Router>
//       </MsalProvider>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication, EventType } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Questionnaire from './Questionnaire';
// import RedirectPage from './RedirectPage';
// import axios from 'axios';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// // const handleLoginSuccess = async (account) => {
// //   msalInstance.setActiveAccount(account);
// //   sessionStorage.setItem('userMEmail', account.username); // Store Microsoft email

// //   const email = account.username;
// //   console.log("Logged in email:", email);

// //   try {
// //     const sessionId = sessionStorage.getItem('session_id');
// //     const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
// //       headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': sessionId
// //       }
// //     });

// //     const userEmails = response.data.user_emails || [];
// //     const emails = userEmails.map((obj) => obj.user_email);
// //     console.log("Emails from API:", emails);

// //     if (emails.includes(email)) {
// //       console.log("Redirecting to /redirect");
// //       window.location.href = "/redirect"; // Redirect if email exists
// //     } else {
// //       console.log("Redirecting to /request");
// //       window.location.href = "/request"; // Redirect if email does not exist
// //     }
// //   } catch (error) {
// //     console.error('API Error:', error.response ? error.response.data : error);
// //   }
// // };
// const handleLoginSuccess = async (account) => {
//   msalInstance.setActiveAccount(account);
//   sessionStorage.setItem('userMEmail', account.username); // Store Microsoft email

//   const email = account.username;
//   console.log("Logged in email:", email);

//   // Hardcoded test values
//   const testEmails = ["vijayr@markwins.com"];
//   console.log("Test Emails:", testEmails);

//   // Check if the email is in the hardcoded list
//   if (testEmails.includes(email)) {
//     console.log("Redirecting to /redirect");
//     window.location.href = "/redirect"; // Redirect if email exists
//   } else {
//     console.log("Redirecting to /request");
//     window.location.href = "/request"; // Redirect if email does not exist
//   }
// };


// msalInstance.addEventCallback((event) => {
//   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//     handleLoginSuccess(event.payload.account);
//   }
// });

// const App = () => {
//   return (
//     <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//       <MsalProvider instance={msalInstance}>
//         <Router>
//           <Routes>
//             <Route path="/" element={<CreateAcc />} />
//             <Route path="/request" element={<Questionnaire />} />
//             <Route path="/redirect" element={<RedirectPage />} />
//           </Routes>
//         </Router>
//       </MsalProvider>
//     </GoogleOAuthProvider>
//   );
// };

// export default App;



// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication, EventType } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Questionnaire from './Questionnaire';
// import RedirectPage from './RedirectPage';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// msalInstance.addEventCallback((event) => {
//   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//     const account = event.payload.account;
//     msalInstance.setActiveAccount(account);
//     sessionStorage.setItem('userMEmail', account.username); // Store Microsoft email
//     // window.location.href = '/request';
//   }
// });

// class App extends Component {
//   render() {
//     return (
//       <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//         <MsalProvider instance={msalInstance}>
//           <Router>
//             <Routes>
//               <Route path="/" element={<CreateAcc />} />
//               <Route path="/request" element={<Questionnaire />} />
//               <Route path='/redirect' element={<RedirectPage/>}/>
//             </Routes>
//           </Router>
//         </MsalProvider>
//       </GoogleOAuthProvider>
//     );
//   }
// }

// export default App;
// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Sample from './Sample';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);


// class App extends Component {
//   render() {
//     return (
//       <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//         <MsalProvider instance={msalInstance}>
//           <Router>
//             <Routes>
//               <Route path="/" element={<CreateAcc />} />
//               <Route path="/request" element={<Sample />} />
//             </Routes>
//           </Router>
//         </MsalProvider>
//       </GoogleOAuthProvider>
//     );
//   }
// }

// export default App;

// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Sample from './Sample';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// class App extends Component {
//   render() {
//     return (
//       <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//         <MsalProvider instance={msalInstance}>
//           <Router>
//             <Routes>
//               <Route path="/" element={<CreateAcc />} />
//               <Route path="/request" element={<Sample />} />
//             </Routes>
//           </Router>
//         </MsalProvider>
//       </GoogleOAuthProvider>
//     );
//   }
// }

// export default App;


// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication, EventType } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Sample from './Sample';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// msalInstance.addEventCallback((event) => {
//   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//     const account = event.payload.account;
//     msalInstance.setActiveAccount(account);
//     window.location.href = '/request';
//   }
// });

// class App extends Component {
//   render() {
//     return (
//       <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//         <MsalProvider instance={msalInstance}>
//           <Router>
//             <Routes>
//               <Route path="/" element={<CreateAcc />} />
//               <Route path="/request" element={<Sample />} />
//             </Routes>
//           </Router>
//         </MsalProvider>
//       </GoogleOAuthProvider>
//     );
//   }
// }

// export default App;




// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { PublicClientApplication, EventType } from '@azure/msal-browser';
// import { MsalProvider } from '@azure/msal-react';
// import CreateAcc from './CreateAcc';
// import Questionnaire from './Questionnaire';
// import Sample from './Sample';

// const msalConfig = {
//   auth: {
//     clientId: 'b253a045-7c2a-4af1-9cd0-0fb3ab0b195c',
//     authority: 'https://login.microsoftonline.com/common',
//     redirectUri: 'http://localhost:3000/request'
//   }
// };

// const msalInstance = new PublicClientApplication(msalConfig);

// msalInstance.addEventCallback((event) => {
//   if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
//     const account = event.payload.account;
//     msalInstance.setActiveAccount(account);
//     window.location.href = '/request';
//   }
// });

// class App extends Component {
//   render() {
//     return (
//       <GoogleOAuthProvider clientId="974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com">
//         <MsalProvider instance={msalInstance}>
//           <Router>
//             <Routes>
//               <Route path="/" element={<CreateAcc />} />
//               {/*<Route path="/request" element={<Questionnaire />} />*/}
//               <Route path="/request" element={<Sample />} />
//             </Routes>
//           </Router>
//         </MsalProvider>
//       </GoogleOAuthProvider>
//     );
//   }
// }

// export default App;