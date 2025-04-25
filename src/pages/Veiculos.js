import { useEffect, useState } from 'react'
import axiosInstance from '../axiosConfig';
import { Plus, Pencil, Trash2, CarFront } from 'lucide-react'
import { jwtDecode } from 'jwt-decode';

const userId = () => {
    let token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    return decodedToken.userId
}

export default function VeiculoPage() {
    const IdUsuario = userId();
    const [Veiculo, setVeiculo] = useState([])
    const [form, setForm] = useState({ Modelo: '', Placa: '', Tipo: '100% elétrico', Cor: '', UsuarioId: IdUsuario })
    const [editingId, setEditingId] = useState(null)
    const [modalAberto, setModalAberto] = useState(false)
    const [idParaExcluir, setIdParaExcluir] = useState(null)

    const carregarVeiculo = async () => {
        const response = await axiosInstance.get('/Veiculo')
        setVeiculo(response.data)
    }

    useEffect(() => {
        carregarVeiculo()
    }, [])

    const salvar = async () => {
        try {
            if (editingId !== null) {
                await axiosInstance.put(`/Veiculo/${editingId}`, {
                    Modelo: form.Modelo,
                    Tipo: form.Tipo
                })
            } else {
                await axiosInstance.post('Veiculo', form)
            }
            await carregarVeiculo()
            fecharModal()
        } catch (error) {
            console.error('Erro ao salvar veículo:', error)
        }
    }

    const editar = (veiculo) => {
        setForm({
            Modelo: veiculo.modelo,
            Placa: veiculo.placa,
            Tipo: veiculo.tipo,
            Cor: veiculo.cor,
        })
        setEditingId(veiculo.id)
        setModalAberto(true)
    }

    const excluir = (id) => {
        setIdParaExcluir(id)
    }

    const confirmarExclusao = async () => {
        try {
            await axiosInstance.delete(`/Veiculo/${idParaExcluir}`)
            await carregarVeiculo()
            setIdParaExcluir(null)
        } catch (error) {
            console.error('Erro ao excluir veículo:', error)
        }
    }

    const fecharModal = () => {
        setForm({ Modelo: '', Placa: '', Tipo: '100% elétrico', Cor: '' })
        setEditingId(null)
        setModalAberto(false)
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Veículos</h1>
                <button
                    onClick={() => setModalAberto(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Adicionar veículo
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Veiculo.map((veiculo) => (
                    <div key={veiculo.id} className="bg-white rounded-3xl shadow-md p-6 space-y-3 border hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CarFront className="text-blue-600" size={32} />
                                <div>
                                    <h2 className="text-xl font-semibold">{veiculo.modelo}</h2>
                                    <p className="text-gray-500 text-sm">{veiculo.placa}</p>
                                </div>
                            </div>
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                {veiculo.tipo}
                            </span>
                        </div>

                        <p><span className="font-medium text-gray-600">Cor:</span> {veiculo.cor}</p>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => editar(veiculo)}
                                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
                            >
                                <Pencil size={14} /> Editar
                            </button>
                            <button
                                onClick={() => excluir(veiculo.id)}
                                className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 text-white rounded-xl hover:bg-red-700"
                            >
                                <Trash2 size={14} /> Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de formulário */}
            {modalAberto && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-xl">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">
                            {editingId ? 'Editar veículo' : 'Novo veículo'}
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Modelo"
                                value={form.Modelo}
                                onChange={e => setForm({ ...form, Modelo: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Placa"
                                value={form.Placa}
                                onChange={e => setForm({ ...form, Placa: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={form.Tipo}
                                onChange={e => setForm({ ...form, Tipo: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="100% elétrico">100% elétrico</option>
                                <option value="Híbrido">Híbrido</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Cor"
                                value={form.Cor}
                                onChange={e => setForm({ ...form, Cor: e.target.value })}
                                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    onClick={fecharModal}
                                    className="px-4 py-2 rounded-xl border border-gray-300"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={salvar}
                                    className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de exclusão */}
            {idParaExcluir !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Confirmar exclusão</h3>
                        <p className="text-gray-600 mb-6">Você tem certeza que deseja excluir este veículo?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setIdParaExcluir(null)}
                                className="px-4 py-2 rounded-xl border border-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarExclusao}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
