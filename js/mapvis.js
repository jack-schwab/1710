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

class AfricanMapVis {
    constructor(parentElement, geoData, tradeData) {
        this.parentElement = parentElement;
        this.geoData = geoData;
        this.tradeData = tradeData;

        console.log("AfricanMapVis Constructor:", {
            geoData: this.geoData,
            tradeData: this.tradeData,
        });

        this.initVis();
    }

    initVis() {
        let vis = this;

        // Set up dimensions and SVG
        vis.mapWidth = 1975;
        vis.mapHeight = 1610;
        vis.svg = d3
            .select(`#${vis.parentElement}`)
            .append("svg")
            .attr("width", vis.mapWidth)
            .attr("height", vis.mapHeight);

        vis.projection = d3.geoMercator()
            .scale(1000)
            .translate([vis.mapWidth / 2, vis.mapHeight / 2])
            .center([40, 0]);

        vis.geoGenerator = d3.geoPath().projection(vis.projection);

        vis.countries = vis.svg
            .selectAll(".african-map-country")
            .data(vis.geoData.features)
            .enter()
            .append("path")
            .attr("class", "african-map-country")
            .attr("d", vis.geoGenerator)
            .attr("fill", "lightgray")
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        vis.colorScale = d3.scaleSequential(d3.interpolateBlues);

        // Attach event listener to the dropdown
        const dataSelector = document.getElementById("data-selector");
        dataSelector.addEventListener("change", (event) => {
            const selectedFile = event.target.value;
            vis.loadNewData(selectedFile);
        });

        vis.wrangleData();
    }

    loadNewData(selectedFile) {
        let vis = this;

        // Dynamically load the new CSV based on dropdown value
        d3.csv(`data/${selectedFile}`)
            .then((newTradeData) => {
                console.log(`Loaded ${selectedFile}:`, newTradeData);

                // Update the trade data and re-render the visualization
                vis.tradeData = newTradeData;
                vis.wrangleData();
            })
            .catch((error) => {
                console.error(`Error loading file ${selectedFile}:`, error);
            });
    }

    wrangleData() {
        let vis = this;

        vis.exportCounts = {};
        vis.tradeData.forEach((row) => {
            const exporterCode = row.Exporter;
            if (exporterCode && exporterCode !== "NA") {
                vis.exportCounts[exporterCode] =
                    (vis.exportCounts[exporterCode] || 0) +
                    (parseInt(row["Exporter reported quantity"]) || 0);
            }
        });

        vis.countryExports = {};
        Object.keys(africanCountryCodeToName).forEach((code) => {
            const countryName = africanCountryCodeToName[code];
            vis.countryExports[countryName] = vis.exportCounts[code] || 0;
        });

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        const maxExports = d3.max(Object.values(vis.countryExports));
        vis.colorScale.domain([0, maxExports]);

        vis.countries
            .transition()
            .duration(500)
            .attr("fill", (d) => {
                const countryName = d.properties.name;
                const exportCount = vis.countryExports[countryName] || 0;
                return vis.colorScale(exportCount);
            });
    }
}


