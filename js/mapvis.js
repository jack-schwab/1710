const countryCodeToName = {
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
    //SO: "Somaliland",
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

class MapVis {
    constructor(parentElement, geoData, tradeData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.tradeData = tradeData;

        this.initVis();
    }

    initVis() {
        let vis = this;
        console.log("Initializing MapVis...");

        // * TO-DO *
        vis.margin = {top: 40, right: 0, bottom: 60, left: 160};

        //vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
        vis.mapHeight = 610 - vis.margin.top - vis.margin.bottom;
        vis.mapWidth = 975 - vis.margin.left - vis.margin.right;

        let mapDiv = document.getElementById(vis.parentElement);

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", vis.mapWidth)
            .attr("height", vis.mapHeight)
            .style("display", "block")
            .style("margin", "auto");

        let projection = d3.geoMercator()
            .scale(1000) // Adjusted scale
            .translate([vis.mapWidth / 2, vis.mapHeight / 2])
            .center([-50, 50]); // Centered on Africa

        let geoGenerator = d3.geoPath()
            .projection(projection);

        vis.countries = vis.svg.selectAll(".country")
            .data(vis.geoData.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", geoGenerator)
            .attr("fill", "lightgray")
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .on("mouseover", (event, d) => console.log(event, d));

        // Add legend group
        vis.legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${vis.mapWidth - 150}, ${vis.mapHeight - 200})`);

        // Define color scale
        vis.colorScale = d3.scaleSequential()
            .domain([0, 10]) // Adjust based on your data range
            .interpolator(d3.interpolateBlues);

        //0, between 1 and 5, between 5 and 10, over 10 scale
        // Add legend rectangles and labels
        let legendValues = [0, 2, 5, 10]; // Adjust according to your data
        let legend_labels = ["0", "1-5", "6-10", "10+"]
        let legendRectSize = 50;
        vis.legend.selectAll(".legend-rect")
            .data(legendValues)
            .enter().append("rect")
            .attr("class", "legend-rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * legendRectSize)
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("fill", d => vis.colorScale(d))
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        vis.legend.selectAll(".legend-text")
            .data(legend_labels)
            .enter().append("text")
            .attr("class", "legend-text")
            .attr("x", legendRectSize + 7)
            .attr("y", (d, i) => i * legendRectSize + legendRectSize / 2)
            .attr("dy", "0.5em")
            .text(d => `${d} Exports`);

        // vis.tooltip = d3.select("body").append("div")
        //     .attr("class", "tooltip")
        //     .style("opacity", 0)
        //     .style("position", "absolute")
        //     .style("pointer-events", "none")
        //     .style("background-color", "rgba(0, 0, 0, 0.75)")
        //     .style("color", "#ffffff")
        //     .style("padding", "10px")
        //     .style("border-radius", "8px")
        //     .style("font-size", "14px")
        //     .style("line-height", "1.5em");
        //
        // vis.legend = vis.svg.append("g")
        //     .attr("class", "legend")
        //     .attr("transform", `translate(${mapDivWidth - 60}, ${mapDivHeight - vis.mapHeight - 40})`);

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // Summarize rhino exports by country
        vis.exportCounts = {};
        vis.tradeData.forEach(row => {
            const exporterCode = row.Exporter;
            if (exporterCode && exporterCode !== "NA") {
                vis.exportCounts[exporterCode] = (vis.exportCounts[exporterCode] || 0) +
                    (parseInt(row["Exporter reported quantity"]) || 0);
            }
        });

        //in addition to grabbing exporter you want to grab for each exporter nation
        //all of the importer nations the way you want to store this is
        //you want for each exporter nation needs to be its ownd ictionary with a
        //total and then you want list of importer nations and the list of importer nations
        //which is a list of dictionaries with these similar counts

        console.log(vis.exportCounts)

        // Map country codes to country names and match export data
        vis.countryExports = {};
        Object.keys(countryCodeToName).forEach(code => {
            const countryName = countryCodeToName[code];
            vis.countryExports[countryName] = vis.exportCounts[code] || 0;
        });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Define a color scale
        const maxExports = d3.max(Object.values(vis.countryExports));
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, maxExports]);

        // Update map colors
        vis.countries
            .on("mouseover", function(event, d){
                console.log(d)
            })
            .transition()
            .duration(500)
            .attr("fill", d => {
                const countryName = d.properties.name;
                const exportCount = vis.countryExports[countryName] || 0;
                return colorScale(exportCount);
            })

        // Optionally, log the exports for debugging
        console.log("Country Exports:", vis.countryExports);
    }

}
