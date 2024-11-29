let promises = [
    d3.json("data/africa.json"), // Load TopoJSON for map
    d3.csv("data/rhino.csv")
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data);
    })
    .catch(function (err) {
        console.log(err);
    });


function initMainPage(data){
    let myMap = new AfricanMapVis("map", data[0], data[1])
}

