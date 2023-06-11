const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;

let data;

try{
    data = require("./data.json");
}

catch(error){
   console.log("can't reach the data"); 
}

app.use(cors());

app.get('/data', (req, res) => {
    res.json(data);
})

app.get('/', (req, res) => {
    const jsonLines = JSON.stringify(data, null, 2).split('\n');
    res.send(jsonLines.join('<br>'));
  });

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});