"use client"
import { FiEdit2, FiX, FiChevronUp, FiChevronDown } from "react-icons/fi";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig'; 

interface Tarefa {
    id: string;
    nome: string;
    custo: number;
    dataLimite: string;
    orden: number;
}

const TaskList: React.FC = () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [novaTarefa, setNovaTarefa] = useState({ nome: '', custo: '', dataLimite: '' });
    const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

    useEffect(() => {
        const fetchTarefas = async () => {
            const tarefasCollection = collection(db, 'sistema-lista-de-tarefas');
            const tarefasSnapshot = await getDocs(tarefasCollection);
            const tarefasList = tarefasSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Tarefa[];
            setTarefas(tarefasList.sort((a, b) => a.orden - b.orden)); // Ordena as tarefas ao carregar
        };
        fetchTarefas();
    }, []);

    const adicionarTarefa = async () => {
        if (novaTarefa.nome && novaTarefa.custo && novaTarefa.dataLimite) {
            const nomeDuplicado = tarefas.some(tarefa => tarefa.nome === novaTarefa.nome);
            if (nomeDuplicado) {
                alert("Nome da tarefa já existe!");
                return;
            }
            const tarefasCollection = collection(db, 'sistema-lista-de-tarefas');
            const nova = await addDoc(tarefasCollection, { ...novaTarefa, custo: parseFloat(novaTarefa.custo), orden: tarefas.length });
            setTarefas([...tarefas, { ...novaTarefa, id: nova.id, custo: parseFloat(novaTarefa.custo), orden: tarefas.length }]);
            setNovaTarefa({ nome: '', custo: '', dataLimite: '' });
        }
    };

    const excluirTarefa = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
            await deleteDoc(doc(db, 'sistema-lista-de-tarefas', id));
            setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
        }
    };

    const iniciarEdicao = (tarefa: Tarefa) => {
        setTarefaEditando(tarefa);
    };

    const atualizarTarefa = async () => {
        if (tarefaEditando) {
            const nomeDuplicado = tarefas.some(tarefa => tarefa.nome === tarefaEditando.nome && tarefa.id !== tarefaEditando.id);
            if (nomeDuplicado) {
                alert("Nome da tarefa já existe!");
                return;
            }
            const tarefaDoc = doc(db, 'sistema-lista-de-tarefas', tarefaEditando.id);
            await updateDoc(tarefaDoc, { nome: tarefaEditando.nome, custo: tarefaEditando.custo, dataLimite: tarefaEditando.dataLimite });
            setTarefas(tarefas.map(tarefa => (tarefa.id === tarefaEditando.id ? tarefaEditando : tarefa)));
            setTarefaEditando(null);
        }
    };

    const moverTarefa = async (id: string, direcao: 'subir' | 'descer') => {
        const index = tarefas.findIndex(tarefa => tarefa.id === id);
        if (index < 0) return;

        const novaOrdem = [...tarefas];
        const [tarefa] = novaOrdem.splice(index, 1);
        novaOrdem.splice(direcao === 'subir' ? index - 1 : index + 1, 0, tarefa);

        const atualizacaoOrdem = novaOrdem.map((tarefa, index) => ({ ...tarefa, orden: index }));
        setTarefas(atualizacaoOrdem);

        for (const tarefa of atualizacaoOrdem) {
            const tarefaDoc = doc(db, 'sistema-lista-de-tarefas', tarefa.id);
            await updateDoc(tarefaDoc, { orden: tarefa.orden });
        }
    };

    return (
        <div className="container">
            <h1>Sistema de Tarefas</h1>
            <ul className="task-list">
                {tarefas.map((tarefa, index) => (
                    <li key={tarefa.id} className={`task-item ${tarefa.custo >= 1000 ? 'high-cost' : ''}`}>
                        <div className="task-details">
                            <h2>{tarefa.nome}</h2>
                            <p className="custo">Custo: R$ {tarefa.custo.toFixed(2)}</p>
                            <p>Data Limite: {tarefa.dataLimite}</p>
                        </div>
                        <div className="task-actions">
                            <button onClick={() => moverTarefa(tarefa.id, 'subir')} disabled={index === 0}><FiChevronUp size={20}/></button>
                            <button onClick={() => moverTarefa(tarefa.id, 'descer')} disabled={index === tarefas.length - 1}><FiChevronDown size={20}/></button>
                            <button onClick={() => iniciarEdicao(tarefa)}><FiEdit2 size={20}/></button>
                            <button onClick={() => excluirTarefa(tarefa.id)}><FiX size={20}/></button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="task-input">
                <input type="text" placeholder="Nome da Tarefa" value={novaTarefa.nome} onChange={(e) => setNovaTarefa({ ...novaTarefa, nome: e.target.value })} />
                <input type="number" placeholder="Custo (Ex. 10,00)" value={novaTarefa.custo} onChange={(e) => setNovaTarefa({ ...novaTarefa, custo: e.target.value })} />
                <input type="date" value={novaTarefa.dataLimite} onChange={(e) => setNovaTarefa({ ...novaTarefa, dataLimite: e.target.value })} />
                <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
            </div>
            {tarefaEditando && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Tarefa</h2>
                        <input type="text" value={tarefaEditando.nome} onChange={(e) => setTarefaEditando({ ...tarefaEditando, nome: e.target.value })} />
                        <input type="number" value={tarefaEditando.custo} onChange={(e) => setTarefaEditando({ ...tarefaEditando, custo: +e.target.value })} />
                        <input type="date" value={tarefaEditando.dataLimite} onChange={(e) => setTarefaEditando({ ...tarefaEditando, dataLimite: e.target.value })} />
                        <button onClick={atualizarTarefa}>Salvar</button>
                        <button onClick={() => setTarefaEditando(null)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
