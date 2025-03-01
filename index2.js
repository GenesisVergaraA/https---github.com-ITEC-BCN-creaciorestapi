import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser";

//Creo l'objecte de l'aplicació
const app=express();
app.use(bodyParser.json())

const readData=()=>{
    try{
        const data=fs.readFileSync("./reserves.json");
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
        fs.writeFileSync("./reserves.json",JSON.stringify(data));

    }catch(error){
        console.log(error);
    }
}

//Creem un endpoint per obtenir tots els reservas
app.get("/reserves",(req,res)=>{
    const data=readData();
    res.json(data.reserves);
})
//Creem un endpoint per obtenir un reserva per un id
app.get("/reserves/:id",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);
    const reserva=data.reserves.find((reserva)=>reserva.id===id);
    res.json(reserva);
})

//Creem un endpoint del tipus post per afegir un reserva

app.post("/reserves",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newreserva={
        id:data.reserves.length+1,
        ...body,
    };
    data.reserves.push(newreserva);
    writeData(data);
    res.json(newreserva);
});

//Creem un endpoint per modificar un reserva


app.put("/reserves/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const reservaIndex = data.reserves.findIndex((reserva) => reserva.id === id);
    data.reserves[reservaIndex] = {
      ...data.reserves[reservaIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "reserva updated successfully" });
  });

//Creem un endpoint per eliminar un reserva
app.delete("/reserves/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const reservaIndex = data.reserves.findIndex((reserva) => reserva.id === id);
    //splice esborra a partir de reservaIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.reserves.splice(reservaIndex, 1);
    writeData(data);
    res.json({ message: "reserva deleted successfully" });
  });

//Funció per escoltar
app.listen(3000,()=>{
    console.log("Server listing on port 3000");
});