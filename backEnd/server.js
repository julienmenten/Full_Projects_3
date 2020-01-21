/*
    * Writed by
    * (c) 2020 
    * Toon, Wouter, Julien, Tom, Andres
    * NODE: https://code.jquery.com/jquery-3.4.1.min.js
    * express: https://www.npmjs.com/package/express
    * python-shell : https://www.npmjs.com/package/python-shell
    * bodyparser : https://www.npmjs.com/package/body-parser
    * cors : https://www.npmjs.com/package/cors
*/

// ========= CONSTANTS ========== //
// ========= CONSTANTS ========== //
const CLOUDINARY_URL ='https://api.cloudinary.com/v1_1/jamesensor/upload';
const CLOUDINARY_UPLOAD_PRESET = 'goc3a4ka';





const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const path = require("path");
const cors = require('cors');
const bodyparser = require("body-parser");
const {
    PythonShell
} = require('python-shell');

// ========= PYTHON OPTIONS ========== //
// ========= PYTHON OPTIONS ========== //
let classify = 'classify_images.py';
let pythonExecutable = "C:/Users/Tom/Anaconda3/envs/3.5/python.exe";
let pictureToVectorize = "artworks/result.jpg";
let clusterVectors = 'cluster_vectors.py';

let options = {
    pythonPath:pythonExecutable,
    args: [pictureToVectorize]
};
let options2 = {
    pythonPath:pythonExecutable
};
// ========= MIDDLEWARE ========== //
// ========= MIDDLEWARE ========== //
app.use(bodyparser.urlencoded({
    limit: '100mb',
    extended: true
}))
// ========= CORS ========== //
// ========= CORS ========== //
app.use(cors());


// =======  UPLOAD IMAGES ========
// =======  UPLOAD IMAGES ========

const uploadImage = async (req, res, next) => {
    try {
        let imageBody = req.body.photo;
        const path = 'artworks/result.jpg'
        data = imageBody.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path, data, {
            encoding: 'base64'
        });
        return res.send("file changed");

    } catch (e) {
        next(e);
    }
}


// ========= MAKE VECTORS OUT OF IMAGE ========== //
// ========= MAKE VECTORS OUT OF IMAGE ========== //
let vectorizeImage = async (req, res) => {
    // return res.send('test');
    PythonShell.run(classify, options, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        return res.send('test1');
      });
}


// ========= COMPARE PAINTING WITH EACHOTHER ========== //
// ========= COMPARE PAINTING WITH EACHOTHER ========== //
let compareImage =  (req, res) => {
    PythonShell.run(clusterVectors, options2, function (err, results) {
        if (err) throw err;
        // results is an array consisting of messages collected during execution
        console.log('results: %j', results);
        return res.send('test2');
      });

}


// ========= GET SIMILAR IMAGE FROM COMPARISON ========== //
// ========= GET SIMILAR IMAGE FROM COMPARISON ========== //
const getSimilarImages = async (req, res, next) => {
    
    res.sendFile(path.join(__dirname + "/nearest_neighbors", "result.json"))
}

const getJsonOfPainting = (req,res)=>{
    res.sendFile(path.join(__dirname , "kunstwerken.json"));
}

const getLabels = (req,res)=>{
    res.sendFile(path.join(__dirname , "image_to_labels.json"));
}


// const makeQR = (req,res)=> {
    
//         var file = req.body.qr;
//         var formData = new FormData();
//         formData.append('file', file);
//         formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
//         axios({
//             url: CLOUDINARY_URL,
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             data: formData
//         }).then(function(res){
//             console.log(res);
    
//             qrcode.makeCode(res.data.secure_url);      
    
//         }).catch(function(err){
//             console.error(err)
//         });
//         res.send("gelukt");
    
// }


// ========= PATHS ========== //
// ========= PATHS ========== //
// app.post("/api/makeQR",makeQR);
app.post('/api/uploadImage', uploadImage);
app.post('/api/pythonVectorScript', vectorizeImage);
app.post('/api/pythonCompareScript', compareImage);
app.get('/api/getSimilarImages', getSimilarImages);
app.get('/api/getJsonOfPainting', getJsonOfPainting);
app.get('/api/getLabels', getLabels);
// ========= PORT DECLARATION + SERVE ========== //
// ========= PORT DECLARATION + SERVE ========== //
app.listen(port, () => console.log(`listening on port ${port}`));