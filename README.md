
# Task Board

Este projeto é uma aplicação web de **Task Board** para gerenciar e acompanhar tarefas. Desenvolvido utilizando **Next.js 14** com o **App Router**, **React 18**, **Tailwind CSS** para estilização, **Firebase Firestore** como banco de dados e **NextAuth** para autenticação social via Google.

## Funcionalidades

- **Gerenciamento de Tarefas**: Criação, edição e remoção de tarefas.
- **Autenticação**: Login social com Google utilizando **NextAuth**.
- **Banco de Dados em Tempo Real**: Integração com **Firebase Firestore** para persistência e listagem de tarefas.
- **Interface Responsiva**: Estilização responsiva usando **Tailwind CSS**.

## Tecnologias Utilizadas

- **Next.js 14**: Framework React para construção de aplicações web com renderização do lado do servidor (SSR) e API routes.
- **React 18**: Nova versão do React para melhor performance e novos hooks.
- **Tailwind CSS**: Framework utilitário CSS para estilização rápida e customizável.
- **Firebase Firestore**: Banco de dados NoSQL em tempo real para armazenar e gerenciar as tarefas.
- **NextAuth**: Biblioteca de autenticação para Next.js, utilizada para login via Google.

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/task-board.git
```

2. Entre no diretório do projeto:

```bash
cd task-board
```

3. Instale as dependências:

```bash
npm install
```

4. Configure as variáveis de ambiente:

Crie um arquivo `.env.local` na raiz do projeto e adicione as seguintes variáveis:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

5. Execute o projeto localmente:

```bash
npm run dev
```

6. Abra o navegador e acesse [http://localhost:3000](http://localhost:3000).

## Configuração do Firebase Firestore

Para configurar o Firestore:

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
2. Ative o Firestore no projeto.
3. Obtenha as credenciais (API key, Project ID, etc.) e adicione no arquivo `.env.local`.

## Configuração do NextAuth

Para configurar o **NextAuth** com login via Google:

1. Vá até o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto e ative as APIs necessárias para autenticação.
3. Crie as credenciais OAuth 2.0 e adicione o Client ID e Client Secret nas variáveis de ambiente.
4. Configure as rotas de callback e logout no Google Console, apontando para `/api/auth/callback/google` e `/api/auth/logout`.


## Próximos Passos

- Adicionar categorias às tarefas.
- Implementar funcionalidade de arrastar e soltar (drag-and-drop) para reordenar tarefas.
- Melhorar notificações e feedback de usuário.

## Contribuições

Sinta-se à vontade para contribuir com melhorias ou novas funcionalidades. Para isso, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nome-feature`).
3. Envie suas alterações (`git commit -m 'Adicionei nova feature'`).
4. Faça o push para a branch (`git push origin feature/nome-feature`).
5. Crie um Pull Request.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

---

Se precisar de ajustes ou mais detalhes, posso ajudar a refinar!