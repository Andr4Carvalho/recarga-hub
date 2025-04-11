import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import axiosInstance from '../axiosConfig';

const PontosRecarga = () => {
    const [pontos, setPontos] = useState([]);

    const [deleteId, setDeleteId] = useState(null);
    const [formModal, setFormModal] = useState(null);

    const pontoEditando = typeof formModal === "number" ? pontos.find(p => p.id === formModal) : null;

    useEffect(() => {
        axiosInstance.get("/pontosderecarga")
            .then(res => setPontos(res.data))
            .catch(err => console.error("Erro ao buscar pontos:", err));
    }, []);

    const handleSave = (ponto) => {
        if (formModal === "create") {
            axiosInstance.post("/pontosderecarga", ponto)
                .then(res => {
                    setPontos([...pontos, res.data]);
                    setFormModal(null);
                })
                .catch(err => console.error("Erro ao salvar ponto:", err));
        } else if (typeof formModal === "number") {
            axiosInstance.put(`/pontosderecarga/${formModal}`, ponto)
                .then(() => {
                    setPontos(pontos.map(p => p.id === formModal ? { ...p, ...ponto } : p));
                    setFormModal(null);
                })
                .catch(err => console.error("Erro ao atualizar ponto:", err));
        }
    };

    const handleDelete = () => {
        if (deleteId !== null) {
            axiosInstance.delete(`/pontosderecarga/${deleteId}`)
                .then(() => {
                    setPontos(pontos.filter(p => p.id !== deleteId));
                    setDeleteId(null);
                })
                .catch(err => console.error("Erro ao excluir ponto:", err));
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Minhas Estações de Recarga</h1>
                <button
                    onClick={() => setFormModal("create")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    Novo ponto
                </button>
            </div>

            <div className="bg-white shadow rounded-xl overflow-x-auto">
                <table className="w-full text-base">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left">Nome</th>
                            <th className="px-6 py-4 text-left">Endereço</th>
                            <th className="px-6 py-4 text-left">Tipo</th>
                            <th className="px-6 py-4 text-left">Potência</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pontos.length > 0 ? (
                            pontos.map((ponto) => (
                                <tr key={ponto.id} className="border-t">
                                    <td className="px-6 py-4">{ponto.nome}</td>
                                    <td className="px-6 py-4">{ponto.endereco}</td>
                                    <td className="px-6 py-4">{ponto.tipo}</td>
                                    <td className="px-6 py-4">{ponto.potencia} kW</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${ponto.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {ponto.ativo ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button
                                            onClick={() => setFormModal(ponto.id)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteId(ponto.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Nenhum ponto cadastrado ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Confirmação */}
            {deleteId !== null && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Confirmar exclusão</h2>
                            <button onClick={() => setDeleteId(null)} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Tem certeza que deseja excluir este ponto de recarga? Esta ação não poderá ser desfeita.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Formulário */}
            {formModal !== null && (
                <FormPontoModal
                    onClose={() => setFormModal(null)}
                    onSave={handleSave}
                    initial={pontoEditando}
                />
            )}
        </div>
    );
};

const FormPontoModal = ({ onClose, onSave, initial }) => {
    const [form, setForm] = useState({
        nome: initial?.nome || "",
        endereco: initial?.endereco || "",
        tipo: initial?.tipo || "",
        potencia: initial?.potencia || "",
        ativo: initial?.ativo ?? true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{initial ? "Editar ponto" : "Novo ponto"}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Endereço</label>
                        <input
                            type="text"
                            name="endereco"
                            value={form.endereco}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-md"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div>
                                <label className="block text-sm font-medium">Tipo</label>
                                <select
                                    name="tipo"
                                    value={form.tipo}
                                    onChange={handleChange}
                                    className="w-full mt-1 px-4 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Selecione o tipo</option>
                                    <option value="Tipo 1">Tipo 1</option>
                                    <option value="Tipo 2">Tipo 2</option>
                                    <option value="CCS">CCS</option>
                                    <option value="CHAdeMO">CHAdeMO</option>
                                    <option value="Tesla">Tesla</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Potência (kW)</label>
                            <input
                                type="number"
                                name="potencia"
                                value={form.potencia}
                                onChange={handleChange}
                                className="w-full mt-1 px-4 py-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="ativo"
                            checked={form.ativo}
                            onChange={handleChange}
                            id="ativo"
                        />
                        <label htmlFor="ativo" className="text-sm">Ponto ativo</label>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PontosRecarga;