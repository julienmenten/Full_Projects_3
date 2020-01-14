const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const $ = require("jquery");
const cors = require('cors');
const {
    PythonShell
} = require('python-shell')
const pyShell = new PythonShell;


const bodyparser = require("body-parser")

let classify = 'tensorflow/classify_images.py';
let pythonExecutable = "C:/Users/Tom/Anaconda3/envs/3.5/python.exe";
let pictureToVectorize = "tensorflow/result/result.jpg";
let clusterVectors = 'tensorflow/cluster_vectors.py';


let options = {
    pythonPath: pythonExecutable,
    args: [pictureToVectorize]
};
let options2 = {
    pythonPath: pythonExecutable
};

app.use(bodyparser.urlencoded({
    limit: '100mb',
    extended: true
}))
app.use(cors());


// =======  UPLOAD IMAGES ========
// =======  UPLOAD IMAGES ========

const uploadImage = async (req, res, next) => {
    try {
        let imageBody = req.body.photo;
        const path = 'tensorflow/result/result.jpg'
        data = imageBody.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path, data, {
            encoding: 'base64'
        });
        return res.send("file changed");

    } catch (e) {
        next(e);
    }
}

// =======  Make vector ========
// =======  Make vector ========
let vectorizeImage = async (req, res) => {
    // return res.send('test');
    PythonShell.run(classify, options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
      });
      PythonShell.end(function (err, code, signal) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log(err, code, signal);
      });
      
}


// =======  Compare images ========
// =======  Compare images ========
let compareImage =  (req, res) => {
    PythonShell.run(clusterVectors, options2, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
      });
      PythonShell.end(function (err, code, signal) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log(err, code, signal);
      });
      
}


app.post('/api/uploadImage', uploadImage);
app.post('/api/pythonVectorScript', vectorizeImage);
app.post('/api/pythonCompareScript', compareImage);

app.listen(port, () => console.log(`listening on port ${port}`));