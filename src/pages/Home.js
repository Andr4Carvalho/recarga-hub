import Auth from '../services/AuthService.js';
import {
    LogOut,
} from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-back mb-4">Bem-vindo ao Recarga Hub!</h1>
                <p className="text-xl text-back max-w-2xl mx-auto">
                    O Recarga Hub conecta donos de veículos elétricos a pontos de recarga de maneira fácil e rápida.
                    Explore nosso sistema e aproveite a energia que o futuro oferece!
                </p>

                <button
                    onClick={() => Auth.logout()}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 rounded-xl"
                >
                    <LogOut className='mr-2' size={15} />
                    Sair
                </button>
            </div>
        </div>
    );
}
