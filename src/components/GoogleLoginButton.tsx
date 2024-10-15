import React from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { GoogleUserDTO } from '../dtos/googleOAuthResponse.dto';
import store from '../store';

export default function GoogleLoginButton() {
 
    const handleSuccesLogin = (response:CredentialResponse ) => {
        const decoded = jwtDecode<GoogleUserDTO>(response.credential as string);
        console.log(decoded);
        store.setLoginStatus(true);
    }

    return <GoogleLogin
      onSuccess={handleSuccesLogin}
      onError={() => {
        alert('Login Failed');
      }}
    />
}