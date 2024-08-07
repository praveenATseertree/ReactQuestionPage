// import React, { useState, useEffect } from 'react';

// const Sample = () => {
//   const [userEmail, setUserEmail] = useState('');

//   useEffect(() => {
//     // Retrieve the email from sessionStorage when the component mounts
//     const storedEmail = sessionStorage.getItem('userEmail');
//     if (storedEmail) {
//       setUserEmail(storedEmail);
//     } else {
//       // Handle case where no email is found in sessionStorage
//       setUserEmail('No email found');
//     }
//   }, []);

//   return (
//     <div className="sample-container">
//       <h1>User Email</h1>
//       <p>{userEmail}</p>
//     </div>
//   );
// };

// export default Sample;

// import React, { Component } from 'react';

// class Sample extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userEmail: ''
//     };
//   }

//   componentDidMount() {
//     // Retrieve the email from sessionStorage when the component mounts
//     const storedEmail = sessionStorage.getItem('userEmail'|| '22a846e2-8117-4df5-8201-1fb304a44e57.13776daa-0842-409e-833a-dbeb8e9a57c6-login.windows.net-13776daa-0842-409e-833a-dbeb8e9a57c6');
//     if (storedEmail) {
//       this.setState({ userEmail: storedEmail });
//     } else {
//       // Handle case where no email is found in sessionStorage
//       this.setState({ userEmail: 'No email found' });
//     }
//   }

//   render() {
//     const { userEmail } = this.state;

//     return (
//       <div className="sample-container">
//         <h1>User Email</h1>
//         <p>{userEmail}</p>
//       </div>
//     );
//   }
// }

// export default Sample;
// import React, { Component } from 'react';

// class Sample extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       userEmail: '',
//       firstName: '',
//       lastName: '',
//       companyName: ''
//     };
//   }

//   componentDidMount() {
//     // Retrieve the email from sessionStorage when the component mounts
//     const email = this.getEmailFromSession();
//     if (email) {
//       const userInfo = this.extractUserInfo(email);
//       this.setState({
//         userEmail: email,
//         firstName: userInfo.firstName,
//         lastName: userInfo.lastName,
//         companyName: userInfo.companyName
//       });
//     } else {
//       // Handle case where no email is found in sessionStorage
//       this.setState({ userEmail: 'No email found' });
//     }
//   }

//   getEmailFromSession = () => {
//     const accountIdKey = 'msal.account.keys';
//     const accountId = JSON.parse(sessionStorage.getItem(accountIdKey))[0];
//     const accountKey = `${accountId}`;
//     const accountInfo = JSON.parse(sessionStorage.getItem(accountKey));
//     return accountInfo.username; // This will be the user's email
//   };

//   extractUserInfo = (email) => {
//     const [localPart, domainPart] = email.split('@');
//     const [firstName, lastName] = localPart.split('.');
//     const companyName = domainPart.split('.')[0];

//     return {
//       firstName: firstName || localPart, // If there's no dot in localPart, it's the first name
//       lastName: lastName || '', // If there's no dot, lastName is empty
//       companyName: companyName
//     };
//   };

//   render() {
//     const { userEmail, firstName, lastName, companyName } = this.state;

//     return (
//       <div className="sample-container">
//         <h1>User Email</h1>
//         <p>{userEmail}</p>
//         <h2>Autofilled User Info</h2>
//         <p>First Name: {firstName}</p>
//         <p>Last Name: {lastName}</p>
//         <p>Company Name: {companyName}</p>
//       </div>
//     );
//   }
// }

// export default Sample;

import React, { Component } from 'react';

class Sample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      firstName: '',
      lastName: '',
      companyName: ''
    };
  }

  componentDidMount() {
    const email = this.getEmailFromSession();
    if (email) {
      const userInfo = this.extractUserInfo(email);
      this.setState({
        userEmail: email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        companyName: userInfo.companyName
      });
    } else {
      this.setState({ userEmail: 'No email found' });
    }
  }

  getEmailFromSession = () => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userMEmail = sessionStorage.getItem('userMEmail');
    return userEmail || userMEmail;
  };

  extractUserInfo = (email) => {
    const [localPart, domainPart] = email.split('@');
    const [firstName, lastName] = localPart.split('.');
    const companyName = domainPart.split('.')[0];

    return {
      firstName: firstName || localPart,
      lastName: lastName || '',
      companyName: companyName
    };
  };

  render() {
    const { userEmail, firstName, lastName, companyName } = this.state;

    return (
      <div className="sample-container">
        <h1>User Email</h1>
        <p>{userEmail}</p>
        <h2>Autofilled User Info</h2>
        <p>First Name: {firstName}</p>
        <p>Last Name: {lastName}</p>
        <p>Company Name: {companyName}</p>
      </div>
    );
  }
}

export default Sample;

