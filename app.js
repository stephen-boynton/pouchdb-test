const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
const PouchDB = require("pouchdb");
const db = new PouchDB("files");

function generateId() {
	return Math.floor(Math.random() * 1000) + "A";
}

db.info().then(function(info) {
	console.log(info);
});

app.on("ready", () => {
	mainWindow = new BrowserWindow({ title: "PouchDB TryOut" });
	mainWindow.loadURL(`file://${__dirname}/page.html`);
});

ipcMain.on("info", (event, info) => {
	const doc = {
		_id: generateId(),
		information: info
	};
	db.put(doc);
});

ipcMain.on("get", event => {
	db
		.allDocs({
			include_docs: true,
			attachments: true
		})
		.then(function(result) {
			mainWindow.webContents.send("return", result);
		})
		.catch(function(err) {
			console.log(err);
		});
});
