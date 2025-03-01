import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser";

//Creo l'objecte de l'aplicació
const app=express();
app.use(bodyParser.json())

const readData=()=>{
    try{
        const data=fs.readFileSync("./usuaris.json");
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
        fs.writeFileSync("./usuaris.json",JSON.stringify(data));

    }catch(error){
        console.log(error);
    }
}

//Creem un endpoint per obtenir tots els usuaris
app.get("/usuaris",(req,res)=>{
    const data=readData();
    res.json(data.usuaris);
})
//Creem un endpoint per obtenir un usuari per un id
app.get("/usuaris/:id",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);
    const usuari=data.usuaris.find((usuari)=>usuari.id===id);
    res.json(usuari);
})

//Creem un endpoint del tipus post per afegir un usuari

app.post("/usuaris",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newusuari={
        id:data.usuaris.length+1,
        ...body,
    };
    data.usuaris.push(newusuari);
    writeData(data);
    res.json(newusuari);
});

//Creem un endpoint per modificar un usuari


app.put("/usuaris/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const usuariIndex = data.usuaris.findIndex((usuari) => usuari.id === id);
    data.usuaris[usuariIndex] = {
      ...data.usuaris[usuariIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "usuari updated successfully" });
  });

//Creem un endpoint per eliminar un usuari
app.delete("/usuaris/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const usuariIndex = data.usuaris.findIndex((usuari) => usuari.id === id);
    //splice esborra a partir de usuariIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.usuaris.splice(usuariIndex, 1);
    writeData(data);
    res.json({ message: "usuari deleted successfully" });
  });

//Funció per escoltar
app.listen(3000,()=>{
    console.log("Server listing on port 3000");
});