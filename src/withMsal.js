// import React from 'react';
// import { useMsal } from '@azure/msal-react';

// const withMsal = (Component) => {
//     return (props) => {
//         const { instance } = useMsal();
//         return <Component {...props} msalInstance={instance} />;
//     };
// };
// src/withMsal.js
// import React from 'react';
// import { useMsal } from '@azure/msal-react';

// const withMsal = (Component) => {
//   return (props) => {
//     const { instance } = useMsal();

//     const msalInstance = {
//       loginRedirect: async (loginRequest) => {
//         try {
//           await instance.loginRedirect(loginRequest);
//         } catch (error) {
//           console.log('Login Failed:', error);
//         }
//       },
//       fetchUserProfile: async () => {
//         try {
//           const response = await instance.acquireTokenSilent({
//             scopes: ["User.Read"]
//           });

//           // Fetch user info from Microsoft Graph
//           const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
//             headers: {
//               'Authorization': `Bearer ${response.accessToken}`
//             }
//           }).then(response => response.json());

//           // Store email in sessionStorage and print it
//           const userEmail = userResponse.mail || userResponse.userPrincipalName;
//           sessionStorage.setItem('userMEmail', userEmail);
//           console.log('Microsoft User Email:', userEmail);
//         } catch (error) {
//           console.log('Fetching User Profile Failed:', error);
//         }
//       }
//     };

//     return <Component {...props} msalInstance={msalInstance} />;
//   };
// };

// export default withMsal;
// import React from 'react';
// import { useMsal } from '@azure/msal-react';

// const withMsal = (Component) => {
//   return (props) => {
//     const { instance } = useMsal();

//     const msalInstance = {
//       loginRedirect: async (loginRequest) => {
//         try {
//           await instance.loginRedirect(loginRequest);
//         } catch (error) {
//           console.log('Login Failed:', error);
//         }
//       },
//       fetchUserProfile: async () => {
//         try {
//           const response = await instance.acquireTokenSilent({
//             scopes: ["User.Read"]
//           });

//           // Fetch user info from Microsoft Graph
//           const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
//             headers: {
//               'Authorization': `Bearer ${response.accessToken}`
//             }
//           }).then(response => response.json());

//           // Store email in sessionStorage and redirect
//           const userEmail = userResponse.mail || userResponse.userPrincipalName;
//           sessionStorage.setItem('userMEmail', userEmail);
//           console.log('Microsoft User Email:', userEmail);

//           // Redirect to /request
//           window.location.href = '/request';
//         } catch (error) {
//           console.log('Fetching User Profile Failed:', error);
//         }
//       }
//     };

//     return <Component {...props} msalInstance={msalInstance} />;
//   };
// };

// export default withMsal;
// import React from 'react';
// import { useMsal } from '@azure/msal-react';

// const withMsal = (Component) => {
//   return (props) => {
//     const { instance } = useMsal();

//     const msalInstance = {
//       loginRedirect: async (loginRequest) => {
//         try {
//           await instance.loginRedirect(loginRequest);
//         } catch (error) {
//           console.log('Login Failed:', error);
//         }
//       },
//       fetchUserProfile: async () => {
//         try {
//           const response = await instance.acquireTokenSilent({
//             scopes: ["User.Read"]
//           });

//           // Fetch user info from Microsoft Graph
//           const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
//             headers: {
//               'Authorization':` Bearer ${response.accessToken}`
//             }
//           }).then(response => response.json());

//           // Store email in sessionStorage and print it
//           const userEmail = userResponse.mail || userResponse.userPrincipalName;
//           sessionStorage.setItem('userMEmail', userEmail);
//           console.log('Microsoft User Email:', userEmail);
//         } catch (error) {
//           console.log('Fetching User Profile Failed:', error);
//         }
//       }
//     };

//     return <Component {...props} msalInstance={msalInstance} />;
//   };
// };

// export default withMsal;

import React from 'react';
import { useMsal } from '@azure/msal-react';

const withMsal = (Component) => {
  return (props) => {
    const { instance } = useMsal();

    const msalInstance = {
      loginRedirect: async (loginRequest) => {
        try {
          await instance.loginRedirect(loginRequest);
        } catch (error) {
          console.log('Login Failed:', error);
        }
      },
      fetchUserProfile: async () => {
        try {
          const response = await instance.acquireTokenSilent({
            scopes: ["User.Read"]
          });

          const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
              'Authorization': `Bearer ${response.accessToken}`
            }
          }).then(response => response.json());

          const userEmail = userResponse.mail || userResponse.userPrincipalName;
          sessionStorage.setItem('userMEmail', userEmail);
          console.log('Microsoft User Email:', userEmail);
        } catch (error) {
          console.log('Fetching User Profile Failed:', error);
        }
      }
    };

    return <Component {...props} msalInstance={msalInstance} />;
  };
};

export default withMsal;
