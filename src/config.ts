export interface ICICDProject {
  projectName: string;
  repoUrl: string;
  event: string;
  projectRoot: string;
  secret: string;
  branch: string;
  Buildcommand: string[];
  Startcommand: string;
}

export const CI_CD_CONFIG: ICICDProject[] = [
  {
    projectName: "My Project",
    repoUrl: "https://github.com/thedhruvish/prot-v",
    event: "push",
    secret: "Myprojects123",
    branch: "main",
    projectRoot: "/home/dhruvish/Desktop/coding/temp/newwebhook",
    Buildcommand: ["npm install", "npm run build"],
    Startcommand: "pm2 reload a",
  },
] as const;

export const TG_CONFIG = {
  TG_BOT_TOKEN: "123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11", // https://t.me/botfather
  TG_CHAT_ID: "123456789", // https://t.me/MissRose_bot  `/id` command
};
