const africanCountryCodeToName = {
    AO: "Angola",
    BI: "Burundi",
    BJ: "Benin",
    BF: "Burkina Faso",
    BW: "Botswana",
    CF: "Central African Rep.",
    CI: "Côte d'Ivoire",
    CM: "Cameroon",
    CD: "Dem. Rep. Congo",
    CG: "Congo",
    DJ: "Djibouti",
    DZ: "Algeria",
    EG: "Egypt",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GH: "Ghana",
    GN: "Guinea",
    GM: "Gambia",
    GW: "Guinea-Bissau",
    GQ: "Eq. Guinea",
    KE: "Kenya",
    LR: "Liberia",
    LY: "Libya",
    LS: "Lesotho",
    MA: "Morocco",
    MG: "Madagascar",
    ML: "Mali",
    MZ: "Mozambique",
    MR: "Mauritania",
    MW: "Malawi",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    RW: "Rwanda",
    EH: "W. Sahara",
    SD: "Sudan",
    SS: "S. Sudan",
    SN: "Senegal",
    SL: "Sierra Leone",
    SO: "Somalia",
    SZ: "Swaziland",
    TD: "Chad",
    TG: "Togo",
    TN: "Tunisia",
    TZ: "Tanzania",
    UG: "Uganda",
    ZA: "South Africa",
    ZM: "Zambia",
    ZW: "Zimbabwe"
};

class MatrixVis {

    constructor(parentElement, animalData){
        this.parentElement = parentElement;
        this.animalData = animalData;
        this.initVis()

    }

    initVis(){
        let vis = this;
        vis.margin = {top: 20, right: 20, bottom: 20, left: 40};
        vis.width = 400 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;
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

        let cellHeight = 20, cellWidth = 20, cellPadding = 10;
        for (let i = 0; i <vis.numCountries; i++){
            let svgrow = vis.svg.append("g")
                .attr("class", "matrixrow")
                .attr("transform", `translate(0, ${(cellWidth + cellPadding)*i})`)
                .attr("id", "row" + i);
            //might have id overlap
            // D3's enter, update, exit pattern
            let squarePath = svgrow.selectAll(".square-path")
                .data(vis.displayData[i]);
            console.log(squarePath);
            squarePath.enter().append("path")
                .attr("class", "square-path");
            console.log("bo")
            squarePath.attr("d", function(d, index) {
                // Shift the squares on the x-axis (columns)
                console.log("shen")
                let x = (cellWidth + cellPadding) * index;

                // All triangles of the same row have the same y-coordinates
                // Vertical shifting is already done by transforming the group elements
                let y = 0;
                console.log("bo")
                return 'M ' + x +' '+ y + ' L ' + cellWidth + ' 0 L 0 ' + cellHeight + ' L ' + -cellWiddth + ' 0 ' + ' z';
            })
                .attr("fill", "grey");
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
                "totalCount": d3.sum(vis.importExportCountMatrix[i])
            }
            vis.displayData.push(row);
        }
        console.log(vis.displayData)
    }
    //Draw the matrix rows: assign a class (e.g. .matrix-row), append a svg group element per row,
    // translate its height, and append a text field (basically the y-axis label of that row).
    // You should now see a column of labels showing numbers from 0 -15.
    //Draw all matrix elements: Assign classes (e.g., matrix-cell, matrix-cell-marriage), draw a small rectangle,
    // and set its color depending on the data properties (matrix value 0 or 1)

    updateVis(){


    }

    wrangleData(){

    }
}