'use strict';

const mssqlClient = require('mssql');

const returnMssqlQueryResult = async (sqlConfig, query, res) => {   

    console.log(
        `\nmssqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`    
        + `\nquery: \n"${query}"`);
    
    try {
        await mssqlClient.connect(sqlConfig);        
        const result = await mssqlClient.query(query);
        
        res.type('json');
        res.end(JSON.stringify(result)); // Result in JSON format
    }
    catch(err){
        console.log(err);
        res.status(500).send(`Database error - ${err}`);
    }
    finally{
        await mssqlClient.close();
    }
};

const requestHandler = (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send('Only JSON is supported!');
        return false;
    }
    else{
        const { query, mssqlConfig } = req.body;
        returnMssqlQueryResult(mssqlConfig, query, res);
   }
};

module.exports = { requestHandler };
