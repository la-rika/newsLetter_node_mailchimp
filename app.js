//"importo" i moduli che mi servono
const client = require('@mailchimp/mailchimp_marketing');
const express = require('express');
const path = require('node:path');

//utilizzo ecxpress sulla costante app per poter usare il server locale
const app = (express());

//prendo i dati dal file json
//il file json e' dentro git ignore cosi non metto la api key su git e non la disattivano
const apiConfig = require("./apiConfig.json")

//inizializzo express per mandare i dati ottenuti dal form in formato json alla chiamata
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rendo accessibili a express tutti i file presenti nella cartella public
app.use(express.static(path.join(__dirname, 'public')));

//rendo accessibili a express tutti i file presenti nella cartella images
app.use(express.static(path.join(__dirname, 'images')));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
    //configurazione del server mailchimp per fare le chiamate api
    ///l aconfigurazione e' dentro al file json apiConfig
    client.setConfig(apiConfig);

    try {
        //settaggio della chiamata +  ottenimento dei dati dal form html
        const memberAdd = async () => {

            const newMember = {
                email_address: req.body.email,
                status: "subscribed",
                fname: req.body.fname,
                lname: req.body.lname,
            }

            //chiamata post 
            const response = await client.lists.addListMember("9a26bfbc50", //id della lista in cui voglio aggiungere le persone
                {
                    //dati della persona che voglio aggiungere ai contatti
                    email_address: newMember.email_address,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: newMember.fname,
                        LNAME: newMember.lname,
                    },
                },
                {
                    //con questo a true i dati vengono accettati anche senza merge_fields
                    skipMergeValidation: false
                }
            );
            console.log(response)
            //se tutto va  abuon fine visualizzo success.html
            res.sendFile(__dirname + "/success.html");
        };
        memberAdd() //richiamo la funzione che aggiunge effettivamente la persona alla lista
    } catch (error) {
        console.log(error);
        //se c'e' qualche errore visualizzo failure.html
        res.sendFile(__dirname + "/failure.html")
    }
})

//Decido su che porta far avviare il server e cosa far succedere una volta che e' partito
app.listen(3000, () => console.log('server is working properly!'))