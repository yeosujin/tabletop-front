import axios from "axios";

const EMAIL_VALIDATION_API_KEY = '29e0909d201f46f6a97ff9921e76dc32';
const PHONE_VALIDATION_API_KEY = 'fd90cfd9cf9041f1985f50e2ad284d27';

export const AuthApi = axios.create({
    baseURL: `http://localhost:8080`,
    headers: {
        'Content-Type' : 'application/json'
    }
});

export const EmailApi = axios.create({
    baseURL: `https://emailvalidation.abstractapi.com/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const PhoneApi = axios.create({
    baseURL: `https://phonevalidation.abstractapi.com/v1`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const validateEmail = async (email) => {
    const response = await EmailApi.get(`/`, {
        params: {
            api_key: EMAIL_VALIDATION_API_KEY,
            email: email
        }
    });
    return response.data;
};

export const validatePhone = async (phone) => {
    const response = await PhoneApi.get(`/`, {
        params: {
            api_key: PHONE_VALIDATION_API_KEY,
            country: 'KR',
            phone: phone
        }
    });
    return response.data;
};

export const signUp = async ({ id, email, password, username, phone }) => {
    const data = { id, email, password, username, phone };
    const response = await AuthApi.post(`/api/auth/signup`, data);
    return response.data;
  };