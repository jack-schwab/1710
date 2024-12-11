class WorldMapVis {

    constructor(parentElement, animalData, geoData) {

        this.parentElement = parentElement;
        this.animalData = animalData;
        this.geoData = geoData;
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b'];
        this.countryNameToCode = {
            "Afghanistan": "AF",
            "Albania": "AL",
            "Algeria": "DZ",
            "Andorra": "AD",
            "Angola": "AO",
            "Antigua and Barbuda": "AG",
            "Argentina": "AR",
            "Armenia": "AM",
            "Australia": "AU",
            "Austria": "AT",
            "Azerbaijan": "AZ",
            "Bahamas": "BS",
            "Bahrain": "BH",
            "Bangladesh": "BD",
            "Barbados": "BB",
            "Belarus": "BY",
            "Belgium": "BE",
            "Belize": "BZ",
            "Benin": "BJ",
            "Bhutan": "BT",
            "Bolivia": "BO",
            "Bosnia and Herzegovina": "BA",
            "Botswana": "BW",
            "Brazil": "BR",
            "Brunei": "BN",
            "Bulgaria": "BG",
            "Burkina Faso": "BF",
            "Burundi": "BI",
            "Cabo Verde": "CV",
            "Cambodia": "KH",
            "Cameroon": "CM",
            "Canada": "CA",
            "Central African Rep.": "CF",
            "Chad": "TD",
            "Chile": "CL",
            "China": "CN",
            "Colombia": "CO",
            "Comoros": "KM",
            "Congo": "CG",
            "Dem. Rep. Congo": "CD",
            "Costa Rica": "CR",
            "Cote d'Ivoire": "CI",
            "Croatia": "HR",
            "Cuba": "CU",
            "Cyprus": "CY",
            "Czechia": "CZ",
            "Denmark": "DK",
            "Djibouti": "DJ",
            "Dominica": "DM",
            "Dominican Rep.": "DO",
            "Ecuador": "EC",
            "Egypt": "EG",
            "El Salvador": "SV",
            "Eq. Guinea": "GQ",
            "Eritrea": "ER",
            "Estonia": "EE",
            "Eswatini": "SZ",
            "Ethiopia": "ET",
            "Fiji": "FJ",
            "Finland": "FI",
            "France": "FR",
            "Gabon": "GA",
            "Gambia": "GM",
            "Georgia": "GE",
            "Germany": "DE",
            "Ghana": "GH",
            "Greece": "GR",
            "Grenada": "GD",
            "Guatemala": "GT",
            "Guinea": "GN",
            "Guinea-Bissau": "GW",
            "Guyana": "GY",
            "Haiti": "HT",
            "Honduras": "HN",
            "Hungary": "HU",
            "Iceland": "IS",
            "India": "IN",
            "Indonesia": "ID",
            "Iran": "IR",
            "Iraq": "IQ",
            "Ireland": "IE",
            "Israel": "IL",
            "Italy": "IT",
            "Jamaica": "JM",
            "Japan": "JP",
            "Jordan": "JO",
            "Kazakhstan": "KZ",
            "Kenya": "KE",
            "Kiribati": "KI",
            "Kuwait": "KW",
            "Kyrgyzstan": "KG",
            "Laos": "LA",
            "Latvia": "LV",
            "Lebanon": "LB",
            "Lesotho": "LS",
            "Liberia": "LR",
            "Libya": "LY",
            "Liechtenstein": "LI",
            "Lithuania": "LT",
            "Luxembourg": "LU",
            "Madagascar": "MG",
            "Malawi": "MW",
            "Malaysia": "MY",
            "Maldives": "MV",
            "Mali": "ML",
            "Malta": "MT",
            "Marshall Is.": "MH",
            "Mauritania": "MR",
            "Mauritius": "MU",
            "Mexico": "MX",
            "Micronesia": "FM",
            "Moldova": "MD",
            "Monaco": "MC",
            "Mongolia": "MN",
            "Montenegro": "ME",
            "Morocco": "MA",
            "Mozambique": "MZ",
            "Myanmar": "MM",
            "Namibia": "NA",
            "Nauru": "NR",
            "Nepal": "NP",
            "Netherlands": "NL",
            "New Zealand": "NZ",
            "Nicaragua": "NI",
            "Niger": "NE",
            "Nigeria": "NG",
            "North Korea": "KP",
            "North Macedonia": "MK",
            "Norway": "NO",
            "Oman": "OM",
            "Pakistan": "PK",
            "Palau": "PW",
            "Panama": "PA",
            "Papua New Guinea": "PG",
            "Paraguay": "PY",
            "Peru": "PE",
            "Philippines": "PH",
            "Poland": "PL",
            "Portugal": "PT",
            "Qatar": "QA",
            "Romania": "RO",
            "Russia": "RU",
            "Rwanda": "RW",
            "Saint Kitts and Nevis": "KN",
            "Saint Lucia": "LC",
            "St. Vin. and Gren.": "VC",
            "Samoa": "WS",
            "San Marino": "SM",
            "Sao Tome and Principe": "ST",
            "Saudi Arabia": "SA",
            "Senegal": "SN",
            "Serbia": "RS",
            "Seychelles": "SC",
            "Sierra Leone": "SL",
            "Singapore": "SG",
            "Slovakia": "SK",
            "Slovenia": "SI",
            "Solomon Is.": "SB",
            "Somalia": "SO",
            "South Africa": "ZA",
            "South Korea": "KR",
            "South Sudan": "SS",
            "Spain": "ES",
            "Sri Lanka": "LK",
            "Sudan": "SD",
            "Suriname": "SR",
            "Sweden": "SE",
            "Switzerland": "CH",
            "Syria": "SY",
            "Taiwan": "TW",
            "Tajikistan": "TJ",
            "Tanzania": "TZ",
            "Thailand": "TH",
            "Timor-Leste": "TL",
            "Togo": "TG",
            "Tonga": "TO",
            "Trinidad and Tobago": "TT",
            "Tunisia": "TN",
            "Turkey": "TR",
            "Turkmenistan": "TM",
            "Tuvalu": "TV",
            "Uganda": "UG",
            "Ukraine": "UA",
            "United Arab Emirates": "AE",
            "United Kingdom": "GB",
            "United States": "US",
            "Uruguay": "UY",
            "Uzbekistan": "UZ",
            "Vanuatu": "VU",
            "Vatican City": "VA",
            "Venezuela": "VE",
            "Vietnam": "VN",
            "Yemen": "YE",
            "Zambia": "ZM",
            "Zimbabwe": "ZW"
        };


        this.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')
            .style("opacity", 0)
            .style("position", "fixed")  // Changed to fixed
            .style("pointer-events", "none")
            .style("background", "white")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("box-shadow", "2px 2px 6px rgba(0,0,0,0.2)")
            .style("z-index", "9999");


        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.height = 500 - vis.margin.top - vis.margin.bottom;
        vis.width = 500 - vis.margin.left - vis.margin.right;

        // Initialize drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text("Hover For 2023 Info")
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // Create projection
        vis.projection = d3.geoOrthographic()
            .scale(Math.min(vis.width, vis.height) / 2.7)
            .translate([vis.width / 2, vis.height / 2]);

        // Geo generator
        vis.path = d3.geoPath().projection(vis.projection);

        // Convert TopoJSON data into GeoJSON structure
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features;

        // Draw ocean
        vis.svg.append("path")
            .datum({ type: "Sphere" })
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke", "rgba(129,129,129,0.35)")
            .attr("d", vis.path);

        // Draw countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path);

        // Initialize color scale
        vis.colorScale = d3.scaleQuantile()
            .range(vis.colors);

        // Legend
        let legendrectsize = 20;
        let valueScale = d3.scaleLinear()
            .domain([0, 100]) // Default domain; will be updated in `wrangleData`
            .range([0, 4 * legendrectsize]);

        let xAxis = d3.axisBottom().scale(valueScale).ticks(2);
        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr('transform', `translate(${vis.width * 1.5 / 4}, ${vis.height - 20})`)
            .call(xAxis);

        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 1.5 / 4}, ${vis.height - 20 - legendrectsize})`);

        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append("rect")
            .attr("x", (d, index) => legendrectsize * index)
            .attr("y", 0)
            .attr("width", legendrectsize)
            .attr("height", legendrectsize)
            .attr("fill", (d, index) => vis.colors[index]);

        // Drag interaction
        let m0, o0;
        vis.svg.call(
            d3.drag()
                .on("start", function (event) {
                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path);
                    d3.selectAll(".graticule").attr("d", vis.path);
                })
        );

        // Append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'globeToolTip');

        // Call wrangleData
        vis.wrangleData();
    }


    wrangleData() {
        let vis = this;

        // Get the selected country (exporter) from the global variable
        const selectedCountry = window.selectedCountry1 || null;

        // Convert the selected country name to a code
        const exporterCode = selectedCountry ? vis.countryNameToCode[selectedCountry] : null;

        console.log(`Filtering by exporter: ${selectedCountry} (${exporterCode})`);

        // Filter data based on the selected exporter
        vis.filteredAnimalData = vis.animalData.filter(d => {
            if (!exporterCode) return true; // Include all exporters if no selection
            return d.Exporter === exporterCode;
        });

        console.log("Filtered Animal Data:", vis.filteredAnimalData);

        if (vis.filteredAnimalData.length === 0) {
            console.warn(`No data found for exporter: ${selectedCountry}`);
        }

        // Create data structure to hold import statistics by country
        vis.importStats = {};

        // Aggregate imports for each country
        vis.filteredAnimalData.forEach(d => {
            let importer = d.Importer ? d.Importer.trim().toUpperCase() : null;
            let importedQty = d['Importer reported quantity'] ? parseInt(d['Importer reported quantity']) : 0;

            if (importer && importedQty > 0) {
                if (!vis.importStats[importer]) {
                    vis.importStats[importer] = 0;
                }
                vis.importStats[importer] += importedQty;
            } else {
                console.warn(`Invalid data row:`, d);
            }
        });

        console.log("Aggregated Import Stats:", vis.importStats);

        // Find max import value for color scale
        let maxImport = d3.max(Object.values(vis.importStats)) || 0;

        // Update color scale domain
        vis.colorScale = d3.scaleQuantile()
            .domain([0, maxImport])
            .range(vis.colors);

        console.log("Max import value:", maxImport);
        console.log("Color scale domain:", vis.colorScale.domain());

        vis.updateVis();
    }


    updateVis() {
        let vis = this;

        vis.countries
            .attr("fill", d => {
                const countryName = d.properties.name;
                const countryCode = vis.countryNameToCode[countryName];
                const imports = vis.importStats[countryCode];

                // Debugging logs
                console.log(`Country: ${countryName}, Code: ${countryCode}, Imports: ${imports}`);

                // Color countries based on imports or fallback to default
                return imports && imports > 0 ? vis.colorScale(imports) : "#ccc";
            })
            .attr("stroke-width", d => {
                // Highlight the selected country
                return d.properties.name === vis.selectedCountry ? "4px" : "0px";
            })
            .attr("stroke", d => {
                // Black stroke for the selected country
                return d.properties.name === vis.selectedCountry ? "black" : "none";
            })
            .on('click', function (event, d) {
                const clickedCountry = d.properties.name;

                // Update the selected country
                vis.selectedCountry = clickedCountry;
                window.selectedCountry2 = clickedCountry;

                console.log(`Selected Country: ${clickedCountry}`);

                // Trigger the flag function
                if (typeof window.displayFlags === 'function') {
                    window.displayFlags();
                } else {
                    console.warn("window.displayFlags is not defined");
                }

                // Update visualization to reflect the new selection
                vis.updateVis();
            });
    }


}
// init global variables, switches, helper functions
let myWorldMapVis;

// load data using promises
let worldMapPromises = [
    d3.csv("data/2023.csv").then(data => {
        return data;
    })
        .catch(error => {
            console.error("Error loading CSV:", error);
            throw error;
        }),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(data => {
        return data;
    })
];

Promise.all(worldMapPromises)
    .then(function(data){
        initWorldMapPage(data);
    })
    .catch(function(err){
        console.error("Error in Promise.all:", err);
    });

function initWorldMapPage(allDataArray) {
    const container = document.getElementById('world-map')

    window.myWorldMapVis = new WorldMapVis('world-map', allDataArray[0], allDataArray[1]);
}