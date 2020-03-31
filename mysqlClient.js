'use strict';

const mysqlClient = require('mysql');

const returnMysqlQueryResult = (sqlConfig, query, res) => {   

    console.log(
        `\nmysqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`    
        + `\nquery: \n"${query}"`);
    
    try {
        const connection = mysqlClient.createConnection(sqlConfig);        
        connection.connect(err => {
            if (err) {
                console.log(err);
                res.status(500).send(`Database error - ${err}`);
                return;
            }
            connection.query(query, (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send(`Database error - ${err}`);
                    return;
                };
                res.type('json');
                res.end(JSON.stringify(result)); // Result in JSON format
            });
        });               
    }
    catch(err){
        console.log(err);
        res.status(500).send(`Error - ${err}`);        
    }    
};

const requestHandler = (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send('Only JSON is supported!');
        return false;
    }
    else{
        const { query, mysqlConfig } = req.body;
        returnMysqlQueryResult(mysqlConfig, query, res);
   }
};

module.exports = { requestHandler };
