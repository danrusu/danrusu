'use strict';

const { Pool } = require('pg');


const returnQueryResult = async (sqlConfig, query, res) => {   

    console.log(
        `\npostgresqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`    
        + `\nquery: \n"${query}"`);
    
    var client;
    try {
        const pool = new Pool(sqlConfig);  
        postgresClient = await pool.connect()
        
        const result = await postgresClient.query(query);
        
        res.type('json');
        res.end(JSON.stringify(result));        
    }
    catch(err){
        console.log(err);
        res.status(500).send(`Database error - ${err}`);
    }
    finally{
        if (client) client.release()
    }
};

const requestHandler = (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send('Only JSON is supported!');
        return false;
    }
    else{
        const { query, postgresConfig } = req.body;
        returnQueryResult(postgresConfig, query, res);
   }
};

module.exports = { requestHandler };
