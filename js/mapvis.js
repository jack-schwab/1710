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

        // Explicitly bind methods to the instance
        this.wrangleData = this.wrangleData.bind(this);
        this.updateVis = this.updateVis.bind(this);

        this.initVis();
    }

    initVis() {
        let vis = this;

        console.log("Initializing AfricanMapVis...");

        // Set up dimensions and SVG
        vis.mapWidth = 1975;
        vis.mapHeight = 1610;
        vis.svg = d3
            .select(`#${vis.parentElement}`)
            .append("svg")
            .attr("width", vis.mapWidth)
            .attr("height", vis.mapHeight);

        console.log("SVG container created.");

        vis.projection = d3.geoMercator()
            .scale(500)
            .translate([vis.mapWidth / 2, vis.mapHeight / 2])
            .center([65, -35]);

        vis.geoGenerator = d3.geoPath().projection(vis.projection);

        // Create tooltip
        console.log("Creating tooltip...");
        vis.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("padding", "5px 10px")
            .style("background", "rgba(255, 255, 255, 0.9)") // Light background for contrast
            .style("color", "black") // Set font color to black
            .style("border-radius", "5px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", 1000);

        console.log("Tooltip created:", vis.tooltip);



        vis.countries = vis.svg
            .selectAll(".african-map-country")
            .data(vis.geoData.features)
            .enter()
            .append("path")
            .attr("class", "african-map-country")
            .attr("d", vis.geoGenerator)
            .attr("fill", "lightgray")
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .on("mouseover", function (event, d) {
                const countryName = d.properties.name || "Unknown";
                console.log("Mouseover on:", countryName);

                vis.tooltip
                    .style("opacity", 1)
                    .text(countryName);

                console.log("Tooltip content set:", countryName);
            })
            .on("mousemove", function (event) {
                console.log("Mousemove event. Positioning tooltip...");

                const tooltipWidth = 150; // Approximate width of the tooltip
                const tooltipHeight = 50; // Approximate height of the tooltip

                // Get the bounding box of the SVG container
                const boundingBox = vis.svg.node().getBoundingClientRect();

                // Calculate the position relative to the bounding box
                const relativeX = event.clientX - boundingBox.left; // X within the container
                const relativeY = event.clientY - boundingBox.top; // Y within the container

                // Adjust position to prevent overflow
                const leftPos = Math.min(event.clientX + 10, window.innerWidth - tooltipWidth);
                const topPos = Math.min(event.clientY - 20, window.innerHeight - tooltipHeight);

                console.log("Calculated tooltip position:", {
                    absoluteX: event.pageX,
                    absoluteY: event.pageY,
                    relativeX,
                    relativeY,
                    left: leftPos,
                    top: topPos,
                });

                vis.tooltip
                    .style("left", `${leftPos}px`)
                    .style("top", `${topPos}px`)
                    .style("opacity", 1); // Ensure visibility
            })
            .on("mouseout", function () {
                console.log("Mouseout event. Hiding tooltip...");
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", `-9999px`) // Move it offscreen to avoid residual positioning issues
                    .style("top", `-9999px`);
            });



        console.log("Countries drawn on the map.");

        vis.colorScale = d3.scaleSequential(d3.interpolateBlues);

        // Attach event listener to the dropdown
        const dataSelector = document.getElementById("data-selector");
        if (dataSelector) {
            dataSelector.addEventListener("change", (event) => {
                const selectedFile = event.target.value;
                vis.loadNewData(selectedFile);
            });
        } else {
            console.warn("Data selector element not found!");
        }

        vis.wrangleData();
    }

    loadNewData(selectedFile) {
        let vis = this;

        console.log("Loading new data file:", selectedFile);

        d3.csv(`data/${selectedFile}`)
            .then((newTradeData) => {
                console.log(`Loaded ${selectedFile}:`, newTradeData);

                vis.tradeData = newTradeData;
                vis.wrangleData();
            })
            .catch((error) => {
                console.error(`Error loading file ${selectedFile}:`, error);
            });
    }

    wrangleData(year_1 = window.startYear, year_2 = window.endYear) {
        let vis = this;
        console.log("Wrangle data starts")
        console.log(`Wrangling data with year_1 = ${year_1}, year_2 = ${year_2}`);

        const filteredData = year_1 && year_2
            ? vis.tradeData.filter(row => {
                const year = parseInt(row.Year, 10);
                console.log(`Filtering row: Year = ${year}, In range: ${year >= year_1 && year <= year_2}`);
                return year >= year_1 && year <= year_2;
            })
            : vis.tradeData;

        console.log(`Filtered data (${year_1}-${year_2}) count: ${filteredData.length}`);
        console.log("Filtered data content:", filteredData);

        vis.exportCounts = {};
        filteredData.forEach((row) => {
            const exporterCode = row.Exporter;
            if (exporterCode && exporterCode !== "NA") {
                vis.exportCounts[exporterCode] =
                    (vis.exportCounts[exporterCode] || 0) +
                    (parseInt(row["Exporter reported quantity"]) || 0);
            }
        });

        console.log("Export counts after aggregation:", vis.exportCounts);

        vis.countryExports = {};
        Object.keys(africanCountryCodeToName).forEach((code) => {
            const countryName = africanCountryCodeToName[code];
            vis.countryExports[countryName] = vis.exportCounts[code] || 0;
        });

        console.log("Mapped export counts to country names:", vis.countryExports);

        vis.updateVis();
    }

    updateVis() {
        let selectedCountry = null; // Variable to store the currently selected country
        let vis = this;

        console.log("Updating map visualization...");

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

        vis.countries
            .on("click", function (event, d) {
                const clickedCountry = d.properties.name;

                // Deselect the previously selected country
                if (selectedCountry) {
                    d3.selectAll(".african-map-country")
                        .filter(country => country.properties.name === selectedCountry)
                        .classed("selected", false);
                }

                // Update the selected country
                if (selectedCountry === clickedCountry) {
                    selectedCountry = null; // Deselect if clicked again
                } else {
                    selectedCountry = clickedCountry;
                    d3.select(this).classed("selected", true);
                }

                console.log("Selected country:", selectedCountry);
            });

        console.log("Map visualization updated.");
    }

}
