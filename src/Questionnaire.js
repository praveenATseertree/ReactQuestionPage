import React, { Component } from 'react';
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
        country: '',
        baseCurrency: '',
        financialYear: '',
        accountingPeriodMonth: '',
        accountingPeriodYear: '',
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
        country: '',
        baseCurrency: '',
        financialYear: '',
        accountingPeriodMonth: '',
        accountingPeriodYear: '',
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
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={Questionnaire_Response.country}
              onChange={this.handleInputChange}
              className="input-field"
            />
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
            <div className="accounting-period-inputs">
              <select
                name="accountingPeriodMonth"
                value={Questionnaire_Response.accountingPeriodMonth}
                onChange={this.handleInputChange}
                className="input-field"
              >
                <option value="January">January</option>
                {/* Add other months */}
              </select>
              <select
                name="accountingPeriodYear"
                value={Questionnaire_Response.accountingPeriodYear}
                onChange={this.handleInputChange}
                className="input-field"
              >
                <option value="2024">2024</option>
                {/* Add other years */}
              </select>
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
