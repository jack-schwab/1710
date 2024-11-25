// /* * * * * * * * * * * * * *
// *          MapVis          *
// * * * * * * * * * * * * * */

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

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.height = 500 - vis.margin.top - vis.margin.bottom;
        vis.width = 500 - vis.margin.left - vis.margin.right;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Title for Map')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // TODO
        //create projection

        vis.projection = d3.geoOrthographic()// d3.geoStereographic()
            .scale(Math.min(vis.width, vis.height)/2.7)
            .translate([vis.width / 2, vis.height / 2])
        //geo generator
        vis.path = d3.geoPath()
            .projection(vis.projection);

        //TopoJSON data into GeoJSON data structure
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features
        //ocean
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);
        //draw countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path);

        vis.colorScale = d3.scaleQuantile()
            .range(vis.colors);


        //legend
        let legendrectsize = 20
        let valueScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0,4*legendrectsize]);
        let xAxis = d3.axisBottom()
            .scale(valueScale)
            .ticks(2)
        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr('transform', `translate(${vis.width * 1.5 / 4}, ${vis.height-20})`)
            .call(xAxis);
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 1.5 / 4}, ${vis.height - 20- legendrectsize})`)
        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append("rect")
            .attr("x", (d,index)=>{
                return legendrectsize*index
            })
            .attr("y", 0)
            .attr("width", legendrectsize)
            .attr("height", legendrectsize)
            .attr("fill", (d,index)=>{
                return vis.colors[index]
            })

        let m0,
            o0;

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
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )
// append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'globeToolTip')


        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // Create data structure to hold country statistics
        vis.countryStats = {};

        // Process each trade record
        vis.animalData.forEach(d => {
            if (d.Exporter && (d.Class === 'Aves' || d.Class === 'Mammalia')) {
                if (!vis.countryStats[d.Exporter]) {
                    vis.countryStats[d.Exporter] = {
                        totalExported: 0,
                        totalImported: 0,
                        speciesCounts: {},
                        termCounts: {},
                        yearlyTotals: {}
                    };
                }

                const exportedQty = parseInt(d['Exporter reported quantity']) || 0;
                const importedQty = parseInt(d['Importer reported quantity']) || 0;

                vis.countryStats[d.Exporter].totalExported += exportedQty;
                vis.countryStats[d.Exporter].totalImported += importedQty;

                if (d.Taxon) {
                    vis.countryStats[d.Exporter].speciesCounts[d.Taxon] =
                        (vis.countryStats[d.Exporter].speciesCounts[d.Taxon] || 0) + 1;
                }

                if (d.Year) {
                    if (!vis.countryStats[d.Exporter].yearlyTotals[d.Year]) {
                        vis.countryStats[d.Exporter].yearlyTotals[d.Year] = 0;
                    }
                    vis.countryStats[d.Exporter].yearlyTotals[d.Year] += exportedQty;
                }
            }
        });

        // Find max export value for color scale
        let maxExport = 100;

        // Update color scale domain
        vis.colorScale = d3.scaleQuantile()
            .domain([0, maxExport])
            .range(vis.colors);

        console.log("Max export value:", maxExport);
        console.log("Color scale domain:", vis.colorScale.domain());

        vis.updateVis();
    }

    updateVis() {
        let vis = this;

        // Update country colors
        vis.countries
            .attr("fill", d => {
                const countryCode = vis.countryNameToCode[d.properties.name];
                const stats = vis.countryStats[countryCode];
                return stats ? vis.colorScale(stats.totalExported) : "#ccc";
            })
            .on('mouseover', function(event, d) {
                const xPos = event.clientX;
                const yPos = event.clientY;

                const countryCode = vis.countryNameToCode[d.properties.name];
                const stats = vis.countryStats[countryCode];

                let tooltipContent = `<div style="min-width: 200px;">`;

                if (stats) {
                    let topSpecies = Object.entries(stats.speciesCounts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3);

                    let years = Object.keys(stats.yearlyTotals).sort().slice(-3);

                    tooltipContent += `
                    <strong>${d.properties.name}</strong><br>
                    <hr style="margin: 5px 0">
                    <strong>Total Exported:</strong> ${d3.format(",")(stats.totalExported)}<br>
                    <strong>Total Imported:</strong> ${d3.format(",")(stats.totalImported)}<br>
                    <br>
                    <strong>Top Species:</strong><br>
                    ${topSpecies.map(([species, count]) =>
                        `- ${species}: ${count} trades`
                    ).join('<br>')}
                    <br>
                    <strong>Recent Years:</strong><br>
                    ${years.map(year =>
                        `${year}: ${d3.format(",")(stats.yearlyTotals[year])} specimens`
                    ).join('<br>')}
                `;
                } else {
                    tooltipContent += `<strong>${d.properties.name}</strong><br>No trade data available`;
                }

                tooltipContent += `</div>`;

                // Highlight country
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black');

                // Position and show tooltip
                vis.tooltip
                    .html(tooltipContent)
                    .style("left", (xPos + 10) + "px")
                    .style("top", (yPos + 10) + "px")
                    .style("opacity", 1);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .attr('stroke-width', '0px');

                vis.tooltip.style("opacity", 0);
            })
            .on('mousemove', function(event) {
                vis.tooltip
                    .style("left", (event.clientX + 10) + "px")
                    .style("top", (event.clientY + 10) + "px");
            });

        // Update legend
        let legendRectSize = 20;
        let valueScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(vis.countryStats), d => d.totalExported)])
            .range([0, 4 * legendRectSize]);

        let xAxis = d3.axisBottom()
            .scale(valueScale)
            .ticks(4)
            .tickFormat(d3.format(",d"));

        vis.svg.select(".x-axis")
            .call(xAxis);

        // Update legend colors
        vis.legend.selectAll("rect")
            .data(vis.colors)
            .join("rect")
            .attr("x", (d, index) => legendRectSize * index)
            .attr("y", 0)
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .attr("fill", d => d);
    }
}
// init global variables, switches, helper functions
let myMapVis;

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

    myMapVis = new WorldMapVis('world-map', allDataArray[0], allDataArray[1]);
}
