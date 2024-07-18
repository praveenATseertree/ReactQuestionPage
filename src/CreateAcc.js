import React, { Component } from 'react';
import './CreateAcc.css';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { TiVendorMicrosoft } from "react-icons/ti";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import withGoogleLogin from './withGoogleLogin';
import withMsal from './withMsal';

class CreateAcc extends Component {
    handleGoogleClick = () => {
        const { googleLogin } = this.props;
        googleLogin();
    };

    handleMicrosoftClick = async () => {
        const { msalInstance } = this.props;
        try {
            await msalInstance.loginRedirect({
                scopes: ["User.Read"]
            });
            const account = msalInstance.getActiveAccount();
            if (account) {
                const tokenResponse = await msalInstance.acquireTokenSilent({
                    scopes: ["User.Read"],
                    account
                });
                const userInfo = await fetch('https://graph.microsoft.com/v1.0/me', {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.accessToken}`
                    }
                }).then(response => response.json());

                console.log('Microsoft User Details:', userInfo);
                sessionStorage.setItem('msalToken', tokenResponse.accessToken);
                window.location.href = '/request';
            }
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                msalInstance.acquireTokenRedirect({
                    scopes: ["User.Read"]
                });
            } else {
                console.log('Login Failed:', error);
            }
        }
    };

    componentDidMount() {
        document.body.classList.add('create-acc-body');
    }

    componentWillUnmount() {
        document.body.classList.remove('create-acc-body');
    }

    render() {
        return (
            <div className="create-acc-container">
                <div className="create-acc-form-container">
                    <form>
                        <input type="email" placeholder="Email address*" required />
                        <button type="submit" className="btn">Continue</button>
                    </form>
                    <p>Already have an account? <a href="#">Login</a></p>
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
                </div>
            </div>
        );
    }
}

export default withGoogleLogin(withMsal(CreateAcc));
