"use client"

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

    // Função para buscar tarefas do Firestore
    useEffect(() => {
        const fetchTarefas = async () => {
            const tarefasCollection = collection(db, 'sistema-lista-de-tarefas');
            const tarefasSnapshot = await getDocs(tarefasCollection);
            const tarefasList = tarefasSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Tarefa[];
            setTarefas(tarefasList);
        };
        fetchTarefas();
    }, []);

    // Função para adicionar nova tarefa
    const adicionarTarefa = async () => {
        if (novaTarefa.nome && novaTarefa.custo && novaTarefa.dataLimite) {
            const tarefasCollection = collection(db, 'sistema-lista-de-tarefas');
            const nova = await addDoc(tarefasCollection, { ...novaTarefa, custo: parseFloat(novaTarefa.custo), orden: tarefas.length });
            setTarefas([...tarefas, { ...novaTarefa, id: nova.id, custo: parseFloat(novaTarefa.custo), orden: tarefas.length }]);
            setNovaTarefa({ nome: '', custo: '', dataLimite: '' });
        }
    };
    
    

    // Função para excluir tarefa
    const excluirTarefa = async (id: string) => {
        await deleteDoc(doc(db, 'sistema-lista-de-tarefas', id));
        setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    };

    // Função para iniciar edição de tarefa
    const iniciarEdicao = (tarefa: Tarefa) => {
        setTarefaEditando(tarefa);
    };

    // Função para atualizar tarefa
    const atualizarTarefa = async () => {
        if (tarefaEditando) {
            const tarefaDoc = doc(db, 'sistema-lista-de-tarefas', tarefaEditando.id);
            await updateDoc(tarefaDoc, { nome: tarefaEditando.nome, custo: tarefaEditando.custo, dataLimite: tarefaEditando.dataLimite });
            setTarefas(tarefas.map(tarefa => (tarefa.id === tarefaEditando.id ? tarefaEditando : tarefa)));
            setTarefaEditando(null);
        }
    };

    return (
        <div>
            <h1>Lista de Tarefas</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Custo (R$)</th>
                        <th>Data Limite</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {tarefas.map(tarefa => (
                        <tr key={tarefa.id} style={{ backgroundColor: tarefa.custo >= 1000 ? 'yellow' : 'transparent' }}>
                            <td>{tarefa.nome}</td>
                            <td>R$ {tarefa.custo.toFixed(2)}</td>
                            <td>{tarefa.dataLimite}</td>
                            <td>
                                <button onClick={() => iniciarEdicao(tarefa)}>&#9998;</button> {/* Ícone de editar */}
                                <button onClick={() => excluirTarefa(tarefa.id)}>&#10060;</button> {/* Ícone de excluir */}
                            </td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
            <input
                type="text"
                placeholder="Nome da Tarefa"
                value={novaTarefa.nome}
                required
                onChange={(e) => setNovaTarefa({ ...novaTarefa, nome: e.target.value })}
            />
            <input
                type="number"
                placeholder="Custo (Ex. 10,00)"
                value={novaTarefa.custo}
                required
                onChange={(e) => setNovaTarefa({ ...novaTarefa, custo: e.target.value })}
            />
            <input
                type="date"
                value={novaTarefa.dataLimite}
                onChange={(e) => setNovaTarefa({ ...novaTarefa, dataLimite: e.target.value })}
            />
            <button onClick={adicionarTarefa}>Adicionar Tarefa</button>
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
