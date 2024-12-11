// const africanCountryCodeToName = {
//     AO: "Angola",
//     BI: "Burundi",
//     BJ: "Benin",
//     BF: "Burkina Faso",
//     BW: "Botswana",
//     CF: "Central African Rep.",
//     CI: "Côte d'Ivoire",
//     CM: "Cameroon",
//     CD: "Dem. Rep. Congo",
//     CG: "Congo",
//     DJ: "Djibouti",
//     DZ: "Algeria",
//     EG: "Egypt",
//     ER: "Eritrea",
//     ET: "Ethiopia",
//     GA: "Gabon",
//     GH: "Ghana",
//     GN: "Guinea",
//     GM: "Gambia",
//     GW: "Guinea-Bissau",
//     GQ: "Eq. Guinea",
//     KE: "Kenya",
//     LR: "Liberia",
//     LY: "Libya",
//     LS: "Lesotho",
//     MA: "Morocco",
//     MG: "Madagascar",
//     ML: "Mali",
//     MZ: "Mozambique",
//     MR: "Mauritania",
//     MW: "Malawi",
//     NA: "Namibia",
//     NE: "Niger",
//     NG: "Nigeria",
//     RW: "Rwanda",
//     EH: "W. Sahara",
//     SD: "Sudan",
//     SS: "S. Sudan",
//     SN: "Senegal",
//     SL: "Sierra Leone",
//     SO: "Somalia",
//     SZ: "Swaziland",
//     TD: "Chad",
//     TG: "Togo",
//     TN: "Tunisia",
//     TZ: "Tanzania",
//     UG: "Uganda",
//     ZA: "South Africa",
//     ZM: "Zambia",
//     ZW: "Zimbabwe"
// };
//assuming this exists elsewhere

class MatrixVis {

    constructor(parentElement, animalData){
        this.parentElement = parentElement;
        this.animalData = animalData;
        this.initVis()
    }

    initVis(){
        let vis = this;
        vis.margin = {top: 200, right: 20, bottom: 20, left: 200};
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.linearColor = d3.scaleLinear()
            .range(["lightgreen","darkgreen"]);
        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);
        vis.initData()

        vis.cellHeight = 50, vis.cellWidth = 50, vis.cellPadding = 20;
        for (let i = 0; i <vis.numCountries; i++) {
            let svgrow = vis.svg.append("g")
                .attr("class", "matrixrow")
                .attr("transform", `translate(0, ${(vis.cellWidth + vis.cellPadding) * i})`)
                .attr("id", "row" + i);
            //might have id overlap
            // D3's enter, update, exit pattern
            let squarePath = svgrow.selectAll(".square-path")
                .data(vis.displayData[i].counts);
            console.log(squarePath);
            let maxCount = d3.max(vis.displayData, d => d3.max(d.counts));
            vis.linearColor.domain([0, maxCount]);
            squarePath.enter().append("path")
                .attr("class", "square-path")
                .attr("d", function (d, index) {
                // Shift the squares on the x-axis (columns)
                console.log(d)
                console.log(index)
                let x = (vis.cellWidth + vis.cellPadding) * index;
                // Vertical shifting is already done by transforming the group elements
                let y = 0;
                //return 'M ' + x +' '+ y + ' l ' + vis.cellWidth + ' 0 l 0 ' + vis.cellHeight + ' z';
                return 'M ' + x + ' ' + y + ' l ' + vis.cellWidth + ' 0 l 0 ' + vis.cellHeight + ' l ' + -vis.cellWidth + ' 0 ' + ' z';
            })
                .attr("fill", d => {
                    if (d === 0) {
                        return "#D3D3D3";  // Light gray for zero values
                    } else {
                        return vis.linearColor(d);  // Color scale for non-zero values
                    }
                })
           
            svgrow.append("text")
                .attr("x", -10)
                .attr("y", vis.cellHeight - 5)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text(vis.displayData[i].name);
            vis.svg.append("text")
                // .attr("x", 0)
                // .attr("y", - attr("fill", "black")
                .text(vis.displayData[i].name)
                .attr("transform", "rotate(-90) translate(10," + ((vis.cellWidth + vis.cellPadding) * i + vis.cellWidth * 0.75) + ")")
        }
    }

    initData() {
        let vis = this;
        vis.displayData = [];
        let uniqueExporters = new Set(vis.animalData.map(d => {
            return d.Exporter
        }))
        let uniqueImporters = new Set(vis.animalData.map(d => {
            return d.Importer
        }))
        vis.uniqueCountries = [...uniqueExporters.union(uniqueImporters)]
        vis.numCountries = vis.uniqueCountries.length
        vis.countryCodeToId = {}
        for (let i = 0; i < vis.numCountries; i++) {
            vis.countryCodeToId[vis.uniqueCountries[i]] = i;
        }
        vis.importExportCountMatrix = Array(vis.numCountries).fill().map(() => Array(vis.numCountries).fill(0))
        for (let i = 0; i < vis.animalData.length; i++) {
            let exporter = vis.animalData[i].Exporter
            let importer = vis.animalData[i].Importer
            let exporterId = vis.countryCodeToId[exporter]
            let importerId = vis.countryCodeToId[importer]
            vis.importExportCountMatrix[exporterId][importerId]++;
        }
        for (let i = 0; i < vis.numCountries; i++) {
            let row = {
                "index": i,
                "name": africanCountryCodeToName[vis.uniqueCountries[i]],
                "totalCount": d3.sum(vis.importExportCountMatrix[i]),
                "counts": vis.importExportCountMatrix[i]
            }
            vis.displayData.push(row);
        }
        console.log(vis.displayData)
    }

    updateVis(){
        let vis = this;
        for(let i =0; i < vis.numCountries; i++){
            let rowNumber = vis.displayData[i].index
            let svgrow = d3.select("#row" + rowNumber)
                .transition()
                .duration(1000)
                .ease(d3.easeBounceOut)
                .attr("transform", `translate(0, ${(vis.cellWidth + vis.cellPadding)*i})`);
            console.log("hi")
        }
    }

    wrangleData(){
        let vis = this;
        let selectedValue = document.getElementById("sortSelector").value;
        console.log(selectedValue);
        vis.displayData = vis.displayData.sort((a,b)=>{
            return a[selectedValue] - b[selectedValue];
        })
        console.log(vis.displayData);
        vis.updateVis();
    }
}

// init global variables, switches, helper functions
let myMatrixVis;

// load data using promises
let twentyYearPromises = [
    d3.csv("data/20-year-data.csv").then(data => {
        return data;
    })
        .catch(error => {
            console.error("Error loading CSV:", error);
            throw error;
        })
];

Promise.all(twentyYearPromises)
    .then(function(data){
        initMatrixPage(data);
    })
    .catch(function(err){
        console.error("Error in Promise.all:", err);
    });

function initMatrixPage(allDataArray) {
    myMatrixVis = new MatrixVis('importExportMatrix', allDataArray[0]);
}

