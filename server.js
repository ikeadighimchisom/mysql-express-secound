// import mysql
const mysql = require('mysql');
// import express library
const express = require('express');

// create an application
const app = express();

// call a middleware
app.use(express.json())

// create a connection config
let mysqlconnection = mysql.createConnection( {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'ChisomDB',
    multipleStatements: true,
})


// connect to the database
mysqlconnection.connect( () => {
    console.log('Database connection successful');
});

// test for endpoint
app.get("/", ( req, res ) => {
    res.send("Welcome to our new express api")
});

// get all students
app.get( "/student", ( req, res ) => {
    mysqlconnection.query( 'SELECT * FROM ChisomRecords', (err, rows, field) => {
        if (err) {
            console.log(err.message)
        } else {
            res.status( 200 ).json( {
                data: rows
            })
            // res.send(
            //    rows
            //)
        }
    });
})


//get a single student from the studentBio table
//approach one 
app.get( "/student/:id", (req, res) => {
    mysqlconnection.query( 'SELECT * FROM ChisomRecords WHERE id=?', [req.params.id], (err, rows, field) => {
        if( !err ){
            res.status( 200 ).json( {
                message: "Student was retrieve sucessfully",
                data: rows
            })
        } else {
            console.log( err.message )
            res.status( 404 ).json( {
                message: err.message
            })
            
        }
    })
})

 // the second approach on how to read single file
// app.get( '/student/:id', async ( req, res) => {
//     try {
//         let id = req.params.id;
//         await mysqlconnection.query( `SELECT * FROM ChisomRecords WHERE id=${ id }`, ( err, rows, feilds) => {
//             if ( !err ) {
//                 res.status( 200 ).json( {
//                     message: "student retrive successfully",
//                     data: rows
//                 })
//             } else{
//                 console.log(err.message);
//                 res.status( 404 ).json( {
//                     message: err.message
//                 });
//             }
//         });
//     } catch (err){
//         res.status( 404 ).json({
//             message: err.message
//         });
//     }
// });



// remove a record from a database table
app.delete( '/student/:id', ( req, res ) => {
    let id = req.params.id;
    mysqlconnection.query( `DELETE FROM ChisomRecords WHERE id=${ id }`, (err, rows, fields) => {
        if ( !err ) {
            res.status( 200 ).json( {
                message: "students deleted successfully",
            })
        } else {
            res.status( 404 ).json( {
                message: err.message
                
            })
        }
    });
});

// add a new database to a table
app.post( "/student", (req, res) => {
    let student = req.body;
    let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
    CALL thecurveAddOrEdit(@id, @name, @course, @duration, @age);`;

    mysqlconnection.query(sql, [student.id, student.name, student.course, student.duration, student.age ], (err, rows, fields) => {
        if ( !err ) {
            rows.forEach( (element) => {
            if ( element.constructor == Array ) {
                res.status( 200 ).json( {
                    message: "New Student has been created.",
                    data: "Student ID:" + element[ 0 ].id
                })
            } else{
                console.log("No student found")
            }
            });
        } else {
            console.log( err.message)
        }
    });
    
});
    

// updata a new database to your table
app.put('/student', (req, res) => {
    let student = req.body;
    let sql = `SET @id=?; SET @name=?; SET @course=?; SET @duration=?; SET @age=?;
    CALL thecurveAddOrEdit(@id, @name, @course, @duration, @age);`;

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
        
// create a port
const port = 3030;
app.listen( port, () => {
    console.log( 'listening on port' + port)
});


