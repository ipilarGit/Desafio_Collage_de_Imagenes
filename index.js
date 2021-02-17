const express = require("express");
const app = express();
const fs = require("fs");
const expressFileUpload = require("express-fileupload");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/imgs", express.static(__dirname + "/public/imgs"));
app.listen(3000, () => {
    console.log("Server ON");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/formulario.html");
});

app.use(
    expressFileUpload({
        limits: { fileSize: 5000000 },
        abortOnLimit: true,
        responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
    })
);

app.post("/imagen", (req, res) => {
    const { target_file } = req.files;
    const { posicion } = req.body;
    const name = `imagen-${posicion}`;
    target_file.mv(`${__dirname}/public/imgs/${name}.jpg`, (err) => {
        /*       err
                  ?
                  res.statusCode(500).send({ error: err })  
        : */
        res.sendFile(__dirname + "/public/collage.html");
    });
});

app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        if (err) {
            res.send("Lo siento, este archivo no existe en el servidorr");
        } else {
            res.sendFile(__dirname + "/public/collage.html");
        }
    });
});