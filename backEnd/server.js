const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
const $ = require("jquery");
const cors = require('cors');
const osc = require("osc");
const bodyparser = require("body-parser")
const imageToVectorize = "result/result.jpg"
var request = require('request');
const {
    PythonShell
} = require('python-shell')


let classify = 'classify_images.py';
let pythonExecutable = "C:/Users/Tom/Anaconda3/envs/3.5/python.exe";
let pictureToVectorize = "result/result.jpg";
let clusterVectors = 'cluster_vectors.py';

let options = {
    pythonPath:pythonExecutable,
    args: [pictureToVectorize]
};
let options2 = {
    pythonPath:pythonExecutable
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
        const path = 'result/result.jpg'
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
        return res.send('test1');
      });
}


// =======  Compare images ========
// =======  Compare images ========
let compareImage =  (req, res) => {
    PythonShell.run(clusterVectors, options2, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        return res.send('test2');
      });

}


// =======  Get similar images ========
// =======  Get similar images ========
const getSimilarImages = async (req, res, next) => {
    // request('C:/wamp64/www/project3/backEnd/nearest_neighbors/result.json', function (error, response, body) {
    //     console.log(error)
    //   if (!error && response.statusCode == 200) {
    //     console.log(body)
    //     res.send(body);// Print the google web page.
    //   }
    // })
    res.sendFile(path.join(__dirname + "/nearest_neighbors", "result.json"))
}


app.post('/api/uploadImage', uploadImage);
app.post('/api/pythonVectorScript', vectorizeImage);
app.post('/api/pythonCompareScript', compareImage);
app.get('/api/getSimilarImages', getSimilarImages);
app.listen(port, () => console.log(`listening on port ${port}`));