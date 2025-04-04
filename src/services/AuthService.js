import axiosInstance from '../axiosConfig';
import { jwtDecode } from 'jwt-decode';

class AuthService {
    isTokenExpired = (token) => {
        if (!token) return true;

        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decodedToken.exp < currentTime;
    };

    login = (dados) => {
        localStorage.setItem("token", dados.token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${dados.token}`;
        window.location.href = '/';
    };

    logout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };
}

const authServiceInstance = new AuthService();

export default authServiceInstance;