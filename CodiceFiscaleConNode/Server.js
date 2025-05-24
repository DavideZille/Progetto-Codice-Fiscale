const express = require("express");//server per la gestione con express delle richieste del client
const fs = require("fs");
const path = require("path");

const app = express();

// Faccio in modo che il client possa accedere a tutto ciò che sia all'interno della cartella "public" (avrei potuto mettere il file dei comuni lì e usare l'identico codice usato nelal versione di liveserver, ma cosi fa più figo)
app.use(express.static("public"));

// controllo richieste vuote (quando uno si collega dal browser)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"public","DAVIDE ZILLE - index.html"));
});

// controllo richiesta get per leggere il file e restituirne il contenuto
app.get("/ObtainDataFromFile", (req, res) => {
    const filePath = path.join(__dirname, "private", "DAVIDE ZILLE - lista-codici.txt");//path del file, dato dalla directory dove si trova il server + il nome del file

    fs.readFile(filePath, "utf8", (err, data) => {//richiesta al sistema operativo di leggere un file
        if (err) {
            console.error("Errore nella lettura del file:", err);
            return res.status(500).send("Errore nel caricamento del file");
        }
        res.send(data); // Manda il contenuto del file al client
    });
});

app.get("/ObtainAllEntriesFromServer", (req, res) => {
    const filePath = path.join(__dirname, "private", "History.txt");//path del file, dato dalla directory dove si trova il server + il nome del file
    fs.readFile(filePath, "utf8", (err, data) => {//richiesta al sistema operativo di leggere un file
        if (err) {
            console.error("Errore nella lettura del file:", err);
            return res.status(500).send("Errore nel caricamento del file");
        }
        res.send(data); // Manda il contenuto del file al client
    });
});

app.get("/WriteEntryToHistory", (req, res) => {
    const dataToSave = req.query.data;
    if (!dataToSave) { // Controlla se è stato inviato un dato
        return res.status(400).send("No data provided");
    }
    const filePath = path.join(__dirname, "private", "History.txt"); // Path dove salvare i dati
    // Scrivi in append nel file in modalita append
    try{
        fs.readFile(filePath, "utf8", (err, data) => {//richiesta al sistema operativo di leggere un file
            if(!data.includes(dataToSave)){
                fs.appendFile(filePath, dataToSave + '\n', (err) => {
                    if (err) {
                        console.error("Errore di scrittura nel file", err);
                        return res.status(500).send("Errore, dato non salvato.");
                    }
                    res.send("Dato ottenuto con successo!");
                });
            }
        });
    }catch(error){
        console.log("Errore invio dati.");
    }
});

app.get("")

app.listen(3000, () => {// Avvio del server su port 3000
    console.log("Server avviato su http://localhost:3000");
});

