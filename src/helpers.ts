import { TG_CONFIG, type ICICDProject } from "./config.js";
import { spawn } from "node:child_process";

function trimLogs(logs: string, max = 3500) {
  if (logs.length <= max) return logs;
  return logs.slice(-max);
}

export const deployProject = (project: ICICDProject) => {
  let logs = "";

  const cloneCmd = `git fetch origin && git reset --hard origin/${project.branch}`;
  const buildCmd = project.Buildcommand.join(" && ");

  const fullCmd = `
    set -e
    cd ${project.projectRoot}
    ${cloneCmd}
    ${buildCmd}
    ${project.Startcommand}
  `;

  const child = spawn("bash", ["-c", fullCmd], {
    stdio: "pipe",
  });

  child.stdout.on("data", (d) => {
    const msg = d.toString();
    logs += msg;
    console.log(msg);
  });

  child.stderr.on("data", (d) => {
    const msg = d.toString();
    logs += msg;
    console.error(msg);
  });

  child.on("close", (code) => {
    if (code === 0) {
      sendTGMessage(
        ` *Deploy Successful*\n\n\`\`\`\n${trimLogs(logs)}\n\`\`\``,
      );
    } else {
      sendTGMessage(` *Deploy Failed*\n\n\`\`\`\n${trimLogs(logs)}\n\`\`\``);
    }
  });
};

function sendTGMessage(message: string) {
  fetch(`https://api.telegram.org/bot${TG_CONFIG.TG_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: TG_CONFIG.TG_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}
