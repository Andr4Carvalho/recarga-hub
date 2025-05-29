import { useEffect, useState } from 'react';
import Auth from '../services/AuthService.js';
import axiosInstance from '../axiosConfig.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { LogOut } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const markerIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [30, 45],
    iconAnchor: [15, 45],
});

export default function Home() {
    const [pontos, setPontos] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        axiosInstance.get('/PontosDeRecarga')
            .then(res => setPontos(res.data))
            .catch(err => console.error('Erro ao buscar pontos:', err));

        navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }),
            () => console.warn('Geolocalização não permitida.')
        );
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col items-center">
            <div className="absolute top-5 right-5">
                <button
                    onClick={() => Auth.logout()}
                    className="flex items-center px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 transition"
                >
                    <LogOut className="mr-2" size={18} />
                    Sair
                </button>
            </div>

            <div className="mt-16 text-center px-6">
                <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight drop-shadow-sm">
                    <span className="text-blue-600">⚡ Recarga Hub</span>
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
                    Encontre pontos de recarga elétrica perto de você de forma rápida, confiável e intuitiva.
                </p>
            </div>

            <div className="mt-10 w-full max-w-screen-lg h-[500px] mb-10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-lg bg-white/60 border border-gray-200">
                {userLocation ? (
                    <MapContainer
                        center={[userLocation.lat, userLocation.lng]}
                        zoom={13}
                        className="w-full h-full z-0"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {pontos
                            .filter(p => p.latitude && p.longitude)
                            .map(ponto => (
                                <Marker
                                    key={ponto.id}
                                    position={[ponto.latitude, ponto.longitude]}
                                    icon={markerIcon}
                                >
                                    <Popup>
                                        <div className="text-sm leading-snug">
                                            <p className="font-bold text-gray-800">{ponto.nome}</p>
                                            <p className="text-gray-600">{ponto.endereco}</p>
                                            <p className="text-gray-500">🔌 Tipo: {ponto.tipo}</p>
                                            <p className="text-gray-500">⚡ {ponto.potencia} kW</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                    </MapContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Habilite a geolocalização para visualizar os pontos no mapa.
                    </div>
                )}
            </div>
        </div>
    );
}