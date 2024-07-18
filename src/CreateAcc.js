import React, { Component } from 'react';
import './CreateAcc.css';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { TiVendorMicrosoft } from "react-icons/ti";
<<<<<<< HEAD
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import withGoogleLogin from './withGoogleLogin';
import withMsal from './withMsal';
=======
import { useGoogleLogin } from '@react-oauth/google';
import { useMsal } from '@azure/msal-react';
import { InteractionRequiredAuthError } from "@azure/msal-browser";
>>>>>>> cc58e6caec1133e0b162c6763673c114f8caf269

class CreateAcc extends Component {
    handleGoogleClick = () => {
        const { googleLogin } = this.props;
        googleLogin();
    };

    handleMicrosoftClick = async () => {
        const { msalInstance } = this.props;
        try {
<<<<<<< HEAD
            await msalInstance.loginRedirect({
=======
            const loginResponse = await msalInstance.loginRedirect({
>>>>>>> cc58e6caec1133e0b162c6763673c114f8caf269
                scopes: ["User.Read"]
            });
            const account = msalInstance.getActiveAccount();
            if (account) {
                const tokenResponse = await msalInstance.acquireTokenSilent({
                    scopes: ["User.Read"],
                    account
                });
<<<<<<< HEAD
                const userInfo = await fetch('https://graph.microsoft.com/v1.0/me', {
                    headers: {
                        'Authorization': `Bearer ${tokenResponse.accessToken}`
                    }
                }).then(response => response.json());

                console.log('Microsoft User Details:', userInfo);
                sessionStorage.setItem('msalToken', tokenResponse.accessToken);
=======
                sessionStorage.setItem('msalToken', tokenResponse.accessToken);
                console.log('Microsoft User Details:', account);
>>>>>>> cc58e6caec1133e0b162c6763673c114f8caf269
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

<<<<<<< HEAD
export default withGoogleLogin(withMsal(CreateAcc));
=======
const withGoogleLogin = (Component) => {
    return (props) => {
        const googleLogin = useGoogleLogin({
            clientId: "974473418001-ure7o939s0spafpsk8dij9ds73d48egu.apps.googleusercontent.com",
            onSuccess: tokenResponse => {
                console.log('Google User Details:', tokenResponse);
                sessionStorage.setItem('googleToken', tokenResponse.access_token);
                window.location.href = '/request';
            },
            onError: error => console.log('Login Failed:', error)
        });

        return <Component {...props} googleLogin={googleLogin} />;
    };
};

const withMsal = (Component) => {
    return (props) => {
        const { instance } = useMsal();
        return <Component {...props} msalInstance={instance} />;
    };
};

export default withGoogleLogin(withMsal(CreateAcc));
>>>>>>> cc58e6caec1133e0b162c6763673c114f8caf269
