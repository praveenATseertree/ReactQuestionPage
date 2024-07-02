import React, { useState } from 'react';
import './Questionnaire.css';

const Questionnaire = () => {
  const questions = [
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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);

  const handleResponse = (response) => {
    setResponses([...responses, response]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered
      alert('All questions answered. You can submit now.');
    }
  };

  const handleSubmit = () => {
    console.log('User responses:', responses);
    // Add logic to handle the submission of responses
  };

  return (
    <div className="questionnaire-container">
      <div className="header">
        <div className="back-button">
          <a href="#">Back</a>
        </div>
      </div>
      <div className="greeting">
        <h2>Nice to meet you Praveen!</h2>
      </div>
      <div className="question">
        <h1>{questions[currentQuestionIndex]}</h1>
        <p>Your answer will help us to give you the best start.</p>
      </div>
      <div className="response-buttons">
        <button onClick={() => handleResponse('Yes')}>Yes</button>
        <button onClick={() => handleResponse('No')}>No</button>
      </div>
      {currentQuestionIndex === questions.length - 1 && (
        <div className="submit-button">
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
