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

        console.log("AfricanMapVis Constructor:");
        console.log("Parent Element:", this.parentElement);
        console.log("GeoData Loaded:", this.geoData);
        console.log("TradeData Loaded:", this.tradeData);

        this.initVis();
    }

    initVis() {
        let vis = this;
        console.log("Initializing AfricanMapVis...");

        vis.mapWidth = 975;
        vis.mapHeight = 610;

        let mapDiv = document.getElementById(vis.parentElement);
        console.log("Map Container Dimensions:", {
            width: mapDiv.clientWidth,
            height: mapDiv.clientHeight,
        });

        let mapDivWidth = mapDiv.clientWidth;
        let mapDivHeight = mapDiv.clientHeight;

        vis.svg = d3.select("#" + vis.parentElement)
            .append("svg")
            .attr("width", mapDivWidth)
            .attr("height", mapDivHeight)
            .style("display", "block")
            .style("margin", "auto");

        console.log("SVG Initialized:", vis.svg.node());

        let projection = d3.geoMercator()
            .scale(1000) // Adjusted scale
            .translate([vis.mapWidth / 2, vis.mapHeight / 2])
            .center([10, 50]); // Centered on Africa

        console.log("Projection Parameters:", {
            scale: projection.scale(),
            translate: projection.translate(),
            center: projection.center(),
        });

        let geoGenerator = d3.geoPath().projection(projection);

        vis.countries = vis.svg.selectAll(".african-map-country")
            .data(vis.geoData.features)
            .enter()
            .append("path")
            .attr("class", "african-map-country")
            .attr("d", geoGenerator)
            .attr("fill", "lightgray")
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .on("mouseover", (event, d) => console.log("Hovered Country:", d.properties.name));

        console.log("Countries Rendered:", vis.countries.size());

        // Add legend group
        vis.legend = vis.svg
            .append("g")
            .attr("class", "african-map-legend")
            .attr("transform", `translate(${vis.mapWidth - 150}, ${vis.mapHeight - 200})`);
        console.log("Legend Group Created:", vis.legend.node());

        // Define color scale
        vis.colorScale = d3.scaleSequential()
            .domain([0, 10]) // Adjust based on your data range
            .interpolator(d3.interpolateBlues);
        console.log("Color Scale Domain:", vis.colorScale.domain());

        // Add legend rectangles and labels
        let legendValues = [0, 2, 5, 10]; // Adjust according to your data
        let legendLabels = ["0", "1-5", "6-10", "10+"];
        let legendRectSize = 50;

        vis.legend
            .selectAll(".african-map-legend-rect")
            .data(legendValues)
            .enter()
            .append("rect")
            .attr("class", "african-map-legend-rect")
            .attr("x", 0)
            .attr("y", (d, i) => i * legendRectSize)
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("fill", d => vis.colorScale(d))
            .attr("stroke", "black")
            .attr("stroke-width", "1px");
        console.log("Legend Rectangles Created");

        vis.legend
            .selectAll(".african-map-legend-text")
            .data(legendLabels)
            .enter()
            .append("text")
            .attr("class", "african-map-legend-text")
            .attr("x", legendRectSize + 7)
            .attr("y", (d, i) => i * legendRectSize + legendRectSize / 2)
            .attr("dy", "0.5em")
            .text(d => `${d} Exports`);
        console.log("Legend Text Added");

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;
        console.log("Wrangling Data...");

        // Summarize rhino exports by country
        vis.exportCounts = {};
        vis.tradeData.forEach(row => {
            const exporterCode = row.Exporter;
            if (exporterCode && exporterCode !== "NA") {
                vis.exportCounts[exporterCode] =
                    (vis.exportCounts[exporterCode] || 0) + (parseInt(row["Exporter reported quantity"]) || 0);
            }
        });

        console.log("Export Counts Processed:", vis.exportCounts);

        // Map country codes to country names and match export data
        vis.countryExports = {};
        Object.keys(africanCountryCodeToName).forEach(code => {
            const countryName = africanCountryCodeToName[code];
            vis.countryExports[countryName] = vis.exportCounts[code] || 0;
        });

        console.log("Country Exports Mapped:", vis.countryExports);

        vis.updateVis();
    }

    updateVis() {
        let vis = this;
        console.log("Updating Visualization...");

        // Define a color scale
        const maxExports = d3.max(Object.values(vis.countryExports));
        const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, maxExports]);
        console.log("Max Exports:", maxExports);

        // Update map colors
        vis.countries
            .on("mouseover", function(event, d) {
                console.log("Hovered Country Name:", d.properties.name);
                console.log("Export Data for Country:", vis.countryExports[d.properties.name]);
            })
            .transition()
            .duration(500)
            .attr("fill", d => {
                const countryName = d.properties.name;
                const exportCount = vis.countryExports[countryName] || 0;
                console.log(`Filling ${countryName} with value ${exportCount}`);
                return colorScale(exportCount);
            });

        console.log("Visualization Updated.");
    }
}

