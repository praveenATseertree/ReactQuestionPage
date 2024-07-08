import React, { Component } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import ReactCountryFlagsSelect from 'react-country-flags-select';
import dayjs from 'dayjs';
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
      }
    };
  }

  handleResponse = () => {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex < 6) {
      this.setState({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      alert('All questions answered. You can submit now.');
    }
  };

  handleBack = () => {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex > 0) {
      this.setState({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      Questionnaire_Response: {
        ...prevState.Questionnaire_Response,
        [name]: value
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

  handleClear = () => {
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
      }
    });
  };

  handleSubmit = () => {
    const { Questionnaire_Response } = this.state;
    console.log('User responses:', Questionnaire_Response);
    // Add logic to handle the submission of responses
  };

  render() {
    const { currentQuestionIndex, Questionnaire_Response } = this.state;
    const progressPercentage = ((currentQuestionIndex + 1) / 7) * 100;

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
        </div>

        <div className="question">
          <h1>{questions[currentQuestionIndex]}</h1>
          <p>Your answer will help us to give you the best start.</p>
          {currentQuestionIndex === 0 && (
            <div className="name-inputs">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={Questionnaire_Response.firstName}
                onChange={this.handleInputChange}
                className="input-field"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={Questionnaire_Response.lastName}
                onChange={this.handleInputChange}
                className="input-field"
              />
            </div>
          )}
          {currentQuestionIndex === 1 && (
            <div className="company-inputs">
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={Questionnaire_Response.companyName}
                onChange={this.handleInputChange}
                className="input-field"
              />
              <input
                type="text"
                name="companyShortCode"
                placeholder="Company Short Code"
                value={Questionnaire_Response.companyShortCode}
                onChange={this.handleInputChange}
                className="input-field"
              />
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
                className="country-select"
              />
            </div>
          )}
          {currentQuestionIndex === 3 && (
            <input
              type="text"
              name="baseCurrency"
              placeholder="Base Currency"
              value={Questionnaire_Response.baseCurrency}
              onChange={this.handleInputChange}
              className="input-field"
            />
          )}
          {currentQuestionIndex === 4 && (
            <select
              name="financialYear"
              value={Questionnaire_Response.financialYear}
              onChange={this.handleInputChange}
              className="input-field"
            >
              <option value="Jan-Dec">Jan-Dec</option>
              <option value="Apr-Mar">Apr-Mar</option>
            </select>
          )}
          {currentQuestionIndex === 5 && (
            <div className='DateMontn-selector'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year', 'month']}
                label="Year and Month"
                minDate={dayjs('2012-03-01')}
                maxDate={dayjs('2023-06-01')}
                value={dayjs(`${Questionnaire_Response.accountingPeriodYear}-${Questionnaire_Response.accountingPeriodMonth}-01`)}
                onChange={this.handleDateChange}
                renderInput={(params) => <TextField {...params} helperText={null} />}
              />
            </LocalizationProvider>
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
                className="checkbox-input"
              />
              <label htmlFor="termsCheckbox" className="terms-label">
                I agree to the Terms and Conditions
              </label>
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
      </div>
    );
  }
}

export default Questionnaire;
