import React from 'react'
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { GoogleUserDTO } from '../dtos/googleOAuthResponse.dto';
import store from '../store';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginButton() {
    const navigate = useNavigate();

    const handleSuccesLogin = (response: CredentialResponse) => {
        const decoded = jwtDecode<GoogleUserDTO>(response.credential as string);
        console.log(decoded);
        store.setLoginStatus(true);
        store.setloading(true);
        localStorage.setItem('userPhoto', decoded.picture || '');
        localStorage.setItem('userName', decoded.name || '');
        // delay de 1 segundo
        setTimeout(() => {
            store.setUser(decoded.name);
            navigate('/home')
            store.setloading(false);
        }, 2500);
    }

    return <GoogleLogin
        onSuccess={handleSuccesLogin}
        onError={() => {
            alert('Login Failed');
        }}
    />
}
