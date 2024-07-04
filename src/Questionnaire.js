import React, { Component } from 'react';
import './Questionnaire.css';

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
      responses: Array(10).fill(''),
    };
  }

  handleResponse = (response) => {
    const { currentQuestionIndex, responses } = this.state;
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = response;

    this.setState({ responses: newResponses });

    if (currentQuestionIndex < this.questions.length - 1) {
      this.setState({ currentQuestionIndex: currentQuestionIndex + 1 });
    } else {
      // All questions answered
      alert('All questions answered. You can submit now.');
    }
  };

  handleBack = () => {
    const { currentQuestionIndex } = this.state;
    if (currentQuestionIndex > 0) {
      this.setState({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  };

  handleSubmit = () => {
    console.log('User responses:', this.state.responses);
    // Add logic to handle the submission of responses
  };

  questions = [
    'Have you used software to manage or engage with customers before?',
    'Do you find it easy to navigate most software interfaces?',
    'Have you ever customized software to better fit your needs?',
    'Do you prefer cloud-based or on-premise solutions?',
    'How frequently do you use customer management software?',
    'Do you consider yourself tech-savvy?',
    'Have you received training for any customer management software?',
    'Do you value software that integrates with other tools you use?',
    'Have you ever faced issues with data security in software?',
    'Do you prefer software with extensive customization options?'
  ];

  render() {
    const { currentQuestionIndex } = this.state;

    // Calculate progress percentage
    const progressPercentage = ((currentQuestionIndex + 1) / this.questions.length) * 100;

    return (
      <div className="questionnaire-container">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
            <span className="progress-text">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
        <div className="header">
          <div className="back-button">
            {currentQuestionIndex > 0 && <a href="#" onClick={this.handleBack}>Back</a>}
          </div>
        </div>
        <div className="greeting">
          <h2>Nice to meet you Praveen!</h2>
        </div>
        <div className="question">
          <h1>{this.questions[currentQuestionIndex]}</h1>
          <p>Your answer will help us to give you the best start.</p>
        </div>
        <div className="response-buttons">
          <button onClick={() => this.handleResponse('Yes')}>Yes</button>
          <button onClick={() => this.handleResponse('No')}>No</button>
        </div>
        {currentQuestionIndex === this.questions.length - 1 && (
          <div className="submit-button">
            <button onClick={this.handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    );
  }
}

export default Questionnaire;
