const express = require('express'); 
const app = express();
const sql = require('mssql');

app.use(express.json());

// Start server and listen on http://localhost:1111/ by default.
// Port can be passed as first CLI argument.
const args = process.argv.slice();
const port = args[2] ? args[2] : 1111;

const isJsonBody = (req, res) => {
   if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send("Only JSON is supported!");
        return false;
   }
   return true;
};

const returnMssqlQueryResult = (sqlConfig, query, res) => {
    console.log(`sqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`);
    console.log(`Executing MSSQL query: \n"${query}"`);
    
    sql.connect(sqlConfig, () => {
        const sqlRequest = new sql.Request();
        sqlRequest.query(query, (err, recordset) => {
            if (err){
                res.status(500).send(`Database error - ${err}`);
            } 
            else{
                res.type('json');
                res.end(JSON.stringify(recordset)); // Result in JSON format
            }
        });
    });
};

// routes
app.post('/db-api/select', (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send("Only JSON is supported!");
        return false;
    }
    else{
        const { query, sqlConfig } = req.body;
        returnMssqlQueryResult(sqlConfig, query, res);
   }
});


// start server
const server = app.listen(port, () =>
    console.log(`db-api server listening at http://localhost:${port}/db-api`)
);

