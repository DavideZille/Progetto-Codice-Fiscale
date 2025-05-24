Per fare funzionare il server seguire questi passaggi->

1) Aprire un terminal cmd su vsc (oppure da windows normalmente)
2) Eseguire i seguenti comandi:
---
winget install Schniz.fnm

fnm install 22
---
3) Controllare se ha funzionato (da fare all'interno nel terminal in versione cmd, non powershell, di vsc) (è probabile che devi riavviare vsc tra i comandi precedenti e questi)
---
node -v
npm -v
---
4) Se nessuno dei due ha dato errori e trova le versioni, esegui sempre in terminal cmd di vsc code:
---
cd /.../Progetto Codice Fiscale ZILLE/CodiceFiscaleConNode              (devi andare con la cmd alla cartella contenente il file del server)
Node Server.js
---
5) Aprire un browser e naviga su localhost:3000
6) Enjoy ! (chiedimi se hai problemi)