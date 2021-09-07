'use strict';

const axios = require('axios');

async function getapidatafav(req, res) {
    let url=`https://ltuc-asac-api.herokuapp.com/allChocolateData`
await axios.get(url).then(apidataresults => {
    let apidataresultsarr=apidataresults.data.map(item=>{
        return new Appdata(item);
    })
    res.send(apidataresultsarr);
})
}
class Appdata{
    constructor(item){
        this.src=item.imageUrl,
        this.description=item.title
    }
}
module.exports=(getapidatafav)