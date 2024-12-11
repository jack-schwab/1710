countryNameToCode =
    {
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
};// Function to get the PNG file name for a given country name
// Guard flag to prevent recursive initialization
let hasInitialized = false;

function initVis() {
    console.log("Initializing visualization...");

    const dataSelector = document.getElementById("data-selector");
    if (dataSelector) {
        // Attach event listener for dropdown changes
        dataSelector.addEventListener("change", (event) => {
            const selectedFile = event.target.value;
            console.log(`File selected: data/${selectedFile}`);
            loadNewData(selectedFile);
        });

        // Trigger `loadNewData` only once for the default selection
        if (!hasInitialized) {
            const defaultFile = dataSelector.value; // Get the default value of the dropdown
            console.log(`Default file selected on initialization: data/${defaultFile}`);
            loadNewData(defaultFile);
            hasInitialized = true; // Prevent further redundant initialization
        }
    } else {
        console.warn("Data selector element not found!");
    }

    // Filter the data and produce the line chart
    if (tradeData) {
        const filteredData = filterData(tradeData);
        console.log(`[initVis] Filtered Data for Visualization:`, filteredData);
        createLineChart(filteredData);
    }

    // Log the current state of global variables
    console.log("State variables:", {
        startYear: window.startYear,
        endYear: window.endYear,
        selectedCountry1: window.selectedCountry1,
        selectedCountry2: window.selectedCountry2,
    });
}

function createLineChart(data) {
    console.log("Creating line chart with filtered data:", data);

    // Aggregate the data by year
    const aggregatedData = d3.rollup(
        data,
        (v) => v.length, // Count the number of trades
        (d) => d.Year // Group by year
    );

    const lineData = Array.from(aggregatedData, ([year, count]) => ({ year: +year, count })).sort((a, b) => a.year - b.year);

    console.log("Aggregated data for line chart:", lineData);

    if (!lineData || lineData.length === 0) {
        console.warn("No data to plot.");
        d3.select("#line-chart").html("<p>No data available for the selected filters.</p>");
        return;
    }

    // Set chart dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    console.log("Chart dimensions:", { width, height, margin });

    const svg = d3
        .select("#line-chart")
        .html("") // Clear previous content
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    console.log("SVG element created.");

    // Set scales
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(lineData, (d) => d.year))
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(lineData, (d) => d.count)])
        .range([height, 0]);

    console.log("Scales created:", { xScaleDomain: xScale.domain(), yScaleDomain: yScale.domain() });

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    // Add x-axis
    svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Year");

    console.log("X-axis created.");

    // Add y-axis
    svg
        .append("g")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .text("Number of Trades");

    console.log("Y-axis created.");

    // Add line path
    const line = d3
        .line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.count));

    svg
        .append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    console.log("Line path added.");

    // Add points to the line
    svg
        .selectAll("circle")
        .data(lineData)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.year))
        .attr("cy", (d) => yScale(d.count))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("#line-chart-tooltip");
            tooltip.style("display", "block");
            tooltip.html(`Year: ${d.year}<br>Trades: ${d.count}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", () => {
            d3.select("#line-chart-tooltip").style("display", "none");
        });

    console.log("Points added to the line.");

    // Tooltip for interaction
    d3.select("body").append("div")
        .attr("id", "line-chart-tooltip")
        .style("position", "absolute")
        .style("display", "none")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("border-radius", "5px");

    console.log("Tooltip initialized.");
}



function filterData(data) {
    console.log(`[filterData] Initial Trade Data:`, data);

    // Get selected country names from global variables
    const exporterName = window.selectedCountry1;
    const importerName = window.selectedCountry2;
    const startYear = window.startYear;
    const endYear = window.endYear;

    // Convert country names to codes using `countryNameToCode`
    const exporterCode = exporterName ? countryNameToCode[exporterName] : null;
    const importerCode = importerName ? countryNameToCode[importerName] : null;

    if (exporterName && !exporterCode) {
        console.warn(`Exporter "${exporterName}" does not have a valid country code.`);
    }
    if (importerName && !importerCode) {
        console.warn(`Importer "${importerName}" does not have a valid country code.`);
    }

    return data.filter((row) => {
        // Match exporter by code
        const matchesExporter = exporterCode ? row.Exporter === exporterCode : true;

        // Match importer by code
        const matchesImporter = importerCode ? row.Importer === importerCode : true;

        // Parse year and filter by range
        const year = parseInt(row.Year, 10);
        const matchesYearRange = (startYear && endYear) ? (year >= startYear && year <= endYear) : true;

        // Return true only if all conditions are satisfied
        return matchesExporter && matchesImporter && matchesYearRange;
    });
}



function loadNewData(selectedFileBaseName) {
    console.log('Loading new data...');
    const selectedFile = `data/${selectedFileBaseName}`; // Construct full file path
    console.log(`[loadNewData] Loading file: ${selectedFile}`);

    d3.csv(selectedFile)
        .then((newTradeData) => {
            console.log(`[loadNewData] Successfully loaded file: ${selectedFile}`);
            console.log(`[loadNewData] Data Preview (first 5 rows):`, newTradeData.slice(0, 5));

            // Verify if critical fields like 'Exporter' and 'Importer' are present
            if (newTradeData.length > 0) {
                const keys = Object.keys(newTradeData[0]);
                console.log(`[loadNewData] Available fields in data: ${keys.join(", ")}`);
            } else {
                console.warn(`[loadNewData] Loaded file has no rows: ${selectedFile}`);
            }

            // Update global trade data
            tradeData = newTradeData;

            // Verify global variables are updated
            console.log(`[loadNewData] Global trade data updated. Total rows: ${tradeData.length}`);

            // Call displayFlags or other visualization updates
            displayFlags(); // Ensure visualization updates happen here
        })
        .catch((error) => {
            console.error(`[loadNewData] Error loading file: ${selectedFile}`);
            console.error(error);
        });
}

function displayFlags() {
    console.log("Displaying flags...");

    const flagDisplayLeft = document.getElementById("flagDisplayLeft");
    const flagDisplayRight = document.getElementById("flagDisplayRight");

    const countryNameLeft = window.selectedCountry1 || "Unknown Exporter";
    const countryNameRight = window.selectedCountry2 || "Unknown Importer";

    // Clear previous content
    flagDisplayLeft.innerHTML = "";
    flagDisplayRight.innerHTML = "";

    const flagFileNameLeft = getFlagFileName(countryNameLeft);
    if (flagFileNameLeft) {
        const imgLeft = document.createElement("img");
        imgLeft.src = `png100px/${flagFileNameLeft}`;
        imgLeft.alt = `Flag of ${countryNameLeft}`;
        flagDisplayLeft.appendChild(imgLeft);
        document.getElementById("exporter-name").innerText = countryNameLeft;

        imgLeft.onerror = () => {
            console.error(`Failed to load image for ${countryNameLeft} at ${imgLeft.src}`);
        };
    } else {
        const errorMessageLeft = document.createElement("p");
        errorMessageLeft.textContent = `Flag not found for "${countryNameLeft}".`;
        errorMessageLeft.style.color = "red";
        flagDisplayLeft.appendChild(errorMessageLeft);
    }

    const flagFileNameRight = getFlagFileName(countryNameRight);
    if (flagFileNameRight) {
        const imgRight = document.createElement("img");
        imgRight.src = `png100px/${flagFileNameRight}`;
        imgRight.alt = `Flag of ${countryNameRight}`;
        flagDisplayRight.appendChild(imgRight);
        document.getElementById("importer-name").innerText = countryNameRight;

        imgRight.onerror = () => {
            console.error(`Failed to load image for ${countryNameRight} at ${imgRight.src}`);
        };
    } else {
        const errorMessageRight = document.createElement("p");
        errorMessageRight.textContent = `Flag not found for "${countryNameRight}".`;
        errorMessageRight.style.color = "red";
        flagDisplayRight.appendChild(errorMessageRight);
    }

    // Call initVis only if it hasn't already initialized
    initVis();
}

// Helper function to get the PNG file name for a given country name
function getFlagFileName(countryName) {
    const countryCode = countryNameToCode[countryName];
    if (!countryCode) {
        console.error(`Country code for "${countryName}" not found.`);
        return null; // Return null if the country name is not found
    }
    return `${countryCode.toLowerCase()}.png`;
}

// Initialize visualization on load
initVis();


// Initialize


// Test initialization





/*
countryFlagToName =
{
    "AD": "Andorra",
    "AE": "United Arab Emirates",
    "AF": "Afghanistan",
    "AG": "Antigua and Barbuda",
    "AI": "Anguilla",
    "AL": "Albania",
    "AM": "Armenia",
    "AO": "Angola",
    "AQ": "Antarctica",
    "AR": "Argentina",
    "AS": "American Samoa",
    "AT": "Austria",
    "AU": "Australia",
    "AW": "Aruba",
    //"AX": "\u00c5land Islands",
    "AZ": "Azerbaijan",
    "BA": "Bosnia and Herzegovina",
    "BB": "Barbados",
    "BD": "Bangladesh",
    "BE": "Belgium",
    "BF": "Burkina Faso",
    "BG": "Bulgaria",
    "BH": "Bahrain",
    "BI": "Burundi",
    "BJ": "Benin",
    "BL": "Saint Barthélemy",
    "BM": "Bermuda",
    "BN": "Brunei Darussalam",
    "BO": "Bolivia, Plurinational State of",
    "BQ": "Caribbean Netherlands",
    "BR": "Brazil",
    "BS": "Bahamas",
    "BT": "Bhutan",
    "BV": "Bouvet Island",
    "BW": "Botswana",
    "BY": "Belarus",
    "BZ": "Belize",
    "CA": "Canada",
    "CC": "Cocos (Keeling) Islands",
    "CD": "Congo, the Democratic Republic of the",
    "CF": "Central African Republic",
    "CG": "Republic of the Congo",
    "CH": "Switzerland",
    "CI": "Cote d'Ivoire",
    "CK": "Cook Islands",
    "CL": "Chile",
    "CM": "Cameroon",
    "CN": "China (People's Republic of China)",
    "CO": "Colombia",
    "CR": "Costa Rica",
    "CU": "Cuba",
    "CV": "Cape Verde",
    //"CW": "Cura\u00e7ao",
    "CX": "Christmas Island",
    "CY": "Cyprus",
    "CZ": "Czech Republic",
    "DE": "Germany",
    "DJ": "Djibouti",
    "DK": "Denmark",
    "DM": "Dominica",
    "DO": "Dominican Republic",
    "DZ": "Algeria",
    "EC": "Ecuador",
    "EE": "Estonia",
    "EG": "Egypt",
    "EH": "Western Sahara",
    "ER": "Eritrea",
    "ES": "Spain",
    "ET": "Ethiopia",
    "EU": "Europe",
    "FI": "Finland",
    "FJ": "Fiji",
    "FK": "Falkland Islands (Malvinas)",
    "FM": "Micronesia, Federated States of",
    "FO": "Faroe Islands",
    "FR": "France",
    "GA": "Gabon",
    "GB-ENG": "England",
    "GB-NIR": "Northern Ireland",
    "GB-SCT": "Scotland",
    "GB-WLS": "Wales",
    "GB": "United Kingdom",
    "GD": "Grenada",
    "GE": "Georgia",
    "GF": "French Guiana",
    "GG": "Guernsey",
    "GH": "Ghana",
    "GI": "Gibraltar",
    "GL": "Greenland",
    "GM": "Gambia",
    "GN": "Guinea",
    "GP": "Guadeloupe",
    "GQ": "Equatorial Guinea",
    "GR": "Greece",
    "GS": "South Georgia and the South Sandwich Islands",
    "GT": "Guatemala",
    "GU": "Guam",
    "GW": "Guinea-Bissau",
    "GY": "Guyana",
    "HK": "Hong Kong",
    "HM": "Heard Island and McDonald Islands",
    "HN": "Honduras",
    "HR": "Croatia",
    "HT": "Haiti",
    "HU": "Hungary",
    "ID": "Indonesia",
    "IE": "Ireland",
    "IL": "Israel",
    "IM": "Isle of Man",
    "IN": "India",
    "IO": "British Indian Ocean Territory",
    "IQ": "Iraq",
    "IR": "Iran, Islamic Republic of",
    "IS": "Iceland",
    "IT": "Italy",
    "JE": "Jersey",
    "JM": "Jamaica",
    "JO": "Jordan",
    "JP": "Japan",
    "KE": "Kenya",
    "KG": "Kyrgyzstan",
    "KH": "Cambodia",
    "KI": "Kiribati",
    "KM": "Comoros",
    "KN": "Saint Kitts and Nevis",
    "KP": "Korea, Democratic People's Republic of",
    "KR": "Korea, Republic of",
    "KW": "Kuwait",
    "KY": "Cayman Islands",
    "KZ": "Kazakhstan",
    "LA": "Laos (Lao People's Democratic Republic)",
    "LB": "Lebanon",
    "LC": "Saint Lucia",
    "LI": "Liechtenstein",
    "LK": "Sri Lanka",
    "LR": "Liberia",
    "LS": "Lesotho",
    "LT": "Lithuania",
    "LU": "Luxembourg",
    "LV": "Latvia",
    "LY": "Libya",
    "MA": "Morocco",
    "MC": "Monaco",
    "MD": "Moldova, Republic of",
    "ME": "Montenegro",
    "MF": "Saint Martin",
    "MG": "Madagascar",
    "MH": "Marshall Islands",
    "MK": "North Macedonia",
    "ML": "Mali",
    "MM": "Myanmar",
    "MN": "Mongolia",
    "MO": "Macao",
    "MP": "Northern Mariana Islands",
    "MQ": "Martinique",
    "MR": "Mauritania",
    "MS": "Montserrat",
    "MT": "Malta",
    "MU": "Mauritius",
    "MV": "Maldives",
    "MW": "Malawi",
    "MX": "Mexico",
    "MY": "Malaysia",
    "MZ": "Mozambique",
    "NA": "Namibia",
    "NC": "New Caledonia",
    "NE": "Niger",
    "NF": "Norfolk Island",
    "NG": "Nigeria",
    "NI": "Nicaragua",
    "NL": "Netherlands",
    "NO": "Norway",
    "NP": "Nepal",
    "NR": "Nauru",
    "NU": "Niue",
    "NZ": "New Zealand",
    "OM": "Oman",
    "PA": "Panama",
    "PE": "Peru",
    "PF": "French Polynesia",
    "PG": "Papua New Guinea",
    "PH": "Philippines",
    "PK": "Pakistan",
    "PL": "Poland",
    "PM": "Saint Pierre and Miquelon",
    "PN": "Pitcairn",
    "PR": "Puerto Rico",
    "PS": "Palestine",
    "PT": "Portugal",
    "PW": "Palau",
    "PY": "Paraguay",
    "QA": "Qatar",
    "RE": "Réunion",
    "RO": "Romania",
    "RS": "Serbia",
    "RU": "Russian Federation",
    "RW": "Rwanda",
    "SA": "Saudi Arabia",
    "SB": "Solomon Islands",
    "SC": "Seychelles",
    "SD": "Sudan",
    "SE": "Sweden",
    "SG": "Singapore",
    "SH": "Saint Helena, Ascension and Tristan da Cunha",
    "SI": "Slovenia",
    "SJ": "Svalbard and Jan Mayen Islands",
    "SK": "Slovakia",
    "SL": "Sierra Leone",
    "SM": "San Marino",
    "SN": "Senegal",
    "SO": "Somalia",
    "SR": "Suriname",
    "SS": "South Sudan",
    "ST": "Sao Tome and Principe",
    "SV": "El Salvador",
    "SX": "Sint Maarten (Dutch part)",
    "SY": "Syrian Arab Republic",
    "SZ": "Swaziland",
    "TC": "Turks and Caicos Islands",
    "TD": "Chad",
    "TF": "French Southern Territories",
    "TG": "Togo",
    "TH": "Thailand",
    "TJ": "Tajikistan",
    "TK": "Tokelau",
    "TL": "Timor-Leste",
    "TM": "Turkmenistan",
    "TN": "Tunisia",
    "TO": "Tonga",
    "TR": "Turkey",
    "TT": "Trinidad and Tobago",
    "TV": "Tuvalu",
    "TW": "Taiwan (Republic of China)",
    "TZ": "Tanzania, United Republic of",
    "UA": "Ukraine",
    "UG": "Uganda",
    "UM": "US Minor Outlying Islands",
    "US": "United States",
    "UY": "Uruguay",
    "UZ": "Uzbekistan",
    "VA": "Holy See (Vatican City State)",
    "VC": "Saint Vincent and the Grenadines",
    "VE": "Venezuela, Bolivarian Republic of",
    "VG": "Virgin Islands, British",
    "VI": "Virgin Islands, U.S.",
    "VN": "Vietnam",
    "VU": "Vanuatu",
    "WF": "Wallis and Futuna Islands",
    "WS": "Samoa",
    "XK": "Kosovo",
    "YE": "Yemen",
    "YT": "Mayotte",
    "ZA": "South Africa",
    "ZM": "Zambia",
    "ZW": "Zimbabwe"
}
*/