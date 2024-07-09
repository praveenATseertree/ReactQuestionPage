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
        termsAccepted: false
      },
      errors: {},
      isTermsDialogOpen: false, // State to manage the modal visibility
      isSuccessDialogOpen: false // State to manage the success dialog visibility
    };
  }

  handleResponse = () => {
    if (this.validateForm()) {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1
      }));
    }
  };

  handleBack = () => {
    this.setState(prevState => ({
      currentQuestionIndex: prevState.currentQuestionIndex - 1
    }));
  };

  /*handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        [name]: value
      }
    }));
  };*/

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

  handleCountrySelect = (selectedCountry) => {
    this.setState(prevState => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        country: selectedCountry
      }
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

  /* handleClear = () => {
    this.setState({
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
        termsAccepted: false
      },
      errors: {}
    });
  }; */

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
  
  handleSubmit = () => {
    const { Questionnaire_Response } = this.state;
    console.log('User responses:', Questionnaire_Response);
    // Add logic to handle the submission of responses
    this.setState({ isSuccessDialogOpen: true });
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

  render() {
    const { currentQuestionIndex, Questionnaire_Response, errors, isTermsDialogOpen, isSuccessDialogOpen } = this.state;
    const progressPercentage = ((currentQuestionIndex + 1) / 8) * 100;

    const questions = [
      'Confirm your first name and last name',
      'Please enter the name of your Company',
      'Please select your Country',
      'Please select your Base Currency',
      'Please select your Financial Year',
      'What would you like your first accounting period to be?',
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
          <h2>Nice to meet you Praveen!</h2>
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
              <ReactCountryFlagsSelect
                selected={Questionnaire_Response.country}
                onSelect={this.handleCountrySelect}
                optionsListMaxHeight={300}
                searchable
                selectWidth={500}
                selectHeight={40}
                className={`country-select ${errors.country && 'input-error'}`}
              />
              {errors.country && <span className="error-message">{errors.country}</span>}
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
                  label="Year and Month *"
                  minDate={dayjs('2012-03-01')}
                  maxDate={dayjs('2023-06-01')}
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

        <Dialog
          open={isSuccessDialogOpen}
          onClose={this.closeSuccessDialog}
          classes={{ paper: 'success-dialog' }}
        >
          <DialogTitle className="success-dialog-title">Profile Completed</DialogTitle>
          <DialogContent className="success-dialog-content">
            <DialogContentText>
              Profile completed successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="success-dialog-actions">
            <Button onClick={this.closeSuccessDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Questionnaire;
