import React, { Component } from 'react';
import './CreateAcc.css';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { TiVendorMicrosoft } from "react-icons/ti";
import withGoogleLogin from './withGoogleLogin';
import withMsal from './withMsal';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import logo from './logo.png';
import Swal from 'sweetalert2';

class CreateAcc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginForm: false,
      email: '',
      password: '',
      error: "",
      loading: false,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleToggleForm = this.handleToggleForm.bind(this);
    this.extractUserInfo = this.extractUserInfo.bind(this);
    this.checkDomainName = this.checkDomainName.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  extractUserInfo(email) {
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
  }

  async checkDomainName(domainName) {
    console.log("checkDomainName called");

    const sessionId = sessionStorage.getItem('session_id'); // Get session id for authorization

    try {
      const response = await axios.post("http://localhost:8080/Kuber_Fixed/CheckDomainCount", {
        domain_name: domainName
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': sessionId
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
        return false;
      }
      return true;
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error);
      return false;
    }
  }

  async handleSubmit(event) {
    sessionStorage.setItem('authindicator', JSON.stringify(true));

    event.preventDefault();
    this.setState({ loading: true });

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

      if (emails.includes(this.state.email)) {
        this.setState({ error: "User already found. Please login." });
      } else {
        // Extract user info and check the domain name
        const userInfoExtracted = this.extractUserInfo(this.state.email);
        const isDomainValid = await this.checkDomainName(userInfoExtracted.companyName);

        if (isDomainValid) {
          sessionStorage.setItem('userEMailID', this.state.email);
          window.location.href = "/request";
        }
      }
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error);
      this.setState({ error: "An error occurred while validating the email." });
    } finally {
      this.setState({ loading: false });
    }
  }

handleLoginSubmit = async (event) => {
  event.preventDefault();
  const { email, password } = this.state;
  const sessionId = sessionStorage.getItem('session_id');
  this.setState({ loading: true });

  try {
    // Make the API request to fetch user emails and passwords
    const response = await axios.post('http://localhost:8080/Kuber_Fixed/GetUserEmailsPassword', null, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': sessionId
      }
    });

    const userEmailsPasswords = response.data.user_emails || [];
    const userExists = userEmailsPasswords.some(user => user.user_email === email && user.password === password);

    if (userExists) {
      // Navigate to the /redirect page if credentials match
      window.location.href = "/redirect";
     // window.location.href = "/dashboard";
    } else {
      Swal.fire({
        title: 'Invalid data',
        text: 'Invalid email or password. Please try again.',
        icon: 'error',
        showConfirmButton: true
      });
      this.setState({ error: "Invalid email or password. Please try again." });
    }
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error);
    Swal.fire({
      title: 'Error',
      text: 'An error occurred while logging in.',
      icon: 'error',
      showConfirmButton: true
    });
    this.setState({ error: "An error occurred while logging in." });
  } finally {
    this.setState({ loading: false });
  }
};


  handleToggleForm() {
    this.setState(prevState => ({
      showLoginForm: !prevState.showLoginForm,
      email: '',
      password: '',
      error: ''
    }));
  }

  handleGoogleClick = () => {
    const { googleLogin } = this.props;
    googleLogin();
  };

  handleMicrosoftClick = async () => {
    const { msalInstance } = this.props;
    this.setState({ loading: true });

    try {
      await msalInstance.loginRedirect({
        scopes: ["User.Read"]
      });

      await msalInstance.fetchUserProfile();
      // const userEmail = sessionStorage.getItem('userMEmail');
      // this.checkEmailExists(userEmail);
    } catch (error) {
      console.log('Login Failed:', error);
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    this.fetchSessionID();
    document.body.classList.add('create-acc-body');
  }

  componentWillUnmount() {
    document.body.classList.remove('create-acc-body');
  }

  async fetchSessionID() {
    try {
        const requestData = {
            data: {
                p_contact_email_address: 'jayashri.rajagopalan@seertree.com',
                p_password: 'Seertree.7',
                p_aws_user_id: '0741ff01-10f7-44c9-8d51-feb5e1abff29',
                p_os: 'windows',
                p_ip: '127.0.0.1',
                p_browser: 'Chrome'
            }
        };

        console.log('Sending request to fetch session ID:', requestData);

        const response = await axios.post('https://kuberapi.seertree.com/Kuber_Fixed/Login', requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response received:', response);

        // Check the response structure
        const responseData = response.data;
        if (responseData && responseData.Output && responseData.Output.length > 0) {
            const sessionId = responseData.Output[0].session_id; // Adjust this based on the actual response structure
            if (sessionId) {
                sessionStorage.setItem('session_id', sessionId);
                console.log('Session ID fetched successfully:', sessionId);
            } else {
                console.error('Session ID is undefined in the response data:', responseData);
            }
        } else {
            console.error('Response data is empty or does not contain the expected structure:', responseData);
        }
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up the request:', error.message);
        }
        console.error('Full error object:', error);
    }
}


  render() {
    const { showLoginForm, email, password, error, loading } = this.state;
    return (
      <div className="create-acc-container">
        <div className="create-acc-form-container">
          <img src={logo} alt="Logo" className="logo" />
          {showLoginForm ? (
            <form onSubmit={this.handleLoginSubmit}>
              <input
                type="email"
                name="email"
                value={email}
                onChange={this.handleInputChange}
                placeholder="Email address*"
                required
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Password*"
                required
              />
              <button type="submit" className="btn">Login</button>
            </form>
          ) : (
            <>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="email"
                  placeholder="Email address*"
                  value={this.state.email}
                  onChange={this.handleEmailChange}
                  required
                />
                <button type="submit" className="btn">Continue</button>
                {error && <p style={{ color: "red" }}>{error}</p>}
              </form>
              <p>Already have an account? <a href="#" onClick={this.handleToggleForm}>Login</a></p>
              <div className="create-acc-divider">
                <span>OR</span>
              </div>
              <div className="create-acc-social-login">
                <button className="google" onClick={this.handleGoogleClick}>
                  <div className="icon-text-container">
                    <span className="icon"><FcGoogle className="googleIcon" /></span>
                    <span>Continue with Google</span>
                  </div>
                </button>
                <button className="microsoft" onClick={this.handleMicrosoftClick}>
                  <div className="icon-text-container">
                    <span className="icon"><TiVendorMicrosoft className="microsoftIcon" /></span>
                    <span>Continue with Microsoft</span>
                  </div>
                </button>
                <button className="apple" onClick={() => window.location.href = 'https://www.apple.com'}>
                  <div className="icon-text-container">
                    <span className="icon"><FaApple className="appleIcon" /></span>
                    <span>Continue with Apple</span>
                  </div>
                </button>
              </div>
            </>
          )}
        </div>
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
      </div>
    );
  }
}

export default withGoogleLogin(withMsal(CreateAcc));
// import React, { Component } from 'react';
// import './CreateAcc.css';
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { TiVendorMicrosoft } from "react-icons/ti";
// import withGoogleLogin from './withGoogleLogin';
// import withMsal from './withMsal';
// import axios from 'axios';
// import { PulseLoader } from 'react-spinners';
// import logo from './logo.png';

// class CreateAcc extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       showLoginForm: false,
//       email: '',
//       password: '',
//       error: "",
//       loading: false,
//     };

//     this.handleEmailChange = this.handleEmailChange.bind(this);
//     this.handleInputChange = this.handleInputChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
//     this.handleToggleForm = this.handleToggleForm.bind(this);
//   }

//   handleEmailChange(event) {
//     this.setState({ email: event.target.value });
//   }

//   handleInputChange(event) {
//     this.setState({ [event.target.name]: event.target.value });
//   }

//   async handleSubmit(event) {
//     event.preventDefault();
//     this.setState({ loading: true });

//     const sessionId = sessionStorage.getItem('session_id');

//     try {
//       const response = await axios.post("http://localhost:8080/Kuber_Fixed/GetUserEmails", null, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': sessionId
//         }
//       });

//       const userEmails = response.data.user_emails || [];
//       const emails = userEmails.map((obj) => obj.user_email);

//       if (emails.includes(this.state.email)) {
//         this.setState({ error: "User already found. Please login." });
//       } else {
//         sessionStorage.setItem('userEMailID', this.state.email);
//         window.location.href = "/request";
//       }
//     } catch (error) {
//       console.error('API Error:', error.response ? error.response.data : error);
//       this.setState({ error: "An error occurred while validating the email." });
//     } finally {
//       this.setState({ loading: false });
//     }
//   }

//   handleLoginSubmit(event) {
//     event.preventDefault();
//     const { email, password } = this.state;
//     console.log('Login details:', { email, password });
//     // Add login logic here
//   }

//   handleToggleForm() {
//     this.setState(prevState => ({
//       showLoginForm: !prevState.showLoginForm,
//       email: '',
//       password: '',
//       error: ''
//     }));
//   }

//   handleGoogleClick = () => {
//     const { googleLogin } = this.props;
//     googleLogin();
//   };

//   handleMicrosoftClick = async () => {
//     const { msalInstance } = this.props;
//     this.setState({ loading: true });

//     try {
//       await msalInstance.loginRedirect({
//         scopes: ["User.Read"]
//       });

//       await msalInstance.fetchUserProfile();
//     } catch (error) {
//       console.log('Login Failed:', error);
//       this.setState({ loading: false });
//     }
//   };

//   componentDidMount() {
//     this.fetchSessionID();
//     document.body.classList.add('create-acc-body');
//   }

//   componentWillUnmount() {
//     document.body.classList.remove('create-acc-body');
//   }

//   async fetchSessionID() {
//     try {
//         const requestData = {
//             data: {
//                 p_contact_email_address: 'jayashri.rajagopalan@seertree.com',
//                 p_password: 'Seertree.7',
//                 p_aws_user_id: '0741ff01-10f7-44c9-8d51-feb5e1abff29',
//                 p_os: 'windows',
//                 p_ip: '127.0.0.1',
//                 p_browser: 'Chrome'
//             }
//         };

//         console.log('Sending request to fetch session ID:', requestData);

//         const response = await axios.post('https://kuberapi.seertree.com/Kuber_Fixed/Login', requestData, {
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log('Response received:', response);

//         // Check the response structure
//         const responseData = response.data;
//         if (responseData && responseData.Output && responseData.Output.length > 0) {
//             const sessionId = responseData.Output[0].session_id; // Adjust this based on the actual response structure
//             if (sessionId) {
//                 sessionStorage.setItem('session_id', sessionId);
//                 console.log('Session ID fetched successfully:', sessionId);
//             } else {
//                 console.error('Session ID is undefined in the response data:', responseData);
//             }
//         } else {
//             console.error('Response data is empty or does not contain the expected structure:', responseData);
//         }
//     } catch (error) {
//         if (error.response) {
//             console.error('Error response data:', error.response.data);
//         } else if (error.request) {
//             console.error('Error request data:', error.request);
//         } else {
//             console.error('General error:', error.message);
//         }
//     }
// }

//   render() {
//     return (
//       <div className="CreateAcc">
//         <header className="CreateAcc-header">
//           <img src={logo} alt="Logo" className="CreateAcc-logo" />
//           <h1 className="CreateAcc-title">Create an Account</h1>
//           <p>Sign in using one of the following options:</p>
//           <div className="CreateAcc-buttons">
//             <button onClick={this.handleGoogleClick} className="CreateAcc-button">
//               <FcGoogle size={24} />
//               Google
//             </button>
//             <button onClick={this.handleMicrosoftClick} className="CreateAcc-button">
//               <TiVendorMicrosoft size={24} />
//               Microsoft
//             </button>
//             <button onClick={this.handleToggleForm} className="CreateAcc-button">
//               <FaApple size={24} />
//               Apple
//             </button>
//           </div>
//           {this.state.showLoginForm && (
//             <form onSubmit={this.handleLoginSubmit} className="CreateAcc-loginForm">
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={this.state.email}
//                 onChange={this.handleEmailChange}
//                 required
//               />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={this.state.password}
//                 onChange={this.handleInputChange}
//                 required
//               />
//               <button type="submit">Login</button>
//               {this.state.error && <p className="error">{this.state.error}</p>}
//             </form>
//           )}
//           {this.state.loading && <PulseLoader />}
//         </header>
//       </div>
//     );
//   }
// }

// export default withGoogleLogin(withMsal(CreateAcc));