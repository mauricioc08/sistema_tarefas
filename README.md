# Sistema de Lista de Tarefas

Este é um sistema web para cadastro e gerenciamento de tarefas, utilizando Nextjs e Firebase. O sistema permite que os usuários adicionem, editem, excluam e reordenem tarefas.

## Funcionalidades

- **Listagem de Tarefas**: Visualização de todas as tarefas cadastradas.
- **Adicionar Tarefa**: Inclusão de novas tarefas com nome, custo e data limite.
- **Editar Tarefa**: Edição das informações de uma tarefa existente.
- **Excluir Tarefa**: Remoção de uma tarefa após confirmação.
- **Reordenar Tarefas**: Possibilidade de mudar a ordem das tarefas usando arrastar e soltar ou botões de subir/descer.
- **Validação**: Verificação de nomes duplicados ao adicionar ou editar tarefas.

## Tecnologias Utilizadas

- **Nextjs**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Firebase**: Plataforma para desenvolvimento de aplicativos, usada aqui para o gerenciamento do banco de dados.
- **React Icons**: Biblioteca de ícones para uma interface mais intuitiva.

## Estrutura do Banco de Dados

### Tabela: `sistema-lista-de-tarefas`

| Campo                | Tipo      | Descrição                                     |
|----------------------|-----------|-----------------------------------------------|
| `id`                 | String    | Identificador único da tarefa (chave primária) |
| `nome`               | String    | Nome da tarefa                                |
| `custo`              | Number    | Custo da tarefa em R$                         |
| `dataLimite`        | String    | Data limite para a conclusão da tarefa        |
| `orden`              | Number    | Ordem de apresentação da tarefa                |

## Instruções de Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/sistema-lista-de-tarefas.git

2. Navegue até a pasta do projeto:
   ```bash
   cd sistema-lista-de-tarefas
   
3. Instale as dependências:  
   ```bash
   npm install
   
4. Configure o Firebase:
    - Crie um projeto no Firebase Console.
    - Copie as credenciais do seu projeto e configure no arquivo firebaseConfig.ts.
   
5. Inicie a aplicação:
   ```bash
   npm start

# Link do Projeto:
 https://sistema-tarefas.vercel.app/   
