import express from "express";
import { CI_CD_CONFIG } from "./config.js";
import crypto from "node:crypto";

import type { Request } from "express";
import { deployProject } from "./helpers.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! from ci cd");
});

app.post("/deploy", (req, res) => {
  const repoUrlFormReq = req.body?.repository?.html_url;

  const project = CI_CD_CONFIG.find((item) => item.repoUrl === repoUrlFormReq);

  if (!project) {
    return res.status(404).json({ message: "Project not found For CI CD" });
  }

  const event = req.headers["x-github-event"];

  console.log(event);
  //   check event
  if (project.event !== event) {
    return res.status(400).json({ message: "Invalid event, Skip deploy" });
  }

  const payload = req.body;

  // check project branch
  if (project.branch !== payload.ref.split("/").pop()) {
    return res.status(400).json({ message: "Invalid branch, Skip deploy" });
  }

  // verify signature
  const signature = req.headers["x-hub-signature-256"];
  console.log(signature);
  if (!signature) {
    return res.status(400).json({ message: "Invalid signature, Skip deploy" });
  }

  const calculatedSignature = crypto
    .createHmac("sha256", project.secret)
    .update(JSON.stringify(req.body))
    .digest("hex");
  console.log({ calculatedSignature, signature });
  if (`sha256=${calculatedSignature}` !== signature) {
    return res.status(400).json({ message: "Invalid signature, Skip deploy" });
  }

  //   send response to github
  res.status(200).json({ message: "Deployment started" });

  deployProject(project);
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
