// // import the mysql
// const mysql = require('mysql');
// // import the express
// const express = require('express');
// // create an application 
// const app = express();
// // call the middleware
// app.use(express.json());
// // create an connection config
// let mysqlconnection = mysql.createConnection( { 
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'ChisomDB',
//     multipleStatements: true,
//  } )

//  // connect to database
//  mysqlconnection.connect( () => {
//     console.log('connect successfully')
//  })

//  // text for endpoint
//  app.get("/", (req, res) => {
//      res.send('Welcome to my express api')
//  });

//  // get all students
//  app.get('/student', (req, res) => {
//     mysqlconnection.query('SELECT * FROM ChisomRecords', (err, rows, feild) => {
//         if(err){
//             console.log(err.message)
//         }else{
//            res.send( 
//                rows
//           )
//         }
//     });
//  })

//  // create a port
//  port = 3031;
//  app.listen( port, () => {
//     console.log('listening on port' + port )
//  });

// import mysql
const mysql = require('mysql');
// import express
const express = require('express');
// create an app
const app = express();
// call the middleware
app.use(express.json());
// create a connection config
let mysqlconnection = mysql.createConnection({
    host: "localhost",
    password: "root",
    user: "root",
    database: "ChisomDB",
    multipleStatements: true
});

// create a connection
mysqlconnection.connect( ()=> {
    console.log("WELCOME")
});

// test for endpoint
app.get('/', (req, res) => {
    res.send("my new api")
});
// get all student
app.get('/student', (req, res) => {
    mysqlconnection.query('SELECT * FROM ChisomRecords', (err, rows, field) => {
        if (err){
            console.log(err.message)
        } else{
            res.status(200).json({
                Message: "no error",
                data: rows
            });
        }
    });
});

// get a single student
app.get('/student/:id', (req, res) => {
    let id = req.params.id;
    mysqlconnection.query(`SELECT * FROM ChisomRecords WHERE id=${id}`, (err, rows, field) => {
        if (!err) {
            res.status(200).json({
                message: "successful",
                data: rows
            })
        } else{
            console.log("no err")
            res.status(404).json({
                message: err.message
            });
        }
    });
});

// delete a student
app.delete('/student/:id', (req, res) => {
    let id = req.params.id;
    mysqlconnection.query(`DELETE FROM ChisomRecords WHERE id=${id}`, (err, rows, field) => {
        if (!err) {
            res.status(200).json({
                message: "sucessful",
            })
        } else {
            console.log("no err")
            res.status(404).json({
            });
        }
    });
});

// create a student
app.post('/student', (req, res) => {
    let student = req.body;
    let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
    CALL theChisomAddOrEdit(@id, @name, @course, @duration, @age);`;
    mysqlconnection.query(sql, [student.id, student.name, student.course, student.duration, student.age], (err, rows, field) => {
        if (!err) {
            rows.forEach( (element) => {
                if(element.constructor == Array) {
                    res.status(200).json({
                        message: "finish",
                        data: "student ID:" + element [0].id
                    });
                } else { 
                    console.log("no err")
                }
            })
        } else {
            console.log(err.message)
        }
    });
});

app.put('/student', (req, res) => {
    let student = req.body;
    let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
    CALL theChisomAddOrEdit(@id, @name, @course, @duration, @age);`;

    mysqlconnection.query(sql, [student.id, student.name, student.course, student.duration, student.age], (err, rows, feild) => {
        if (!err) {
            res.status(200).json({
                message: "successfully upadated.",
                data: rows
            });
        } else{
            console.log(err.message)
        }
    });
});
const port = 3434;
app.listen(port, () => {
    console.log('listening on port' + port)
});


