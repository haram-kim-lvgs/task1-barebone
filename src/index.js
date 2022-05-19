//something here

console.log('HELLO from index.js!');

//just connect to database & be done
const path = require('path');
//use mysql2 because it comes with prepared statements and promises wrapper = https://github.com/sidorares/node-mysql2#using-prepared-statements
const mysql = require('mysql2');

//use .env file
require('dotenv').config({path: `${__dirname}/../.env`});

( async() => {
    const dbConnection = mysql.createConnection({
        host    : process.env.DB_HOST,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port    : process.env.DB_PORT
    });

    console.log('Database connection created');

    //set MYSQL Table init query
    const dbTableName = 'SpreadsheetData';
    const dbTableInitSqlQuery = `CREATE TABLE IF NOT EXISTS ${dbTableName} (id int NOT NULL AUTO_INCREMENT, cell VARCHAR(50), data TEXT, PRIMARY KEY(id))`;
    //implicitly connect & initialize MYSQL Table if it does not already exists
    dbConnection.query(dbTableInitSqlQuery, (err) => {
    if (err) throw err;
    console.log(`Database table initiated`);
    });
    
    
    //clear whatever is inside of the table now 
    const dbTableResetSqlQuery = `DELETE FROM ${dbTableName}`;
    dbConnection.query(dbTableResetSqlQuery, (err, result) => {
        if (err) throw err;
        console.log(`Reset database table = ${dbTableName}`);
        console.log(`Number of records deleted: ${result.affectedRows}`);
    });

    //insert to mysql db's table
    const dbTableInsertSqlQuery = `INSERT INTO ${dbTableName} (id, cell, data) VALUES ?`;
    dbConnection.query(dbTableInsertSqlQuery, 
        [[['1','sample1', 'sample2']]], 
            err => {
                dbConnection.end();
                if (err) throw err;
                console.log('Sample data inserted');

                console.log('BYE from index.js!');
            });

})();