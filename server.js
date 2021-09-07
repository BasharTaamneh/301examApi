'use strict';
const express = require('express');
const cors = require('cors');
const server = express();
server.use(cors());
server.use(express.json());
require('dotenv').config();
const PORT = process.env.PORT


const getapidatafav = require('./ApiData');
server.get('/getapidata', getapidatafav)


const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const favoriteSchema = new Schema({
    src: 'string',
    description: 'string',
    email: 'string'
})
const favoritedatamodule = mongoose.model("MyFav", favoriteSchema);
mongoose.connect(`${process.env.ATLAS}`, { useNewUrlParser: true });


server.post('/addFav', AddtoFav)
async function AddtoFav(req, res) {
    let { email, description, src } = req.body;
    favoritedatamodule.create({ email, description, src })
        .then(function (Favdata) {
            console.log(Favdata);
        })
        .catch(function (err) {
            console.log(err);
        });
}


server.get('/getFav', getFavdata)
async function getFavdata(req, res) {
    let useremail = req.query.useremail
    // console.log(useremail);
    favoritedatamodule.find({ email: useremail }, function (err, data) {
        if (err) { console.log(err.message); }
        else {
            res.send(data);
        }
    })
}

server.delete('/deleteFav/:itemid', deletfav)
async function deletfav(req, res) {
    let itemid = req.params.itemid;
    let useremail = req.query.useremail;
    // console.log('aa',useremail);
    // console.log('bb',itemid);
    favoritedatamodule.deleteOne({ _id: itemid, email: useremail }, function (err, data) {
        if (err) { console.log(err.message) }
        else {
            favoritedatamodule.find({ email: useremail }, function (err, data) {
                if (err) { console.log(err.message); }
                else {
                    res.send(data);
                }
            })
        }
    });
}


server.put('/updateFav/:itemid',updateFavdata);
async function updateFavdata(req, res) {
    let itemid = req.params.itemid;
    let useremail = req.query.useremail;
    let {src, description}=req.body;
    //   console.log('aa',useremail);
    // console.log('bb',itemid);
    // console.log('cc',req.body);
    favoritedatamodule.findByIdAndUpdate(itemid, {src, description},function(err,data){
        if (err) { console.log(err.message) }
        else{
            favoritedatamodule.find({ email: useremail }, function (err, data) {
                if (err) { console.log(err.message); }
                else {
                    res.send(data);
                }
            }) 
        }
    })
}

server.get('/', (req, res) => {
    res.send('routing');
});
server.get('/test', (req, res) => {
    res.send('all good');
});
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})