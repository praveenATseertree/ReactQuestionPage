import React, { Component } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import ReactCountryFlagsSelect from 'react-country-flags-select';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './Questionnaire.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import PulseLoader from 'react-spinners/PulseLoader';
import { ReactCountryDropdown } from 'react-country-dropdown';
import { Password } from 'primereact/password';
import 'react-country-dropdown/dist/index.css';
import { PasswordField } from '@aws-amplify/ui-react';
import { Select, MenuItem, FormControl, InputLabel, FormHelperText } from '@mui/material';

const countryCurrencyMapping = {
  'United Arab Emirates': 'AED',
  'China': 'CNY',
  'Russia': 'RUB',
  'Sri Lanka': 'LKR',
  'Singapore': 'SGD',
  'Malaysia': 'MYR',
  'Saudi Arabia': 'SAR',
  'Kuwait': 'KWD',
  'Qatar': 'QAR',
  'Australia': 'AUD',
  'Bangladesh': 'BDT',
  'Brazil': 'BRL',
  'Canada': 'CAD',
  'Hong Kong': 'HKD',
  'India': 'INR',
  'Italy': 'EUR',
  'Japan': 'JPY',
  'New Zealand': 'NZD',
  'Pakistan': 'PKR',
  'Peru': 'PEN',
  'Philippines': 'PHP',
  'United States of America': 'USD',
  'United Kingdom of Great Britain and Northern Ireland': 'GBP',
};

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      Questionnaire_Response: {
        firstName: '',
        lastName: '',
        companyName: '',
        companyShortCode: '',
        country: null,
        baseCurrency: '',
        financialYear: '',
        accountingPeriodYear: '',
        accountingPeriodMonth: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false
      },
      username: '',
      errors: {
        passwordMismatch: '',
        country: '',
        baseCurrency: '',
      },
      passwordMatch: true,
      isTermsDialogOpen: false, // State to manage the modal visibility
      isSuccessDialogOpen: false,
      loading: false // State to manage the success dialog visibility
    };
  }
  
    componentDidMount() {
      const email = this.getEmailFromSession();
      if (email) {
        const userInfo = this.extractUserInfo(email);
        this.setState(prevState => ({
          Questionnaire_Response: {
            ...prevState.Questionnaire_Response, // Preserve existing state
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            companyName: userInfo.companyName
          },
          userEmail: email
        }));
      } else {
        this.setState({ userEmail: 'No email found' });
      }
    }
    
 
  getEmailFromSession = () => {
    const userEmail = sessionStorage.getItem('userEmail');
    const userMEmail = sessionStorage.getItem('userMEmail');
    const userEMailID = sessionStorage.getItem('userEMailID');
    const email = userEmail || userMEmail || userEMailID;
    
    this.setState({ username: email }, () => {
      console.log('extracted mailid:', this.state.username);
    });
  
    return email;
  };
  
  


  extractUserInfo = (email) => {
    const [localPart, domainPart] = email.split('@');
    if (!domainPart) {
      // Handle cases where the email format is incorrect
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

  handleResponse = () => {
    if (this.validateForm()) {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
      }));
    }
  };


  handleBack = () => {
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex - 1
    }));
  };


  handleInputChange = (event) => {
    const { name, value } = event.target;
  
    // Capitalize the first letter of input if it's not empty
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
  
    this.setState(prevState => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        [name]: capitalizedValue
      }
    }));
  };
  

  handleDateChange = (date) => {
    this.setState(prevState => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        accountingPeriodYear: date.year(),
        accountingPeriodMonth: date.month() + 1 // month() returns 0-11, so adding 1 to make it 1-12
      }
    }));
  };

  
  handleCountrySelect = (event) => {
    const selectedCountryName = event.target.value;
    const defaultFinancialYear = selectedCountryName === 'India' ? 'Apr-Mar' : 'Jan-Dec';
    
    // Calculate the default accounting period date
    const currentYear = dayjs().year();
    const defaultAccountingPeriod = defaultFinancialYear === 'Apr-Mar'
      ? dayjs(`${currentYear}-04-01`)
      : dayjs(`${currentYear}-01-01`);
    
    const baseCurrency = countryCurrencyMapping[selectedCountryName] || this.state.Questionnaire_Response.baseCurrency;
    
    this.setState((prevState) => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        country: selectedCountryName,
        baseCurrency: baseCurrency,
        financialYear: defaultFinancialYear,
        accountingPeriodYear: defaultAccountingPeriod.year(), // Store the year
        accountingPeriodMonth: defaultAccountingPeriod.month() + 1, // Store the month (month is zero-based)
      },
      errors: {
        ...prevState.errors,
        country: '', // Clear any existing errors when a country is selected
      },
    }));
  };

  handleCheckboxChange = (event) => {
    const { checked } = event.target;
    this.setState(prevState => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        termsAccepted: checked
      }
    }));
  };

  
  handleClear = () => {
    const { currentQuestionIndex, Questionnaire_Response } = this.state;
    const updatedResponse = { ...Questionnaire_Response };
  
    // Clear fields based on current question index
    switch (currentQuestionIndex) {
      case 0:
        updatedResponse.firstName = '';
        updatedResponse.lastName = '';
        break;
      case 1:
        updatedResponse.companyName = '';
        updatedResponse.companyShortCode = '';
        break;
      case 2:
        updatedResponse.country = null;
        break;
      case 3:
        updatedResponse.baseCurrency = '';
        break;
      case 4:
        updatedResponse.financialYear = '';
        break;
      case 5:
        updatedResponse.accountingPeriodYear = '';
        updatedResponse.accountingPeriodMonth = '';
        break;
      case 6:
        updatedResponse.termsAccepted = false;
        break;
      default:
        break;
    }
  
    this.setState({
      Questionnaire_Response: updatedResponse,
      errors: {}
    });
  };
  
  // handlePasswordChange = (event) => {
  //   const { name, value } = event.target;
  //   this.setState((prevState) => {
  //     const updatedResponse = {
  //       ...prevState.Questionnaire_Response,
  //       [name]: value,
  //     };

  //     return {
  //       Questionnaire_Response: updatedResponse,
  //       passwordMatch: updatedResponse.password === updatedResponse.confirmPassword,
  //     };
  //   });
  // };

  handlePasswordChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        [name]: value
      }
    }));
  };
  
  
  getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  handleSubmit = async () => {
    this.setState({ loading: true }); // Start the spinner

    const { Questionnaire_Response, username } = this.state;
    const { password, confirmPassword } = Questionnaire_Response;

  // Check if passwords match
  if (password !== confirmPassword) {
    Swal.fire({
      title: 'Password Mismatch',
      text: 'Passwords do not match. Please try again.',
      icon: 'error',
      showConfirmButton: false
    });
    this.setState({ loading: false }); // Stop the spinner
    return; // Exit the function without submitting
  }


    // Log the user responses
    console.log('User responses:', Questionnaire_Response);

    const dataToSend = {
      p_first_name: String(Questionnaire_Response.firstName || ''), // Ensure this is a string
      p_last_name: String(Questionnaire_Response.lastName || ''), // Ensure this is a string
      p_company_name: String(Questionnaire_Response.companyName || ''), // Ensure this is a string
      p_company_short_code: String(Questionnaire_Response.companyShortCode || ''), // Ensure this is a string
      p_country: String(Questionnaire_Response.country ? Questionnaire_Response.country.label : ''), // Ensure this is a string
      p_base_currency: String(Questionnaire_Response.baseCurrency || ''), // Ensure this is a string
      p_financial_year: String(Questionnaire_Response.financialYear || ''), // Ensure this is a string
      p_accounting_period_year: String(Questionnaire_Response.accountingPeriodYear || ''), // Ensure this is a string
      p_user_email: String(username ? String(username) : ''), // Ensure this is a string
      p_accounting_period_month: String(Questionnaire_Response.accountingPeriodMonth || ''), // Ensure this is a string
      p_terms_accepted: String(Questionnaire_Response.termsAccepted), // Ensure this is a string
      p_domain_name: String(Questionnaire_Response.companyName || ''), // Ensure this is a string
      p_start_date: this.getCurrentDate(), // Ensure this is a string
      p_end_date: this.getCurrentDate(),
      p_created_by: String(Questionnaire_Response.firstName || ''), // Ensure this is a string
      p_creation_date: this.getCurrentDate(), // Pass the current date
      p_last_update_date: this.getCurrentDate(), // Ensure this is a string
      p_last_updated_by: String(Questionnaire_Response.firstName || ''), // Ensure this is a string
      p_password:String(Questionnaire_Response.password)
    };

    console.log('Data to be sent:', dataToSend);

    // Define the API endpoint
    const apiUrl = 'http://localhost:8080/Kuber_Fixed/RegisteruserApi';

    try {
      // Make the HTTP POST request using axios
      const response = await axios.post(apiUrl, { data: dataToSend });

      // Check if response status code is 200
      if (response.status === 200) {
        const status = response.data?.Output?.[0]?.Status;
        if (status === 'TRUE') {
          Swal.fire({
            title: 'Profile Created',
            text: 'Data submitted successfully!',
            icon: 'success',
            showConfirmButton: false
          });
          window.location.href = "/redirect";
        } else {
          Swal.fire({
            title: 'User Already found',
            text: 'Submission failed!',
            icon: 'error',
            showConfirmButton: false
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Unexpected status code received.',
          icon: 'error',
          showConfirmButton: false
        });
      }
    } catch (error) {
      // Log detailed error response
      if (error.response) {
        console.error('API Response Error:', error.response.data);
        Swal.fire({
          title: 'Error',
          text: error.response.data.Error || 'Error response received from the server',
          icon: 'error',
          showConfirmButton: false
        });
      } else {
        console.error('Network Error:', error.message);
        Swal.fire({
          title: 'Error',
          text: 'Network error occurred',
          icon: 'error',
          showConfirmButton: false
        });
      }
    } finally {
      this.setState({ loading: false }); // Stop the spinner
    }
  };

  validateForm = () => {
    const { Questionnaire_Response } = this.state;
    let valid = true;
    const errors = {};

    if (this.state.currentQuestionIndex === 0) {
      if (!Questionnaire_Response.firstName.trim()) {
        errors.firstName = 'First name is required.';
        valid = false;
      } else {
        errors.firstName = '';
      }
      if (!Questionnaire_Response.lastName.trim()) {
        errors.lastName = 'Last name is required.';
        valid = false;
      } else {
        errors.lastName = '';
      }
    } else if (this.state.currentQuestionIndex === 1) {
      if (!Questionnaire_Response.companyName.trim()) {
        errors.companyName = 'Company Name is required.';
        valid = false;
      } else {
        errors.companyName = '';
      }
      if (!Questionnaire_Response.companyShortCode.trim()) {
        errors.companyShortCode = 'Company Short Code is required.';
        valid = false;
      } else {
        errors.companyShortCode = '';
      }
    } else if (this.state.currentQuestionIndex === 2) {
      if (!Questionnaire_Response.country) {
        errors.country = 'Country is required.';
        valid = false;
      } else {
        errors.country = '';
      }
    } else if (this.state.currentQuestionIndex === 3) {
      if (!Questionnaire_Response.baseCurrency.trim()) {
        errors.baseCurrency = 'Base Currency is required.';
        valid = false;
      } else {
        errors.baseCurrency = '';
      }
    } else if (this.state.currentQuestionIndex === 4) {
      if (!Questionnaire_Response.financialYear.trim()) {
        errors.financialYear = 'Financial Year is required.';
        valid = false;
      } else {
        errors.financialYear = '';
      }
    } else if (this.state.currentQuestionIndex === 5) {
      if (!Questionnaire_Response.accountingPeriodYear || !Questionnaire_Response.accountingPeriodMonth) {
        errors.accountingPeriodYear = 'Accounting Period is required.';
        errors.accountingPeriodMonth = 'Accounting Period is required.';
        valid = false;
      } else {
        errors.accountingPeriodYear = '';
        errors.accountingPeriodMonth = '';
      }
    } else if (this.state.currentQuestionIndex === 6) {
      if (!Questionnaire_Response.termsAccepted) {
        errors.termsAccepted = 'Please accept the Terms and Conditions.';
        valid = false;
      } else {
        errors.termsAccepted = '';
      }
    }

    this.setState({ errors });
    return valid;
  };

  // Function to toggle the modal visibility
  toggleTermsDialog = () => {
    this.setState(prevState => ({ isTermsDialogOpen: !prevState.isTermsDialogOpen }));
  };

  // Function to close the success dialog
  closeSuccessDialog = () => {
    this.setState({ isSuccessDialogOpen: false });
  };

  // handlePasswordChange = (event) => {
  //   console.log('Password Change:', event.target.name, event.target.value); // Debug
  //   const { name, value } = event.target;
  //   this.setState(prevState => ({
  //     Questionnaire_Response: {
  //       ...prevState.Questionnaire_Response,
  //       [name]: value
  //     }
  //   }));
  // };
  // handlePasswordChange = (event) => {
  //   const { name, value } = event.target;
  //   this.setState({ [name]: value }, this.validatePasswords);
  // };

  // validatePasswords = () => {
  //   const { password, confirmPassword } = this.state;
  //   if (password !== confirmPassword) {
  //     this.setState({ errors: { passwordMismatch: 'Passwords do not match' } });
  //   } else {
  //     this.setState({ errors: { passwordMismatch: '' } });
  //   }
  // };


  render() {
    const {loading,currentQuestionIndex, Questionnaire_Response, errors, isTermsDialogOpen, isSuccessDialogOpen } = this.state;

    const { password, confirmPassword } = this.state.Questionnaire_Response;
    const { passwordMatch } = this.state;
   // const progressPercentage = ((currentQuestionIndex + 1) / 7) * 100;
   const totalQuestions = 8; // Total number of questions
   const progressPercentage = (currentQuestionIndex / (totalQuestions - 1)) * 100;
    console.log(currentQuestionIndex)
    console.log(progressPercentage)
    const { firstName } = Questionnaire_Response;
    console.log('Session Storage:', sessionStorage.getItem('authindicator'));
    const authindicator = JSON.parse(sessionStorage.getItem('authindicator'));
    console.log('Parsed authindicator:', authindicator);
    
    console.log('authindicator',authindicator)
    // const questions = [
    //   'Confirm your first name and last name',
    //   'Please enter the name of your Company',
    //   'Please select your Country',
    //   'Please select your Base Currency',
    //   'Please select your Financial Year',
    //   'What would you like your first accounting period to be?',
    //   'Please enter your password',
    //   'Before we get started, please take a moment to review and accept our Terms and Conditions'
    // ];

    const questions = [
      'Confirm your first name and last name',
      'Please enter the name of your Company',
      'Please select your Country',
      'Please select your Base Currency',
      'Please select your Financial Year',
      'What would you like your first accounting period to be?',
      'Please enter your password and accept our Terms and Conditions',
      'Before we get started, please take a moment to review and accept our Terms and Conditions'
    ];

    return (
      <div className="questionnaire-container">
        <div className="header">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              <span className="progress-text">{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

        <div className="back-button">
          {currentQuestionIndex > 0 && <a href="#" onClick={this.handleBack}>Back</a>}
        </div>

        <div className="greeting">
          <h2>Nice to meet you {firstName}!</h2>
          <p>Your answer will help us to give you the best start.</p>
        </div>

        <div className="question">
          <h1>{questions[currentQuestionIndex]}</h1>
          {currentQuestionIndex < 6 }
          {currentQuestionIndex === 0 && (
            <div className="name-inputs">
              <input
                type="text"
                name="firstName"
                placeholder="First name *"
                value={Questionnaire_Response.firstName}
                onChange={this.handleInputChange}
                className={`input-field ${errors.firstName && 'input-error'}`}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              <input
                type="text"
                name="lastName"
                placeholder="Last name *"
                value={Questionnaire_Response.lastName}
                onChange={this.handleInputChange}
                className={`input-field ${errors.lastName && 'input-error'}`}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          )}
          {currentQuestionIndex === 1 && (
            <div className="company-inputs">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name *"
                value={Questionnaire_Response.companyName}
                onChange={this.handleInputChange}
                className={`input-field ${errors.companyName && 'input-error'}`}
              />
              {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              <input
                type="text"
                name="companyShortCode"
                placeholder="Company Short Code *"
                value={Questionnaire_Response.companyShortCode}
                onChange={this.handleInputChange}
                className={`input-field ${errors.companyShortCode && 'input-error'}`}
              />
              {errors.companyShortCode && <span className="error-message">{errors.companyShortCode}</span>}
            </div>
          )}
           {currentQuestionIndex === 2 && (
                <div className="centered-country-selector">
                  <FormControl
                    variant="outlined"
                    error={!!errors.country}
                    style={{ width: '100%' }}
                  >
                    <InputLabel>Please select a country</InputLabel>
                    <Select
                      value={Questionnaire_Response.country}
                      onChange={this.handleCountrySelect}
                      label="Please select a country"
                      style={{ width: '100%', height: '70px' }}
                      className={`country-select ${errors.country && 'input-error'}`}
                    >
                      {Object.keys(countryCurrencyMapping).map((country) => (
                        <MenuItem key={country} value={country}>
                          {country}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
                  </FormControl>
                </div>
                )}
          {currentQuestionIndex === 3 && (
            <input
              type="text"
              name="baseCurrency"
              placeholder="Base Currency *"
              value={Questionnaire_Response.baseCurrency}
              onChange={this.handleInputChange}
              className={`input-field ${errors.baseCurrency && 'input-error'}`}
            />
          )}
          {currentQuestionIndex === 4 && (
            <select
              name="financialYear"
              value={Questionnaire_Response.financialYear}
              onChange={this.handleInputChange}
              className={`input-field ${errors.financialYear && 'input-error'}`}
            >
              <option value="">Select Financial Year *</option>
              <option value="Jan-Dec">Jan-Dec</option>
              <option value="Apr-Mar">Apr-Mar</option>
            </select>
          )}
            {currentQuestionIndex === 5 && (
              <div className="DateMontn-selector">  
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year', 'month']}
                    label="select Accounting period *"
                    minDate={dayjs('2012-03-01')}
                    maxDate={dayjs('3000-01-01')}
                    value={dayjs(`${Questionnaire_Response.accountingPeriodYear}-${Questionnaire_Response.accountingPeriodMonth}-01`)}
                    onChange={this.handleDateChange}
                    renderInput={(params) => <TextField {...params} helperText={null} />}
                    className={`input-field ${errors.accountingPeriodYear && 'input-error'}`}
                  />
                </LocalizationProvider>
                {errors.accountingPeriodYear && <span className="error-message">{errors.accountingPeriodYear}</span>}
                {errors.accountingPeriodMonth && <span className="error-message">{errors.accountingPeriodMonth}</span>}
              </div>
            )}

          
        {/* {currentQuestionIndex === 6 && authindicator && (
          <div className="password-section">
            <div className="password-fields">
                                <Password
                      value={Questionnaire_Response.password}
                      onChange={this.handlePasswordChange}
                      name="password"
                      // placeholder="Password *"
                    />
                    <Password
                      value={Questionnaire_Response.confirmPassword}
                      onChange={this.handlePasswordChange}
                      name="confirmPassword"
                      // placeholder="Confirm Password *"
                    />
              {errors.passwordMismatch && <span className="error-message">{errors.passwordMismatch}</span>}
            </div>
          </div>
        )} */}

          {/* {currentQuestionIndex === 6 && authindicator && (
            <div style={{ display: 'flex', gap: '10px',marginLeft:'510px',alignItems:'center' }}>
            <input
              type="password"
              name="password"
              value={password}
              onChange={this.handlePasswordChange}
              placeholder="Password*"
              required
              style={{ width: '200px', padding: '10px', fontSize: '14px' }}
            />
            <br/>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handlePasswordChange}
              placeholder="Confirm Password*"
              required
              style={{ width: '200px', padding: '10px', fontSize: '14px' }}
            />
          </div>
          
          )} */}

{currentQuestionIndex === 6 && authindicator && (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column', // Stack elements vertically
      gap: '5px',
      marginLeft: '0px',
      alignItems: 'center'
    }}
  >
    
    <input
      type="password"
      name="password"
      value={password}
      onChange={this.handlePasswordChange}
      placeholder="Password*"
      required
      style={{
        width: '250px',
        padding: '10px',
        fontSize: '14px',
        borderColor: '#87CEEB', // A darker shade of sky blue
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 0 5px rgba(70, 130, 180, 0.5)'
      }}
    />
    <input
      type="password"
      name="confirmPassword"
      value={confirmPassword}
      onChange={this.handlePasswordChange}
      placeholder="Confirm Password*"
      required
      style={{
        width: '250px',
        padding: '10px',
        fontSize: '14px',
        borderColor: '#87CEEB', // A darker shade of sky blue
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: '0 0 5px rgba(70, 130, 180, 0.5)'
      }}
    />
  </div>
)}



          {currentQuestionIndex === 6 && (
            <div className="terms-inputs">
              <input
                type="checkbox"
                id="termsCheckbox"
                name="termsAccepted"
                checked={Questionnaire_Response.termsAccepted}
                onChange={this.handleCheckboxChange}
                className={`checkbox-input ${errors.termsAccepted && 'input-error'}`}
              />
              <label htmlFor="termsCheckbox" className="terms-label">
                I agree to the <span className="terms-link" onClick={this.toggleTermsDialog}>Terms and Conditions</span> *
              </label>
              {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}
            </div>
          )}
        </div>
        <div className="response-buttons">
          {currentQuestionIndex !== 6 && (
            <>
               
              {currentQuestionIndex > 0 && <button onClick={this.handleBack} className="response-button" >Back</button>}
              <button onClick={this.handleClear} className="response-button">Clear</button>
              <button onClick={this.handleResponse} className="response-button">Next</button>
            </>
          )}
          {currentQuestionIndex === 6 && (
          <button
          onClick={this.handleSubmit}
          disabled={!Questionnaire_Response.termsAccepted}
          className="submit-button"
        >
          Complete Sign-up
        </button>
      )}
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
            {/*<p className="loading-text">Loading...</p>*/}
          </div>
        )}
        </div>

        <Dialog
          open={isTermsDialogOpen}
          onClose={this.toggleTermsDialog}
          classes={{ paper: 'terms-dialog' }}
        >
          <DialogTitle className="terms-dialog-title">Terms and Conditions</DialogTitle>
          <DialogContent className="terms-dialog-content">
            <DialogContentText>
              Terms of use
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum reprehenderit nihil nisi odit necessitatibus voluptate voluptatibus magni ducimus sed accusamus illo nobis veniam.
              <br /><br />
              Intellectual property rights
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum reprehenderit nihil nisi odit necessitatibus voluptate voluptatibus magni ducimus sed accusamus illo nobis veniam.
              <br /><br />
              Prohibited activities
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum reprehenderit nihil nisi odit necessitatibus voluptate voluptatibus magni ducimus sed accusamus illo nobis veniam.
              <br /><br />
              Termination clause
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum reprehenderit nihil nisi odit necessitatibus voluptate voluptatibus magni ducimus sed accusamus illo nobis veniam.
              <br /><br />
              Governing law
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, quidem doloribus cumque vero, culpa voluptates dolorum reprehenderit nihil nisi odit necessitatibus voluptate voluptatibus magni ducimus sed accusamus illo nobis veniam.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="terms-dialog-actions">
            <Button onClick={this.toggleTermsDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Questionnaire;