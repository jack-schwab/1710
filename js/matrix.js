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
        vis.margin = {top: 400, right: 150, bottom: 20, left: 200};
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 800 - vis.margin.top - vis.margin.bottom;

        vis.linearColor = d3.scaleLinear()
            .range(["lightgreen","darkgreen"]);

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.initData()
        let maxCount = d3.max(vis.displayData, d => d3.max(d.counts));
        vis.linearColor.domain([0, maxCount]);

        vis.cellHeight = 50, vis.cellWidth = 50, vis.cellPadding = 20;
        for (let i = 0; i <vis.numCountries; i++) {
            let svgrow = vis.svg.append("g")
                .attr("class", "matrixrow")
                .attr("transform", `translate(0, ${(vis.cellWidth + vis.cellPadding) * i})`)
                .attr("id", "row" + i);

            let squarePath = svgrow.selectAll(".square-path")
                .data(vis.displayData[i].counts);

            squarePath.enter().append("path")
                .attr("class", "square-path")
                .attr("d", function (d, index) {
                    let x = (vis.cellWidth + vis.cellPadding) * index;
                    let y = 0;
                    return 'M ' + x + ' ' + y + ' l ' + vis.cellWidth + ' 0 l 0 ' + vis.cellHeight + ' l ' + -vis.cellWidth + ' 0 ' + ' z';
                })
                .attr("fill", d => {
                    if (d === 0) {
                        return "#D3D3D3";  // Light gray for zero values
                    } else {
                        return vis.linearColor(d);  // Color scale for non-zero values
                    }
                });

            svgrow.append("text")
                .attr("x", -10)
                .attr("y", vis.cellHeight - 5)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .text(vis.displayData[i].name);

            vis.svg.append("text")
                .text(vis.displayData[i].name)
                .attr("transform", "rotate(-90) translate(10," + ((vis.cellWidth + vis.cellPadding) * i + vis.cellWidth * 0.75) + ")");
        }

        vis.addLegend(maxCount);
        vis.addMatrixExplanation();
    }

    addLegend(maxCount) {
        let vis = this;

        // Create legend group
        let legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${vis.width + 20}, 0)`);

        // Add gradient definition
        let defs = legend.append("defs");
        let gradient = defs.append("linearGradient")
            .attr("id", "color-gradient")
            .attr("y1", "0%")
            .attr("y2", "100%");

        gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "darkgreen");

        gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "lightgreen");

        // Add gradient rectangle
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 150)
            .style("fill", "url(#color-gradient)");

        // Add scale to gradient
        let scale = d3.scaleLinear()
            .domain([maxCount, 0])
            .range([0, 150]);

        let axis = d3.axisRight(scale)
            .ticks(5);

        legend.append("g")
            .attr("transform", "translate(20,0)")
            .call(axis);

        // Add legend title
        legend.append("text")
            .attr("x", -10)
            .attr("y", -10)
            .style("text-anchor", "start")
            .style("font-weight", "bold")
            .text("Number of Trades");

        // Add zero value indicator
        legend.append("rect")
            .attr("x", 0)
            .attr("y", 170)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "#D3D3D3");

        legend.append("text")
            .attr("x", 25)
            .attr("y", 185)
            .text("No trade");
    }

    addMatrixExplanation() {
        let vis = this;

        // Add title
        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", -vis.margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("African Wildlife Trade Matrix");

        // Add explanation
        let explanation = vis.svg.append("g")
            .attr("transform", `translate(0, ${-vis.margin.top / 2 + 30})`);

        let explanationText = [
            "• Rows: Exporting countries",
            "• Columns: Importing countries",
            "• Color intensity shows number of trades",
            "• Gray squares indicate no recorded trade"
        ];

        explanationText.forEach((text, i) => {
            explanation.append("text")
                .attr("x", 0)
                .attr("y", i * 20)
                .style("font-size", "12px")
                .text(text);
        });
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
        }
    }

    wrangleData(){
        let vis = this;
        let selectedValue = document.getElementById("sortSelector").value;
        vis.displayData = vis.displayData.sort((a,b)=>{
            return a[selectedValue] - b[selectedValue];
        })
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