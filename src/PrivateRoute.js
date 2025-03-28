import { useNavigate } from 'react-router-dom';
import AuthService from './services/AuthService.js';

const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    if (!token || AuthService.isTokenExpired(token)) {
        navigate('/login', { replace: true });
        return null;
    }

    return element;
};

export default PrivateRoute;
