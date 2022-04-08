const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const { json } = require('express')
const app = express()

app.use(express.json())
app.use(cors({
    options:['PUT'],
}))

//Establecemos los prámetros de conexión
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'personas'
})

//Conexión a la database
conexion.connect((error) =>{
    if(error){
        throw error
    }else{
        console.log("¡Conexión exitosa a la base de datos!")
    }
})
app.get('/', (req,res) =>{
    res.send('Ruta INICIO')
})

//Mostrar todos las personas
app.get('/api/personas', (req,res)=>{
    conexion.query('SELECT * FROM tPersonas', (error,filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//Mostrar una SOLA persona
app.get('/api/personas/:id', (req,res)=>{
    conexion.query('SELECT * FROM tPersonas WHERE id = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error
        }else{
            res.send(fila)
        }
    })
})

//Crear una persona
app.post('/api/personas', (req,res)=>{
    let data = {Nombre:req.body.Nombre, Direccion:req.body.Direccion, Telefono:req.body.Telefono}
    let sql = "INSERT INTO tPersonas SET ?"
    conexion.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{              
             /*Esto es lo nuevo que agregamos para el CRUD con Javascript*/
             Object.assign(data, {id: result.insertId }) //agregamos el ID al objeto data             
             res.send(data) //enviamos los valores                         
        }
    })
})

//Editar persona
app.put('/api/personas/:id', (req, res)=>{
    let id = req.params.id
    let nombre = req.body.Nombre
    let direccion = req.body.Direccion
    let telefono = req.body.Telefono
    let sql = "UPDATE tPersonas SET Nombre = ?, Direccion = ?, Telefono = ? WHERE id = ?"
    conexion.query(sql, [nombre, direccion, telefono, id], function(error, results){
        if(error){
            throw error
        }else{              
            res.send(results)
        }
    })
})

//Eliminar persona
app.delete('/api/personas/:id', (req,res)=>{
    conexion.query('DELETE FROM tPersonas WHERE id = ?', [req.params.id], function(error, filas){
        if(error){
            throw error
        }else{              
            res.send(filas)
        }
    })
})

//Escucha en el puerto que se encuentra 
const puerto = process.env.PUERTO || 3000
app.listen(puerto, () => {
    console.log("Servidor Ok en puerto:"+puerto)
})