// import mysql
const mysql = require('mysql');
// import express
const express = require('express');
// create an app
const app = express();

// call the middlewear
app.use(express.json());

// create a connection config
let mysqlconnection = mysql.createConnection ( {
    host: "localhost",
    password: "root",
    user: "root",
    database: "CustomerDB",
    multipleStatements: true
});

// create connection
mysqlconnection.connect( () => {
    console.log("welcome")
})

// create a connection
app.get('/', (req, res) => {
    res.send("connected to my api")
});

// get all student
app.get('/customer', (req, res) => {
    mysqlconnection.query('SELECT * FROM Customerinfo',(err, rows, fields) => {
      if (err) {
        console.log("there is an error")
      } else {
        res.status(200).json({
            message: "successful",
            data: rows
        });
      }
    });
});

// get a single student
app.get('/customer/:id', (req, res) => {
    let id = req.params.id;
     mysqlconnection.query(`SELECT * FROM Customerinfo WHERE id=${id}`, (err, rows, fields) => {
        if (!err) {
            res.status(200).json({
                message: "successful",
                data: rows
            })
        } else {
            console.log(err.message)
            res.status(404).json({
                message: err.message
            });
        }
     });
})


// delete a customer
app.delete('/customer/:id', (req, res) => {
    let id = req.params.id;
    mysqlconnection.query(`DELETE FROM Customerinfo WHERE id=${id}`, (err, rows, fields) => {
        if (!err) {
            res.status(200).json({
                message: "deleted successfully"
            })
        } else{
            res.status(404).json({
                message: err.message
            });
        }
    });
})


// create a student
app.post('/customer', (req, res) => {
    let body = req.body;
    let sql = `SET @id=?; SET @nameofseller=?; SET @locationofmarket=?; SET @typesofgoods=?; SET @nameofproduct=?;
    CALL AddCustomerOrEdit(@id, @nameofseller, @locationofmarket, @typesofgoods, @nameofproduct);`;
      

    mysqlconnection.query(sql, [body.id, body.nameofseller, body.locationofmarket, body.typesofgoods, body.nameofproduct], (err, rows, fields) => {
        if(!err) {
            rows.forEach( (element) => {
                if(element.constructor == Array) {
                    res.status(200).json({
                        message: "there is no error found.",
                        data: "customer ID:" + element [0].id
                    });
                } else {
                    console.log("an error occured")
                }
            })
        } else {
            console.log(err.message)
        }
    })
    });
// connect a port
const port = 2323;
app.listen(port, ()=> {
    console.log('listen on port' + port)
});