const fs = require('fs');
const express = require('express');
const app = express();
const port =  3000;
const $ = require("jquery");
const cors = require('cors');
let {PythonShell} = require('python-shell')

var classify = '../classify_images.py';
var pythonExecutable = "C:/Users/woute/.conda/envs/TensorFlow/python.exe";
var pictureToVectorize = "../testPictures/input.jpg";
var clusterVectors = '../cluster_vectors.py';

var options = {
    pythonPath:pythonExecutable,
    args: [pictureToVectorize]
};
var options2 = {
    pythonPath:pythonExecutable
};

app.listen(port, () => console.log(`listening on port ${port}`));

app.use(cors());


// =======  UPLOAD IMAGES ========
app.post('/api/uploadImage', (req, res) =>{
    let imageBody = req.body.replace(/^data:image\/jpg;base64,/, "");
    fs.writeFile('../../tensorflow/result/result.jpg', imageBody, "base64", (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    })
    res.send('Gelukt');
})


