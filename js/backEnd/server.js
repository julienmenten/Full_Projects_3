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
// =======  UPLOAD IMAGES ========
const uploadImage = async (req, res, next) => {
    try {
        let imageBody = req.body.photo;
        const path = '../../tensorflow/result/result.jpg'
        data = imageBody.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path, data, {
            encoding: 'base64'
        });
        return res.send("File changed");
    } catch (e) {
        next(e);
    }
}
app.post('/api/uploadImage', uploadImage);


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


