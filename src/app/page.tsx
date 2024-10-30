"use client"

// import styles from "./page.module.css";
// components/TaskList.tsx
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
    const [novaTarefa, setNovaTarefa] = useState({ nome: '', custo: 0, dataLimite: '' });
    const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

    useEffect(() => {
        const fetchTarefas = async () => {
            const tarefasCollection = collection(db, 'Tarefas');
            const tarefasSnapshot = await getDocs(tarefasCollection);
            const tarefasList = tarefasSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Tarefa[];
            setTarefas(tarefasList);
        };
        fetchTarefas();
    }, []);

    const adicionarTarefa = async () => {
        const tarefasCollection = collection(db, 'Tarefas');
        const nova = await addDoc(tarefasCollection, { ...novaTarefa, orden: tarefas.length });
        setTarefas([...tarefas, { ...novaTarefa, id: nova.id, orden: tarefas.length }]);
        setNovaTarefa({ nome: '', custo: 0, dataLimite: '' });
    };

    const excluirTarefa = async (id: string) => {
        await deleteDoc(doc(db, 'Tarefas', id));
        setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    };

    const iniciarEdicao = (tarefa: Tarefa) => {
        setTarefaEditando(tarefa);
    };

    const atualizarTarefa = async () => {
        if (tarefaEditando) {
            const tarefaDoc = doc(db, 'Tarefas', tarefaEditando.id);
            await updateDoc(tarefaDoc, { nome: tarefaEditando.nome, custo: tarefaEditando.custo, dataLimite: tarefaEditando.dataLimite });
            setTarefas(tarefas.map(tarefa => (tarefa.id === tarefaEditando.id ? tarefaEditando : tarefa)));
            setTarefaEditando(null);
        }
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <input
                type="text"
                placeholder="Nome da Tarefa"
                value={novaTarefa.nome}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, nome: e.target.value })}
            />
            <input
                type="number"
                placeholder="Custo (R$)"
                value={novaTarefa.custo}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, custo: +e.target.value })}
            />
            <input
                type="date"
                value={novaTarefa.dataLimite}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, dataLimite: e.target.value })}
            />
            <button onClick={adicionarTarefa}>Adicionar Tarefa</button>

            <ul>
                {tarefas.map(tarefa => (
                    <li key={tarefa.id}>
                        <span style={{ backgroundColor: tarefa.custo >= 1000 ? 'yellow' : 'transparent' }}>
                            {tarefa.nome} - R$ {tarefa.custo} - {tarefa.dataLimite}
                        </span>
                        <button onClick={() => iniciarEdicao(tarefa)}>Editar</button>
                        <button onClick={() => excluirTarefa(tarefa.id)}>Excluir</button>
                    </li>
                ))}
            </ul>

            {tarefaEditando && (
                <div>
                    <h2>Editar Tarefa</h2>
                    <input
                        type="text"
                        value={tarefaEditando.nome}
                        onChange={(e) => setTarefaEditando({ ...tarefaEditando, nome: e.target.value })}
                    />
                    <input
                        type="number"
                        value={tarefaEditando.custo}
                        onChange={(e) => setTarefaEditando({ ...tarefaEditando, custo: +e.target.value })}
                    />
                    <input
                        type="date"
                        value={tarefaEditando.dataLimite}
                        onChange={(e) => setTarefaEditando({ ...tarefaEditando, dataLimite: e.target.value })}
                    />
                    <button onClick={atualizarTarefa}>Salvar</button>
                    <button onClick={() => setTarefaEditando(null)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default TaskList;
