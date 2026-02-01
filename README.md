# Lightweight CI/CD Backend Server

A simple, custom CI/CD server built with Node.js, Express, and TypeScript. It listens for GitHub webhooks to automatically pull, build, and deploy your projects, and sends status notifications via Telegram.

## Features

- 🚀 **Automated Deployment**: Triggers on GitHub repository events (e.g., `push`).
- 🔐 **Secure**: Validates GitHub webhook signatures using HMAC SHA256.
- 📱 **Telegram Notifications**: Sends deployment success or failure logs to a Telegram chat.
- 🛠 **Configurable**: Support for multiple projects with custom build and start commands.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A publicly accessible URL (use [ngrok](https://ngrok.com/) for development)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/thedhruvish/ci-cd-server.git
    cd ci-cd-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

The configuration is managed in `src/config.ts`.

### 1. Telegram Configuration

Set up your Telegram bot details to receive notifications.

```typescript
// src/config.ts
export const TG_CONFIG = {
  TG_BOT_TOKEN: "YOUR_TELEGRAM_BOT_TOKEN", // Get from @BotFather
  TG_CHAT_ID: "YOUR_CHAT_ID", // Get via /id command or bot API
};
```

### 2. Project Configuration

Add your projects to the `CI_CD_CONFIG` array.

```typescript
// src/config.ts
export const CI_CD_CONFIG: ICICDProject[] = [
  {
    projectName: "My Awesome Project",
    repoUrl: "https://github.com/username/repo", // Repository URL
    event: "push", // Event to trigger deploy
    secret: "YourWebhookSecret", // Must match GitHub Webhook Secret
    branch: "main", // Branch to deploy
    projectRoot: "/absolute/path/to/project", // Local path where the project is located
    Buildcommand: ["npm install", "npm run build"], // Array of commands to build
    Startcommand: "pm2 reload app", // Command to restart/start the app
  },
];
```

## Running the Server

### Development

Run the server with hot-reloading:

```bash
npm run dev
```

### Production

Build and start the server:

```bash
npm run build
npm start
```

The server will start on port `3000` by default.

## Setting up GitHub Webhooks

1.  Go to your repository on GitHub.
2.  Navigate to **Settings** > **Webhooks** > **Add webhook**.
3.  **Payload URL**: `http://<your-server-ip-or-domain>:3000/deploy`
    - If developing locally, use your ngrok URL: `https://<your-ngrok-id>.ngrok-free.app/deploy`
4.  **Content type**: `application/json`
5.  **Secret**: Enter the same secret you put in `src/config.ts` (e.g., `Myprojects123`).
6.  **Which events would you like to trigger this webhook?**: Select "Just the push event" (or match your config).
7.  Click **Add webhook**.

## Server Setup Guide (Ubuntu/Linux)

If you are setting this up on a fresh VPS (like DigitalOcean, AWS EC2, or Hetzner):

1.  **Install Node.js & npm:**

    ```bash
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    ```

2.  **Install PM2 (Process Manager):**
    PM2 keeps your server running in the background and restarts it on crashes.

    ```bash
    sudo npm install -g pm2
    ```

3.  **Setup the CI/CD Server:**

    ```bash
    cd /path/to/ci-cd-server
    npm install
    npm run build
    pm2 start dist/index.js --name "ci-cd-server"
    pm2 save
    ```

4.  **Setup Your Target Projects:**
    Ensure the `projectRoot` directories defined in config exist and are git initialized.

    ```bash
    # Example for a target project
    cd /home/user/projects
    git clone https://github.com/username/target-repo.git
    ```

5.  **Security Note:**
    - Ensure your firewall allows traffic on port `3000` (or use Nginx as a reverse proxy).
    - Keep your secret keys safe.
