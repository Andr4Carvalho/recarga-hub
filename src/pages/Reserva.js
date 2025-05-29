import { useEffect, useState } from 'react'
import axiosInstance from '../axiosConfig';
import { Plus, Pencil, Trash2, Star, ThumbsUp, ThumbsDown, Zap } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

const userId = () => {
    const token = localStorage.getItem("token")
    const decodedToken = jwtDecode(token)
    return decodedToken.userId
}

export default function ReservaPage() {
    const IdUsuario = userId()
    const [reservas, setReservas] = useState([])
    const [pontos, setPontos] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [modalAberto, setModalAberto] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [reservaParaAvaliar, setReservaParaAvaliar] = useState(null);
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [tags, setTags] = useState([]);
    const [form, setForm] = useState({
        pontoRecargaId: '',
        veiculoId: '',
        dataReserva: '',
        horaInicio: '',
        horaFim: '',
        usuarioId: IdUsuario
    })

    const toggleTag = (tag) => {
        if (tag === 'Houve problemas') {
            setTags((prev) =>
                prev.includes(tag) ? [] : ['Houve problemas']
            );
        } else {
            setTags((prev) => {
                const newTags = prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev.filter((t) => t !== 'Houve problemas'), tag];
                return newTags;
            });
        }
    };


    const carregarReservas = async () => {
        const response = await axiosInstance.get('/Reserva')
        setReservas(response.data)
    }

    const carregarPontos = async () => {
        const response = await axiosInstance.get('/PontosDeRecarga')
        setPontos(response.data)
    }

    const carregarVeiculos = async () => {
        const response = await axiosInstance.get('/Veiculo')
        setVeiculos(response.data)
    }

    const enviarAvaliacao = async (id, idPontoRecarga, userid, nota, comentario, tags) => {
        try {
            await axiosInstance.post('/Avaliacoes', {
                reservaId: id,
                pontoRecargaId: idPontoRecarga,
                usuarioId: userid,
                nota,
                comentario,
                tags
            });

            setReservaParaAvaliar(null);
            setNota(0);
            setComentario('');
            setTags([]);
        } catch (error) {
            console.error('Erro ao salvar reserva:', error);
        }
    }

    useEffect(() => {
        carregarReservas()
        carregarPontos()
        carregarVeiculos()
    }, [])

    const salvar = async () => {
        try {
            const payload = {
                ...form,
                HorarioInicio: form.horaInicio ? `${form.horaInicio}:00` : "",
                HorarioFim: form.horaFim ? `${form.horaFim}:00` : "",
            };

            if (editingId) {
                await axiosInstance.put(`/Reserva/${editingId}`, payload);
            } else {
                await axiosInstance.post('/Reserva', payload);
            }

            await carregarReservas();
            fecharModal();
        } catch (error) {
            console.error('Erro ao salvar reserva:', error);
        }
    }

    const editar = (reserva) => {
        setForm({
            pontoRecargaId: reserva.ponto_recarga_id,
            veiculoId: reserva.veiculo_id,
            dataReserva: reserva.data_reserva.split('T')[0],
            horaInicio: reserva.horario_inicio,
            horaFim: reserva.horario_fim,
            usuarioId: reserva.usuario_id
        });
        setEditingId(reserva.id);
        setModalAberto(true);
    }

    const excluir = async (id) => {
        try {
            await axiosInstance.delete(`/Reserva/${id}`)
            await carregarReservas()
        } catch (error) {
            console.error('Erro ao excluir reserva:', error)
        }
    }

    const fecharModal = () => {
        setEditingId(null)
        setForm({ pontoRecargaId: '', veiculoId: '', dataReserva: '', usuarioId: IdUsuario })
        setModalAberto(false)
    }

    function gerarHorariosDisponiveis(dataSelecionada) {
        if (!dataSelecionada) return []

        const horarios = []
        const agora = new Date()

        for (let h = 0; h < 24; h++) {
            for (let m of [0, 30]) {
                const hora = h.toString().padStart(2, '0')
                const minuto = m.toString().padStart(2, '0')
                const horarioCompleto = `${hora}:${minuto}`

                const dataHoraCompleta = new Date(`${dataSelecionada}T${horarioCompleto}`)

                if (dataHoraCompleta >= agora) {
                    horarios.push(horarioCompleto)
                }
            }
        }

        return horarios
    }

    return (
        <>
            {reservaParaAvaliar && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xl space-y-5 animate-fade-in">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            Avaliar ponto de recarga
                        </h2>

                        <p className="text-center text-gray-600">
                            {reservaParaAvaliar.ponto_recarga_nome}
                        </p>

                        {/* Estrelas */}
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((estrela) => (
                                <button
                                    key={estrela}
                                    onClick={() => setNota(estrela)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        size={36}
                                        className="text-yellow-400"
                                        fill={nota >= estrela ? '#facc15' : 'none'}
                                        stroke="#facc15"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Opções rápidas */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Positivas */}
                            {['Carregador funcionando', 'Espaço limpo'].map((label) => (
                                <button
                                    key={label}
                                    onClick={() => toggleTag(label)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${tags.includes(label)
                                        ? 'bg-green-100 text-green-800 border-green-300'
                                        : 'bg-white text-gray-700 border-gray-300'
                                        }`}
                                >
                                    {label === 'Carregador funcionando' ? <Zap size={18} /> : <ThumbsUp size={18} />}
                                    {label}
                                </button>
                            ))}

                            {/* Negativa */}
                            <button
                                onClick={() => toggleTag('Houve problemas')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition col-span-2 ${tags.includes('Houve problemas')
                                    ? 'bg-red-100 text-red-800 border-red-300'
                                    : 'bg-white text-gray-700 border-gray-300'
                                    }`}
                            >
                                <ThumbsDown size={18} /> Houve problemas
                            </button>
                        </div>

                        {/* Comentário */}
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Comentário (opcional)"
                            rows={3}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                        />

                        {/* Ações */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setReservaParaAvaliar(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    enviarAvaliacao(reservaParaAvaliar.id, reservaParaAvaliar.ponto_recarga_id, reservaParaAvaliar.usuario_id, nota, comentario, tags)
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Enviar Avaliação
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">Reservas</h1>
                    <button
                        onClick={() => setModalAberto(true)}
                        className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2"
                    >
                        <Plus size={20} /> Nova reserva
                    </button>
                </div>

                <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                    <table className="min-w-full bg-white text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Início</th>
                                <th className="px-6 py-3">Término</th>
                                <th className="px-6 py-3">Ponto</th>
                                <th className="px-6 py-3">Veículo</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((r) => {
                                const agora = new Date();

                                // Monta data + horário corretamente
                                const dataReserva = new Date(r.data_reserva);
                                const [hInicio, mInicio] = r.horario_inicio.split(':');
                                const [hFim, mFim] = r.horario_fim.split(':');

                                const dataHoraInicio = new Date(dataReserva);
                                dataHoraInicio.setHours(parseInt(hInicio), parseInt(mInicio), 0, 0);

                                const dataHoraFim = new Date(dataReserva);
                                dataHoraFim.setHours(parseInt(hFim), parseInt(mFim), 0, 0);

                                const diffMs = dataHoraInicio.getTime() - agora.getTime();
                                const diffHoras = diffMs / (1000 * 60 * 60);

                                const podeCancelar = dataHoraInicio > agora && diffHoras >= 1;
                                const reservaPassada = agora > dataHoraFim;

                                return (
                                    <tr key={r.id} className="border-t hover:bg-gray-50">
                                        <td className="px-6 py-4">{dataReserva.toLocaleDateString('pt-BR')}</td>
                                        <td className="px-6 py-4">{r.horario_inicio.substring(0, 5)}</td>
                                        <td className="px-6 py-4">{r.horario_fim.substring(0, 5)}</td>
                                        <td className="px-6 py-4">{r.ponto_recarga_nome}</td>
                                        <td className="px-6 py-4">{r.veiculo_nome} - {r.veiculo_placa}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {!reservaPassada ? (
                                                <>
                                                    <button
                                                        onClick={() => editar(r)}
                                                        className="inline-flex items-center px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                                    >
                                                        <Pencil size={14} className="mr-1" /> Editar
                                                    </button>
                                                    <button
                                                        onClick={() => excluir(r.id)}
                                                        className={`inline-flex items-center px-3 py-1.5 text-white rounded-lg ${podeCancelar ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-300 cursor-not-allowed'
                                                            }`}
                                                        disabled={!podeCancelar}
                                                    >
                                                        <Trash2 size={14} className="mr-1" /> Cancelar
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setReservaParaAvaliar(r)}
                                                    disabled={r.avaliada}
                                                    className={`inline-flex items-center px-3 py-1.5 rounded-lg transition ${r.avaliada
                                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                        } disabled:opacity-100`}
                                                    title={r.avaliada ? "Você já avaliou este ponto" : "Clique para avaliar o ponto"}
                                                >
                                                    <Star size={16} className="mr-2" /> Avaliar Ponto
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {modalAberto && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                {editingId ? 'Editar reserva' : 'Nova reserva'}
                            </h2>
                            <div className="space-y-4">
                                <select
                                    value={form.pontoRecargaId}
                                    onChange={e => setForm({ ...form, pontoRecargaId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                >
                                    <option value="">Selecione o ponto</option>
                                    {pontos.map(p => (
                                        <option key={p.id} value={p.id}>{p.nome}</option>
                                    ))}
                                </select>
                                <select
                                    value={form.veiculoId}
                                    onChange={e => setForm({ ...form, veiculoId: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-xl"
                                >
                                    <option value="">Selecione o veículo</option>
                                    {veiculos.map(v => (
                                        <option key={v.id} value={v.id}>{v.modelo} - {v.placa}</option>
                                    ))}
                                </select>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={form.dataReserva}
                                    onChange={e => {
                                        setForm({ ...form, dataReserva: e.target.value })
                                    }}
                                    className="w-full border px-4 py-2 rounded-xl"
                                />
                                <select
                                    value={form.horaInicio}
                                    onChange={e => setForm({ ...form, horaInicio: e.target.value, horaFim: '' })}
                                    className="w-full border px-4 py-2 rounded-xl"
                                >
                                    <option value="">Hora de início</option>
                                    {gerarHorariosDisponiveis(form.dataReserva).map(hora => (
                                        <option key={hora} value={hora}>{hora}</option>
                                    ))}
                                </select>

                                <select
                                    value={form.horaFim}
                                    onChange={e => setForm({ ...form, horaFim: e.target.value })}
                                    className="w-full border px-4 py-2 rounded-xl"
                                    disabled={!form.horaInicio}
                                >
                                    <option value="">Hora de término</option>
                                    {gerarHorariosDisponiveis(form.dataReserva)
                                        .filter(h => h > form.horaInicio)
                                        .map(hora => (
                                            <option key={hora} value={hora}>{hora}</option>
                                        ))}
                                </select>
                                <div className="flex justify-end gap-2 pt-4">
                                    <button
                                        onClick={fecharModal}
                                        className="px-4 py-2 rounded-xl border border-gray-300"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={salvar}
                                        className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}