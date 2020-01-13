const fs = require('fs');
const express = require('express');
const app = express();
const port =  3000;
const $ = require("jquery");
const cors = require('cors');
let {PythonShell} = require('python-shell')
const bodyparser = require("body-parser")


var classify = '../tensorflow/classify_images.py';
var pythonExecutable = "C:/Users/Tom/Anaconda3/envs/3.5/python.exe";
var pictureToVectorize = "../tensorflow/result/hier moet nog een file komen";
var clusterVectors = '../tensorflow/cluster_vectors.py';

var options = {
    pythonPath:pythonExecutable,
    args: [pictureToVectorize]
};
var options2 = {
    pythonPath:pythonExecutable
};

app.use(bodyparser.urlencoded({
    limit:'100mb',
    extended:true
}))

app.listen(port, () => console.log(`listening on port ${port}`));

app.use(cors());


// =======  UPLOAD IMAGES ========
app.post('/api/uploadImage', (req, res) =>{
// console.log("stap 1");
    let imageBody = JSON.stringify(req.body);
    let buff =  Buffer.from(imageBody);
// let base64data = buff.toString('base64');
console.log(buff);
    // console.log(imageBody);
    fs.writeFile('../../tensorflow/result/result.jpg', buff, function() {
        console.log('The file has been saved!');
        
    })
    res.send("lol")
    
})


app.post("/api/runPython",(res,req)=>{
    PythonShell.run(classify , options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        PythonShell.run(clusterVectors, options2, function (err, results) {
            if (err) throw err;
            // results is an array consisting of messages collected during execution
            console.log('results: %j', results);
        });
    });
})


