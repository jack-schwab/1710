class MatrixVis {
    constructor(parentElement, animalData){
        this.parentElement = parentElement;
        this.animalData = animalData;

        // Remove any existing tooltips
        d3.select("#matrixTooltip").remove();

        // Create tooltip with specific styles
        this.tooltip = d3.select("body")
            .append("div")
            .attr("id", "matrixTooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "2px solid #333")
            .style("border-radius", "6px")
            .style("padding", "12px")
            .style("font-family", "Kanit, Arial, sans-serif")
            .style("font-size", "14px")
            .style("box-shadow", "3px 3px 10px rgba(0,0,0,0.2)")
            .style("z-index", "1000");

        this.initVis();
    }

    initVis(){
        let vis = this;
        vis.margin = {top: 150, right: 250, bottom: 50, left: 350};
        vis.width = 1200 - vis.margin.left - vis.margin.right;
        vis.height = 1200 - vis.margin.top - vis.margin.bottom;

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

        vis.cellHeight = 65;
        vis.cellWidth = 65;
        vis.cellPadding = 30;

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
                        return "#D3D3D3";
                    } else {
                        return vis.linearColor(d);
                    }
                })
                .on("mouseover", function(event, d) {
                    let rowIndex = i;
                    let columnIndex = vis.displayData[i].counts.indexOf(d);
                    let exporterName = vis.displayData[rowIndex].name;
                    let importerName = vis.displayData[columnIndex].name;

                    vis.tooltip
                        .style("visibility", "visible")
                        .html(`
                            <strong style="font-size: 16px;">Trade Details</strong><br><br>
                            <strong>From:</strong> ${exporterName}<br>
                            <strong>To:</strong> ${importerName}<br>
                            <strong>Number of Trades:</strong> ${d}
                        `)
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 10) + "px");

                    d3.select(this)
                        .style("stroke", "#333")
                        .style("stroke-width", "3px");
                })
                .on("mousemove", function(event) {
                    vis.tooltip
                        .style("left", (event.pageX + 15) + "px")
                        .style("top", (event.pageY - 10) + "px");
                })
                .on("mouseout", function() {
                    vis.tooltip.style("visibility", "hidden");
                    d3.select(this)
                        .style("stroke", null)
                        .style("stroke-width", null);
                });

            svgrow.append("text")
                .attr("x", -20)
                .attr("y", vis.cellHeight/2 + 5)
                .attr("text-anchor", "end")
                .attr("fill", "black")
                .style("font-size", "14px")
                .text(vis.displayData[i].name);

            vis.svg.append("text")
                .text(vis.displayData[i].name)
                .attr("transform", `rotate(-90) translate(58, ${(vis.cellWidth + vis.cellPadding) * i + vis.cellWidth/2})`)
                .style("font-size", "14px")
                .style("text-anchor", "middle");
        }

        vis.addLegend(maxCount);
        vis.addMatrixExplanation();
    }

    addLegend(maxCount) {
        let vis = this;

        let legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${vis.width + 20}, 0)`);

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

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 30)
            .attr("height", 150)
            .style("fill", "url(#color-gradient)");

        let scale = d3.scaleLinear()
            .domain([maxCount, 0])
            .range([0, 150]);

        let axis = d3.axisRight(scale)
            .ticks(5);

        legend.append("g")
            .attr("transform", "translate(30,0)")
            .call(axis)
            .style("font-size", "12px");

        legend.append("text")
            .attr("x", -10)
            .attr("y", -10)
            .style("text-anchor", "start")
            .style("font-weight", "bold")
            .style("font-size", "14px")
            .text("Number of Trades");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 170)
            .attr("width", 30)
            .attr("height", 20)
            .style("fill", "#D3D3D3");

        legend.append("text")
            .attr("x", 35)
            .attr("y", 185)
            .style("font-size", "12px")
            .text("No trade");
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