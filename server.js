const express = require('express'); 
const app = express();
const sql = require('mssql');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());

// Start server and listen on http://localhost:1111/ by default.
// Port can be passed as first CLI argument.
const args = process.argv.slice();
const port = args[2] ? args[2] : 1111;

const returnMssqlQueryResult = async (sqlConfig, query, res) => {

    const { user, password, server, database } = sqlConfig;
    const connectionString = `mssql://${user}:${password}@${server}/${database}`;

    console.log(`sqlConfig: ${JSON.stringify(sqlConfig, null, 2)}`);
    console.log(`connectionString: ${connectionString}`);
    console.log(`Executing MSSQL query: \n"${query}"`);
    
    try {
        await sql.connect(connectionString);
        
        result = await sql.query(query)   
        
        res.type('json');
        res.end(JSON.stringify(result)); // Result in JSON format
       s
    }
    catch(err){
        res.status(500).send(`Database error - ${err}`);
    }
    finally{
        await sql.close();
    }
};

// routes
app.post('/db-api/mssql', (req, res) => {
    if (req.headers['content-type'] != 'application/json'){ 
        res.status(500).send('Only JSON is supported!');
        return false;
    }
    else{
        const { query, sqlConfig } = req.body;
        returnMssqlQueryResult(sqlConfig, query, res);
   }
});

app.post('/db-api/query', (req, res) => {
    if (req.headers['content-type'] != 'text/plain'){ 
        res.status(500).send('Only TEXT is supported!');
        return false;
    }
    else{
        res.send(req.body);
   }
});


// start server
const server = app.listen(port, () =>
    console.log(`db-api server listening at http://localhost:${port}/db-api`)
);

