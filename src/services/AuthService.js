class AuthService {
    isTokenExpired = (token) => {
        
    };

    login = (dados) => {
        window.location.href = '/';
    };

    logout = () => {
        window.location.href = '/login';
    };
}

const authServiceInstance = new AuthService();

export default authServiceInstance;