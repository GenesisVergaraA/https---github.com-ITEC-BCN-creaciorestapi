import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser";

//Creo l'objecte de l'aplicació
const app=express();
app.use(bodyParser.json())

const readData=()=>{
    try{
        const data=fs.readFileSync("./notificacions.json");
        //console.log(data);
        //console.log(JSON.parse(data));
        return JSON.parse(data)

    }catch(error){
        console.log(error);
    }
};
//Funció per escriure informació
const writeData=(data)=>{
    try{
        fs.writeFileSync("./notificacions.json",JSON.stringify(data));

    }catch(error){
        console.log(error);
    }
}

//Creem un endpoint per obtenir tots els notificacions
app.get("/notificacions",(req,res)=>{
    const data=readData();
    res.json(data.notificacions);
})
//Creem un endpoint per obtenir un notificacio per un id
app.get("/notificacions/:id",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);
    const notificacio=data.notificacions.find((notificacio)=>notificacio.id===id);
    res.json(notificacio);
})

//Creem un endpoint del tipus post per afegir un notificacio

app.post("/notificacions",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newnotificacio={
        id:data.notificacions.length+1,
        ...body,
    };
    data.notificacions.push(newnotificacio);
    writeData(data);
    res.json(newnotificacio);
});

//Creem un endpoint per modificar un notificacio


app.put("/notificacions/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const notificacioIndex = data.notificacions.findIndex((notificacio) => notificacio.id === id);
    data.notificacions[notificacioIndex] = {
      ...data.notificacions[notificacioIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "notificacio updated successfully" });
  });

//Creem un endpoint per eliminar un notificacio
app.delete("/notificacions/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const notificacioIndex = data.notificacions.findIndex((notificacio) => notificacio.id === id);
    //splice esborra a partir de notificacioIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.notificacions.splice(notificacioIndex, 1);
    writeData(data);
    res.json({ message: "notificacio deleted successfully" });
  });

//Funció per escoltar
app.listen(3000,()=>{
    console.log("Server listing on port 3000");
});