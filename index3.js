import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser";

//Creo l'objecte de l'aplicació
const app=express();
app.use(bodyParser.json())

const readData=()=>{
    try{
        const data=fs.readFileSync("./recursos.json");
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
        fs.writeFileSync("./recursos.json",JSON.stringify(data));

    }catch(error){
        console.log(error);
    }
}

//Creem un endpoint per obtenir tots els recurss
app.get("/recursos",(req,res)=>{
    const data=readData();
    res.json(data.recursos);
})
//Creem un endpoint per obtenir un recurs per un id
app.get("/recursos/:id",(req,res)=>{
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);
    const recurs=data.recursos.find((recurs)=>recurs.id===id);
    res.json(recurs);
})

//Creem un endpoint del tipus post per afegir un recurs

app.post("/recursos",(req,res)=>{
    const data=readData();
    const body=req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newrecurs={
        id:data.recursos.length+1,
        ...body,
    };
    data.recursos.push(newrecurs);
    writeData(data);
    res.json(newrecurs);
});

//Creem un endpoint per modificar un recurs


app.put("/recursos/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const recursIndex = data.recursos.findIndex((recurs) => recurs.id === id);
    data.recursos[recursIndex] = {
      ...data.recursos[recursIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: "recurs updated successfully" });
  });

//Creem un endpoint per eliminar un recurs
app.delete("/recursos/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const recursIndex = data.recursos.findIndex((recurs) => recurs.id === id);
    //splice esborra a partir de recursIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.recursos.splice(recursIndex, 1);
    writeData(data);
    res.json({ message: "recurs deleted successfully" });
  });

//Funció per escoltar
app.listen(3000,()=>{
    console.log("Server listing on port 3000");
});