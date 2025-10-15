import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

const otpRequest=async(userData)=>{
    return await axios.post(`${API_URL}request-otp`,userData);
}

const register=async(userData)=>{
    return await axios.post(`${API_URL}register`,userData);
}
const login=async(userData)=>{
    return await axios.post(`${API_URL}login`,userData);
}

const AuthServices={
    register,
    login,
    otpRequest
}

export default AuthServices;