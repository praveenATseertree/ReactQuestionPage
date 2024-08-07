// import React from 'react';
// import { useGoogleLogin } from '@react-oauth/google';

// const withGoogleLogin = (Component) => {
//   return (props) => {
//     const googleLogin = useGoogleLogin({
//       clientId: "974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com",
//       scope: "profile email",
//       onSuccess: async tokenResponse => {
//         const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`
//           }
//         }).then(res => res.json());

//         sessionStorage.setItem('userEMailID', userInfo.email);

//         // Check if the email exists after setting it in sessionStorage
//         if (props.checkEmailExists) {
//           console.log('reached')
//           props.checkEmailExists(userInfo.email);
//         }
//       },
//       onFailure: (response) => {
//         console.error('Google login failed:', response);
//       }
//     });

//     return <Component {...props} googleLogin={googleLogin} />;
//   };
// };

// export default withGoogleLogin;
// import React from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';

// const withGoogleLogin = (Component) => {
//   return (props) => {
//     const googleLogin = useGoogleLogin({
//       clientId: "974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com",
//       scope: "profile email",
//       onSuccess: async (tokenResponse) => {
//         const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//           headers: {
//             Authorization: `Bearer ${tokenResponse.access_token}`
//           }
//         }).then(res => res.json());

//         sessionStorage.setItem('userEMailID', userInfo.email);

//         // Check if the email exists after setting it in sessionStorage
//         checkEmailExists(userInfo.email);
//       },
//       onFailure: (response) => {
//         console.error('Google login failed:', response);
//       }
//     });

//     const checkEmailExists = async (email) => {
//       const sessionId = sessionStorage.getItem('session_id');
//       try {
//         const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': sessionId
//           }
//         });

//         const userEmails = response.data.user_emails || [];
//         const emails = userEmails.map((obj) => obj.user_email);

//         if (emails.includes(email)) {
//           window.location.href = "/redirect";
//         } else {
//           window.location.href = "/request";
//         }
//       } catch (error) {
//         console.error('API Error:', error.response ? error.response.data : error);
//       }
//     };

//     return <Component {...props} googleLogin={googleLogin} />;
//   };
// };

// export default withGoogleLogin;
// import React, { useState } from 'react';
// import { useGoogleLogin } from '@react-oauth/google';
// import axios from 'axios';
// import { PulseLoader } from 'react-spinners';

// const withGoogleLogin = (Component) => {
//   return (props) => {
//     const [loading, setLoading] = useState(false);

//     const googleLogin = useGoogleLogin({
//       clientId: "974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com",
//       scope: "profile email",
//       onSuccess: async (tokenResponse) => {
//         setLoading(true);
//         try {
//           const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
//             headers: {
//               Authorization: `Bearer ${tokenResponse.access_token}`
//             }
//           }).then(res => res.json());

//           sessionStorage.setItem('userEMailID', userInfo.email);

//           // Check if the email exists after setting it in sessionStorage
//           checkEmailExists(userInfo.email);
//         } catch (error) {
//           console.error('Google login failed:', error);
//           setLoading(false);
//         }
//       },
//       onFailure: (response) => {
//         console.error('Google login failed:', response);
//         setLoading(false);
//       }
//     });

//     const checkEmailExists = async (email) => {
//       const sessionId = sessionStorage.getItem('session_id');
//       try {
//         const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': sessionId
//           }
//         });

//         const userEmails = response.data.user_emails || [];
//         const emails = userEmails.map((obj) => obj.user_email);

//         if (emails.includes(email)) {
//           window.location.href = "/redirect";
//         } else {
//           window.location.href = "/request";
//         }
//       } catch (error) {
//         console.error('API Error:', error.response ? error.response.data : error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <>
//         <Component {...props} googleLogin={googleLogin} />
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
//       </>
//     );
//   };
// };

// export default withGoogleLogin;
import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import Swal from 'sweetalert2';

const withGoogleLogin = (Component) => {
  return (props) => {
    const [loading, setLoading] = useState(false);

    const googleLogin = useGoogleLogin({
      clientId: "974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com",
      scope: "profile email",
      onSuccess: async (tokenResponse) => {
        setLoading(true);
        try {
          const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }).then(res => res.json());

          const email = userInfo.email;
          sessionStorage.setItem('userEMailID', email);

          // First, check if the email exists
          const emailExists = await checkEmailExists(email);

          if (emailExists) {
            window.location.href = "/redirect"; // Redirect if email exists
            //window.location.href = "/dashboard";
            return; // Skip further processing
          }

          // Extract user info and check the domain name
          const userInfoExtracted = extractUserInfo(email);
          const domainCheckPassed = await checkDomainName(userInfoExtracted.companyName);
          console.log(domainCheckPassed)

          if (domainCheckPassed) {
            window.location.href = "/request"; // Redirect if domain does not exist
          }

        } catch (error) {
          console.error('Google login failed:', error);
        } finally {
          setLoading(false);
        }
      },
      onFailure: (response) => {
        console.error('Google login failed:', response);
        setLoading(false);
      }
    });

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

    // const checkDomainName = async (domainName) => {
    //   try {
    //     const response = await axios.post("http://localhost:8080/Kuber_Fixed/CheckDomainCount", {
    //       domain_name: domainName
    //     }, {
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });

    //     console.log('Domain Check Response:', response.data);

    //     const { count } = response.data;
    //     console.log('count',count)

    //     if (count > 0) {
    //       Swal.fire({
    //         title: 'Domain Already Found',
    //         text: `The domain ${domainName} already exists with ${count} records.`,
    //         icon: 'warning',
    //         confirmButtonText: 'OK'
    //       });
    //       return false; // Domain exists
    //     } else {
    //       return true; // Domain does not exist
    //     }
        
    //   } catch (error) {
    //     console.error('API Error:', error.response ? error.response.data : error);
    //     return false;
    //   }
    // };
    const checkDomainName = async (domainName) => {
      try {
        // Retrieve session ID from sessionStorage
        const sessionId = sessionStorage.getItem('session_id');
    
        // Make sure sessionId exists before proceeding
        if (!sessionId) {
          console.error('Session ID is not available');
          return false;
        }
    
        // Make the API request with Authorization header
        const response = await axios.post(
          "http://localhost:8080/Kuber_Fixed/CheckDomainCount",
          { domain_name: domainName },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionId
            }
          }
        );
    
        console.log('Domain Check Response:', response.data);
    
        const { count } = response.data;
    
        if (count > 0) {
          Swal.fire({
            title: 'Domain Already Found',
            text: `The domain ${domainName} already exists with ${count} records.`,
            icon: 'warning',
            confirmButtonText: 'OK'
          });
          return false; // Domain exists
        } else {
          return true; // Domain does not exist
        }
    
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error);
        return false;
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

        return emails.includes(email); // Return true if email exists
      } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error);
        return false;
      }
    };

    return (
      <>
        <Component {...props} googleLogin={googleLogin} />
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
      </>
    );
  };
};

export default withGoogleLogin;

