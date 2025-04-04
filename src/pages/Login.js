import { useState } from "react";
import axiosInstance from '../axiosConfig';
import Auth from '../services/AuthService.js';

export default function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("Auth/login", {
                email,
                senha
            });

            if(response.status === 200){
                Auth.login(response.data);
            }
        } catch (error) {
            if (error.response?.data) {
                setMensagem(error.response.data);
            } else {
                setMensagem("Erro ao conectar com o servidor.");
            }
        }
    };

    return (
        <div className="p-4 flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-indigo-600">
            <div className="bg-white p-10 rounded-lg shadow-2xl max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <img src="../icon.png" alt="Recarga Hub" className="h-32 w-32" />
                </div>

                <h2 className="text-2xl font-bold text-center text-green-600 mb-8">Conecte-se à Recarga Hub</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            E-mail
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu e-mail"
                            className="w-full p-4 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Senha
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Sua senha"
                            className="w-full p-4 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                        Entrar
                    </button>
                </form>

                {mensagem && (
                    <div className="mt-4 text-center text-red-500 font-medium">
                        {mensagem}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <a href="/register" className="text-green-600 hover:underline">
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}