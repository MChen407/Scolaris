const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    icon: path.join(__dirname, "src/assets/logo.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  // === Lancer le backend packagé ===
  try {
    const backendDir = path.join(process.resourcesPath, "backend"); // dossier backend copié dans "extraResources"
    const backendEntry = path.join(backendDir, "app.js");

    if (fs.existsSync(backendEntry)) {
      backendProcess = spawn("node", ["app.js"], {
        cwd: backendDir,
        detached: true,
        stdio: "ignore",
      });
      backendProcess.unref();
    } else {
      console.error("❌ Backend introuvable :", backendEntry);
    }
  } catch (err) {
    console.error("Erreur lancement backend :", err);
  }

  // === Charger le frontend packagé ===
  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
}

app.whenReady().then(createWindow);

app.on("before-quit", () => {
  if (backendProcess && backendProcess.pid) {
    try {
      process.kill(backendProcess.pid);
    } catch (e) {}
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
