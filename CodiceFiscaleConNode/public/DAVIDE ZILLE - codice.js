const file = 'DAVIDE ZILLE - lista-codici.txt';
var Name, Surname, Sex = null, BirthMonth = null, BirthPlace, dateIsValid = true;
var state = [false, false, false, false, false];
var cookieEnabled = false;
var pageTheme = "White";
$(document).ready(function () {
  $(".interactable").mouseover(function () {
    $(this).animate({ scale: "1.05" }, { duration: 200 })
  });
  $(".interactable").mouseleave(function () {
    $(this).animate({ scale: "1" }, { duration: 200 })
  });

  $("#Name").change(function () {
    if (document.getElementById("Name").value.trim().length === 0) {
      if (state[0] !== false) {
        rotateStatusIcon("#icon1");
        state[0] = false;
      }
    } else {
      if (state[0] !== true) {
        rotateStatusIcon("#icon1");
        state[0] = true;
      }
    }
    Name = document.getElementById("Name").value;
  })
  $("#Surname").change(function () {
    if (document.getElementById("Surname").value.trim().length === 0) {
      if (state[1] !== false) {
        rotateStatusIcon("#icon2");
        state[1] = false;
      }
    } else {
      if (state[1] !== true) {
        rotateStatusIcon("#icon2");
        state[1] = true;
      }
    }
    Surname = document.getElementById("Surname").value;
  })
  loadDateUtils();
  updateBirthPlaceSelector();
  $("#BirthPlaceSelector").change(function () {
    BirthPlace = $("#BirthPlaceSelector option:selected").text();
    if (BirthPlace !== "---") {
      if (state[4] !== true) {
        rotateStatusIcon("#icon5");
        state[4] = true;
      }
    } else {
      if (state[4] !== false) {
        rotateStatusIcon("#icon5");
        state[4] = false;
      }
    }

  })
  $("#Output").hide();//all'inizio è in hide
  //chiedi per i cookies (se non ne hai gia attivi, in quel caso non serve)
  cookieEnabled = document.cookie.includes("IDENTIFIER");
  if (!cookieEnabled)
    openCookieRequest();//PopUp per i cookies!
  if (document.cookie.includes("Theme")) {//cerca se ce un cookie per il theme della pagina, se non ce allora carica i default
    pageTheme = getCookie("Theme");
  } else {
    pageTheme = "Black";
    addCookie("Theme", "Black");
  }
  loadColor();
})

function setSex(x, LockToFalse = false) {
  if (state[2] !== true && !LockToFalse) {
    rotateStatusIcon("#icon3");
    state[2] = true;
  }
  if (x === true) {
    if (pageTheme === "Black") {
      $("#Male").css("background-color", "#28292c");
      $("#Female").css("background-color", "#424349");
    } else {
      $("#Male").css("background-color", "#21b0bb");
      $("#Female").css("background-color", "#78b7c4");
    }

    Sex = "Male";
  } else if (x === false) {
    if (pageTheme === "Black") {
      $("#Female").css("background-color", "#28292c");
      $("#Male").css("background-color", "#424349");
    } else {
      $("#Female").css("background-color", "#21b0bb");
      $("#Male").css("background-color", "#78b7c4");
    }

    Sex = "Female";
  } else {//se non è true or false allora (tecnicamente) hai premuto il reset
    if (pageTheme === "Black") {
      $("#Female").css("background-color", "#424349");
      $("#Male").css("background-color", "#424349");
    } else {
      $("#Female").css("background-color", "#78b7c4");
      $("#Male").css("background-color", "#78b7c4");
    }
    Sex = null;
  }
}

function loadDateUtils() {
  $("#DaySelector").append("<option selected disabled>Giorno</option>");
  for (let k = 0; k < 31; k++) {
    $("#DaySelector").append("<option>" + (k + 1) + "</option>");
  }
  $("#DaySelector").change(function () {
    checkDate();
  })
  $("#MonthSelector").append("<option selected disabled>Mese</option><option>Gennaio</option><option>Febbraio</option><option>Marzo</option><option>Aprile</option><option>Maggio</option><option>Giugno</option><option>Luglio</option><option>Agosto</option><option>Settembre</option><option>Ottobre</option><option>Novembre</option><option>Dicembre</option>");
  $("#MonthSelector").change(function () {
    let targetDays = 31;
    let currday = parseInt($("#DaySelector option:selected").text());
    if (isNaN(currday)) {//isNaN perchè NaN in js non è uguale a NaN, per qualche motivo
      currday = 0;
    }
    switch ($("#MonthSelector option:selected").text()) {
      case "Gennaio":
        BirthMonth = "A"
        targetDays = 31;
        break;
      case "Febbraio":
        BirthMonth = "B"
        if (isBis($("#YearSelector option:selected").text())) {
          targetDays = 29;
        } else {
          targetDays = 28;
        }
        break;
      case "Marzo":
        BirthMonth = "C"
        targetDays = 31;
        break;
      case "Aprile":
        BirthMonth = "D"
        targetDays = 30;
        break;
      case "Maggio":
        BirthMonth = "E"
        targetDays = 31;
        break;
      case "Giugno":
        BirthMonth = "H"
        targetDays = 30;
        break;
      case "Luglio":
        BirthMonth = "L"
        targetDays = 31;
        break;
      case "Agosto":
        BirthMonth = "M"
        targetDays = 31;
        break;
      case "Settembre":
        BirthMonth = "P"
        targetDays = 30;
        break;
      case "Ottobre":
        BirthMonth = "R"
        targetDays = 31;
        break;

      case "Novembre":
        BirthMonth = "S"
        targetDays = 30;
        break;
      case "Dicembre":
        BirthMonth = "T"
        targetDays = 31;
        break;
    }
    $("#DaySelector").empty();
    $("#DaySelector").append("<option selected disabled>Giorno</option>");
    for (let k = 0; k < targetDays; k++) {
      if (currday === (k + 1)) {
        $("#DaySelector").append("<option selected>" + (k + 1) + "</option>");
      } else {
        $("#DaySelector").append("<option>" + (k + 1) + "</option>");
      }
    }
    checkDate();
  })

  $("#YearSelector").append("<option selected disabled>Anno</option>");
  for (let k = new Date().getFullYear(); k >= 1900; k--) {
    $("#YearSelector").append("<option>" + k + "</option>");
  }

  $("#YearSelector").change(function () {//funzione change per selector dell'anno
    if (isBis($("#YearSelector option:selected").text()) && ($("#MonthSelector option:selected").text() === "Febbraio"))//se è bisestile, gli faccio ri-scegliere il mese, giusto in caso...
      $("#MonthSelector").prop("selectedIndex", "0")
    else {
      $("#DaySelector").prop("selectedIndex", "0");
      if ($("#MonthSelector option:selected").text() === "Febbraio") {
        let currday=parseInt($("#DaySelector option:selected").text());
        $("#DaySelector").empty();
        $("#DaySelector").append("<option selected disabled>Giorno</option>");
        for (let k = 0; k < 28; k++) {
          if (currday === (k + 1)&&currday!=29) {
            $("#DaySelector").append("<option selected>" + (k + 1) + "</option>");
          } else {
            $("#DaySelector").append("<option>" + (k + 1) + "</option>");
          }
        }
      }
    }

    checkDate();
  })
  $("#BirthPlaceSearch").change(updateBirthPlaceSelector);
}

function isBis(anno) {//controllo anno bisestile
  if (anno !== "---") {
    anno = parseInt(anno);
    if (anno % 4 === 0) {
      if (anno % 100 === 0) {
        if (anno % 400 === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

function checkDate() {//controllo che la data sia valida
  dateIsValid = true;
  dateIsValid = !($("#DaySelector option:selected").text() === "Giorno");
  if (dateIsValid)
    dateIsValid = !($("#MonthSelector option:selected").text() === "Mese");
  if (dateIsValid) {
    dateIsValid = !($("#YearSelector option:selected").text() === "Anno");
  }
  if (dateIsValid) {
    if (state[3] !== true) {
      rotateStatusIcon("#icon4");
      state[3] = true;
    }
  } else {
    if (state[3] !== false) {
      rotateStatusIcon("#icon4");
      state[3] = false;
    }
  }
}

function check() {
  let v = true;
  for (let k = 0; k < 5; k++) {//controllo che tutti gli state siano true, (ovvero che tutti i dati sono stati immessi)
    if (!state[k]) {
      v = false;
      shakeIcon(k);
    }
  }
  if (v) {
    {
      $("#OutputBar").animate({ width: "40vw", left: "17.5vw" }, { duration: 2000, queue: false });//{width:"12vw",left: "44vw"} -> {width:"40vw",left: "30vw"}   {width:"12vw",left: "31.5vw"} -> {width:"40vw",left: "17.5vw"}
      $("#Output").show().animate({ width: "24vw" }, { duration: 2000, queue: false });
    }
    let cod = "";
    Surname = Surname.trim().toUpperCase();//evita gli spazi
    if (Surname.length > 3) {
      let cons = "";
      let vo = "";
      for (let k = 0; k < Surname.length; k++) {
        if (isConsonant(Surname[k])) {
          cons += Surname[k];
        } else {
          vo += Surname[k];
        }
      }
      if (cons.length >= 3) {
        cod += cons.substring(0, 3);
      } else {
        cod += cons;
        for (let j = 0; j + cons.length < 3; j++) {
          cod += vo[j];
        }
      }
    } else {
      if (Surname.length === 1) {
        cod += Surname.substring(0, 1).toUpperCase();
        cod += "XX";
      } else if (Surname.length === 2) {
        cod += Surname.substring(0, 2).toUpperCase();
        cod += "X";
      } else {
        cod += Surname.substring(0, 3).toUpperCase();
      }
    }
    Name = Name.trim().toUpperCase();//evita gli spazi
    if (Name.length > 3) {
      let cons = "";
      let vo = "";
      for (let k = 0; k < Name.length; k++) {
        if (isConsonant(Name[k])) {
          cons += Name[k];
        } else {
          vo += Name[k];
        }
      }
      if (cons.length === 3) {
        cod += cons.substring(0, 3);
      } else if (cons.length > 3) {
        cod += cons.charAt(0) + cons.charAt(2) + cons.charAt(3);
      } else {
        cod += cons;
        for (let j = 0; j + cons.length < 3; j++) {
          cod += vo[j];
        }
      }
    } else {
      if (Name.length == 1) {
        cod += Name.substring(0, 1).toUpperCase();
        cod += "XX";
      } else if (Name.length == 2) {
        cod += Name.substring(0, 2).toUpperCase();
        cod += "X";
      } else {
        cod += Name.substring(0, 3).toUpperCase();
      }
    }

    {//componenti data di nascita
      cod += $("#YearSelector option:selected").text().substring(2, 4);
      cod += BirthMonth;
      {//giorno in base al sesso
        if (Sex === "Male") {
          let temp = $("#DaySelector option:selected").text();
          if (temp.length === 1) {
            temp = "0" + temp;
          }
          cod += temp;
        } else {
          cod += (parseInt($("#DaySelector option:selected").text()) + 40);
        }
      }
    }

    {//prelievo codice comune + resto del codice
      getBirthPlaceCodeByName(BirthPlace).then(x => { //Devo leggere il file, visto che la lettura non ritorna subito il valore (perchè è funzione asincrona e non volevo sprecare ram per 
        cod += x;                                     //salvare ogni codice di ogni comune in un array/lista alla prima lettura). Quindi devo aspettare il return (quindi si usa il then)
        cod = cod.trim();                             //che mi restituisce il valore del return nella x, successivamente gli dò il resto del codice che ha ancora da fare nel calcolo del
        //codice fiscale. (Tutto ciò si fa solo DOPO che hai ottenuto la risposta dalla funzione asincrona di lettura)
        {//calcolo carattere finale
          let sx = 0, dx = 0;
          for (let i = 0; i < cod.length; i++) {
            if ((i + 1) % 2 === 0) {          // Caratteri posizione pari
              if (!isNaN(parseInt(cod[i]))) {//serve in NaN, perch in js NaN===NaN è sempre falso...
                sx += parseInt(cod[i]);//se è un numero, posso semplicemente sommarlo
              } else {//se non lo è, prendo l'ascii -65
                sx += (cod.charCodeAt(i) - 65);//prendi direttamente il codice ascii e gli togli 65, che sarebbe la 'A'
              }
            } else {// Caratteri posizione dispari
              switch (cod[i]) {//uso uno switch perchè non credo ci sia un patter prestabilito, inoltre non volevo sprecare risorse per oggetti strani usati solo in questa parte di codice.
                case '0': dx += 1; break;
                case '1': dx += 0; break;
                case '2': dx += 5; break;
                case '3': dx += 7; break;
                case '4': dx += 9; break;
                case '5': dx += 13; break;
                case '6': dx += 15; break;
                case '7': dx += 17; break;
                case '8': dx += 19; break;
                case '9': dx += 21; break;
                case 'A': dx += 1; break;
                case 'B': dx += 0; break;
                case 'C': dx += 5; break;
                case 'D': dx += 7; break;
                case 'E': dx += 9; break;
                case 'F': dx += 13; break;
                case 'G': dx += 15; break;
                case 'H': dx += 17; break;
                case 'I': dx += 19; break;
                case 'J': dx += 21; break;
                case 'K': dx += 2; break;
                case 'L': dx += 4; break;
                case 'M': dx += 18; break;
                case 'N': dx += 20; break;
                case 'O': dx += 11; break;
                case 'P': dx += 3; break;
                case 'Q': dx += 6; break;
                case 'R': dx += 8; break;
                case 'S': dx += 12; break;
                case 'T': dx += 14; break;
                case 'U': dx += 16; break;
                case 'V': dx += 10; break;
                case 'W': dx += 22; break;
                case 'X': dx += 25; break;
                case 'Y': dx += 24; break;
                case 'Z': dx += 23; break;
              }
            }
          }
          cod += String.fromCharCode(((dx + sx) % 26) + 65);//uso l'ascii, è più veloce... deve partire da "A", quindi da 65
          cod = cod.trim();
        }

        {
          if (cookieEnabled)
            addCookie(cod);//salvalo nella history (se abilitato)
          sendDataToServer(cod);//mandalo alla history del server
          loadHistoryCookies();//update della history immediato
          let toWrite = "Il tuo codicefiscale è : " + cod;
          for (let k = 0; k <= toWrite.length; k++) {
            setTimeout(function () {
              $("#Output").text(toWrite.substring(0, k));//una sorta di animazione per far stampare il testo, scrive un char della stringa ogni 75ms
            }, k * 75);
          }
        }

      })
    }
  } else {
    $("#OutputBar").animate({ width: "12vw", left: "31.5vw" }, { duration: 2000, queue: false });//{width:"12vw",left: "44vw"} -> {width:"12vw",left: "31.5vw"}
    $("#Output").animate({ width: "0vw" }, { duration: 2000, queue: false });
    setTimeout(function () {
      $("#Output").hide();
    }, 2000);
    $("#Output").text("");
    cannotCalculate();
  }
}

async function updateBirthPlaceSelector() {//la funzione va dichiarata come asyncrona, perchè fetch quando richiede dati ad un server è asynch
  try {
    const response = await fetch('/ObtainDataFromFile');//fai una richiesta ObtainDataFromFile al server
    if (!response.ok) throw new Error('Errore nel caricamento');//controllo per eventuali errori (catturato poi in caso dal try catch)

    let data = await response.text();//decodifica il messaggio in .text   (solitamente si usa json perchè è un formato più usato, ma il file dei comuni e un txt, quindi text)
    //la decodifica in .text() è anch'essa asynch, quindi si usa await per aspettare la risposta prima di continuare il codice

    //il resto del codice è uguale a quello nella versione per liveserver
    $("#BirthPlaceSelector").empty();
    $("#BirthPlaceSelector").append("<option selected disabled>---</option>");
    data = data.split('\n');
    data.forEach(line => {
      if (line.split(';')[0].includes(document.getElementById("BirthPlaceSearch").value.toUpperCase())) {
        $("#BirthPlaceSelector").append("<option>" + line.split(';')[0] + "</option>");
      }
    });
  } catch (error) {
    console.error('Errore durante il caricamento del file:', error);
  }
}

async function getBirthPlaceCodeByName(name) {
  try {
    const response = await fetch('/ObtainDataFromFile');//fai una richiesta ObtainDataFromFile al server
    if (!response.ok) throw new Error('Errore nel caricamento');//controllo per eventuali errori (catturato poi in caso dal try catch)

    let data = await response.text();//decodifica il messaggio in .text   (solitamente si usa json perchè è un formato più usato, ma il file dei comuni e un txt, quindi text)
    //la decodifica in .text() è anch'essa asynch, quindi si usa await per aspettare la risposta prima di continuare il codice

    //il resto del codice è uguale a quello nella versione per liveserver
    data = data.split('\n');
    for (let x = 0; x < data.length; x++) {
      let temp = data[x].split(';');
      if (temp[0] === name) {
        return temp[1];
      }
    }
    return "NaN"; // Se il nome non viene trovato
  } catch (error) {
    console.error('Errore durante il caricamento del file:', error);
    return "NaN"; // In caso di errore restituisce "NaN"
  }
}

function isConsonant(letter) {
  return letter.match("^[bcdfghjklmnpqrstvwxyz]$".toUpperCase()) !== null;/* regex per vedere se è una consonante, per qualche ragione in js match ritorna null se falso, quindi bisogna usare !==null */
}

//funzionalità aggiuntive

function loadColor() {
  if (pageTheme === "White") {
    $("[data-colorSelector='pane']").css("background-color", "#8dc1cc").css("color", "#205966");
    $("[data-colorSelector='pane2']").css("background-color", "#78b7c4").css("color", "#205966");
    $("[data-colorSelector='input']").css("background-color", "#78b7c4").css("color", "#205966");
    $("[data-colorSelector='label']").css("background-color", "#78b7c4").css("color", "#205966");
    $("[data-colorSelector='text']").css("color", "#205966");
    $("body").css("background-color", "#bfdae0");
    $("#ThemeButton").attr("src", "imgs/LightMode.png");
    if (state[2] === true)
      setSex(Sex === "Male");//deve ricaricare il sex (se già caricato), sennò verrebbe sovrascritto
  } else {
    $("[data-colorSelector='pane']").css("background-color", "#323236").css("color", "#b3b3b3");
    $("[data-colorSelector='pane2']").css("background-color", "#2f2f33").css("color", "#b3b3b3");
    $("[data-colorSelector='input']").css("background-color", "#424349").css("color", "#b3b3b3");
    $("[data-colorSelector='label']").css("background-color", "#424349").css("color", "#b3b3b3");
    $("[data-colorSelector='text']").css("color", "#b3b3b3");
    $("body").css("background-color", "#202022");
    $("#ThemeButton").attr("src", "imgs/DarkMode.png");
    if (state[2] === true)
      setSex(Sex === "Male");//deve ricaricare il sex (se già caricato), sennò verrebbe sovrascritto
  }
}
function refreshAll() {
  $("#Name").val("");//reset delle value
  $("#Surname").val("");
  setSex(null, true);
  $("#DaySelector").prop("selectedIndex", "0")//cambia l'index selezionato al primo ("Giorno")   .attr() è per gli attributi mentre .prop() è per le proprietà
  $("#MonthSelector").prop("selectedIndex", "0")
  $("#YearSelector").prop("selectedIndex", "0")
  $("#BirthPlaceSelector").prop("selectedIndex", "0")
  $("#BirthPlaceSearch").val("");

  for (let x = 0; x < 5; x++) {
    if (state[x])
      rotateStatusIcon("#icon" + (x + 1));//reset tutti i flag
    state[x] = false;
  }
}

function changeTheme() {
  if (pageTheme === "Black") {
    modifyCookie("Theme", "White");
    pageTheme = "White";
    loadColor();
  } else {
    modifyCookie("Theme", "Black");
    pageTheme = "Black";
    loadColor();
  }
}

//roba per animazioni
function rotateStatusIcon(icon) {
  $(icon).animate({ scale: "1.25" }, { duration: 500, queue: true });
  $(icon).animate({ rotate: "+=180deg" }, { duration: 500, queue: false });
  $(icon).animate({ scale: "1.0" }, { duration: 500, queue: true });
}
function shakeIcon(n) {
  let targetId = "#input" + (n + 1);
  $(targetId).animate({ left: "-=.3vw" }, { duration: 100, queue: true });
  $(targetId).animate({ left: "+=.6vw" }, { duration: 100, queue: true });
  $(targetId).animate({ left: "-=.6vw" }, { duration: 100, queue: true });
  $(targetId).animate({ left: "+=.6vw" }, { duration: 100, queue: true });
  $(targetId).animate({ left: "-=.6vw" }, { duration: 100, queue: true });
  $(targetId).animate({ left: "+=.3vw" }, { duration: 100, queue: true });
}
function cannotCalculate() {
  $("#Output").animate({ left: "-=.3vw" }, { duration: 100, queue: true });
  $("#Output").animate({ left: "+=.6vw" }, { duration: 100, queue: true });
  $("#Output").animate({ left: "-=.6vw" }, { duration: 100, queue: true });
  $("#Output").animate({ left: "+=.6vw" }, { duration: 100, queue: true });
  $("#Output").animate({ left: "-=.6vw" }, { duration: 100, queue: true });
  $("#Output").animate({ left: "+=.3vw" }, { duration: 100, queue: true });
}
//gestione cookies

function openCookieRequest() {
  $("#CookiesPopUpWindow").animate({ "top": "0.5vh" }, { duration: 750 });
  setTimeout(function () { $("#CookiesPopUp").css("top", "100vh").animate({ "top": "19.5vh" }, { duration: 750, queue: true }); }, 750);//aspetta quella di prima, poi la mette a 100vh e la fa salire (era a 200, sennò la vedevi che si abbassava)
}

function closeCookieRequest() {
  $("#CookiesPopUp").animate({ "top": "200vh" }, { duration: 750, queue: true });
  setTimeout(function () { $("#CookiesPopUpWindow").animate({ "top": "-100vh" }, { duration: 750 }); }, 750);
  //carica la history tramite i cookies o il server
  loadHistoryCookies();
}

function CookiesRequestResponse(accepted) {
  cookieEnabled = (accepted === true);//in caso accepted non sia un boolean (anche se non dovrebbe mai accadere)
  closeCookieRequest();
}

function addCookiePrivate(name, value) {//solo per cookie necessari al sito, validi per la EU Cookie Law  (usato solo per il cookie del theme, facendo una funzione si potrebbe in futuro espandere le cose nel sito)
  let temp = new Date();
  temp.setTime(temp.getTime() + 864000000); // 10 giorni
  document.cookie = name + "=" + encodeURI(value) + "; expires=" + temp.toUTCString() + "; path=/;";
}

function addCookie(value) {
  if (cookieEnabled) {
    let check = existCookieOfValue(value);
    let temp = new Date();
    temp.setTime(temp.getTime() + 86400000); // 1 giorno
    if (check !== "") {//se è "", vuol dire che non esisteva
      document.cookie = check + "=" + encodeURI(value) + "; expires=" + temp.toUTCString() + "; path=/;";
    } else {
      let uniqueName = "IDENTIFIER_" + Date.now();//ci metto la data di oggi, cosi è unico (ho bisogno di più IDENTIFIER, senno li sovrascriverebbe)
      document.cookie = uniqueName + "=" + encodeURI(value) + "; expires=" + temp.toUTCString() + "; path=/;";
    }

  }
}

function existCookieOfValue(value) {//controlla se esisteva già un cookie (qualsiasi, private o normali) con quel valore
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let temp = cookie.split("=");
    if (decodeURIComponent(temp[1]) === value) {
      return temp[0];
    }
  }
  return "";
}

function modifyCookie(name, value) {
  addCookiePrivate(name, value); // sovrascrivi il cookie vecchio
}

function getCookie(name) {//ritorna la value di un cookie dal nome
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let temp = cookie.split("=");
    if (temp[0] === name) {
      return decodeURI(temp[1]);
    }
  }
  return null;
}

function clearHistory() {
  $("#history").html("");
  document.cookie.split(";").forEach(cookie => {
    let cookieName = cookie.split("=")[0].trim();//cancella spazi se ci sono (non ci sono, ma non si sa mai)
    if (cookieName.startsWith("IDENTIFIER_"))
      document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";//data vecchia per cancellare il cookie (fatto così sul libro...)

  });
  $("#deleteHistoryButton").animate({ scale: ".95" }, { duration: 200 });
  $("#deleteHistoryButton").animate({ scale: "1" }, { duration: 200 });
}

function loadHistoryCookies() {
  if (cookieEnabled) {
    $("#history").html(""); // cancella la history

    let cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
      let temp = cookie.split("=");

      if (temp[0].startsWith("IDENTIFIER_")) { // prendi solo quelli che sono IDENTIFIER_ e non sono nulli (non si sa mai)
        $("#history").append("<p>" + decodeURI(temp[1]) + "</p>");
      }
    });
  } else {
    loadHistoryFromServer();
  }
}

async function sendDataToServer(element) {
  try {
    await fetch(`/WriteEntryToHistory?data=${encodeURI(element)}`);
  } catch (error) {
    console.error("Errore durante la scrittura al server ", error);
  }
}

async function loadHistoryFromServer() {
  try {
    const response = await fetch('/ObtainAllEntriesFromServer');//fai una richiesta ObtainDataFromFile al server
    if (!response.ok) throw new Error('Errore nel caricamento');//controllo per eventuali errori (catturato poi in caso dal try catch)

    let data = await response.text();//decodifica il messaggio in .text   (solitamente si usa json perchè è un formato più usato, ma il file dei comuni e un txt, quindi text)
    //la decodifica in .text() è anch'essa asynch, quindi si usa await per aspettare la risposta prima di continuare il codice
    $("#history").html(""); // cancella la history
    data = data.split("\n");
    data.forEach(elem => {
      $("#history").append("<p>" + decodeURI(elem) + "</p>");
    });
    //il resto del codice è uguale a quello nella versione per liveserver
  } catch (error) {
    console.error('Errore durante il caricamento del file:', error);
  }
}