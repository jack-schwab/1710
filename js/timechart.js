// List of CSV files and their associated years
const filePaths = ["data/1979_africa.csv", "data/1990_africa.csv", "data/2001_africa.csv", "data/2012_africa.csv"];

// Helper function to load all CSV files and process data
async function loadAndProcessData() {
    console.log("Starting to load and process data...");
    console.log("CSV file paths:", filePaths);

    const allData = [];

    for (const file of filePaths) {
        console.log(`Loading file: ${file}`);

        const data = await d3.csv(file, d => {
            const year = +d['Year']; // Parse the actual year from the CSV
            const importerQuantity = +d['Importer reported quantity'];
            const exporterQuantity = +d['Exporter reported quantity'];

            // Check if quantities and year are valid
            if (isNaN(year) || (isNaN(importerQuantity) && isNaN(exporterQuantity))) {
                console.warn(`Skipping invalid row in file ${file}:`, d);
                return null; // Skip invalid rows
            }

            //console.log(`Processed row:`, { year, importerQuantity, exporterQuantity });

            return {
                year: year,
                importerQuantity: importerQuantity || 0,
                exporterQuantity: exporterQuantity || 0
            };
        });

        console.log(`Loaded data from ${file}:`, data);
        allData.push(...data.filter(d => d !== null)); // Filter out invalid rows
        console.log(`Current combined data length: ${allData.length}`);
    }

    console.log("All data loaded. Combining and aggregating by year...");

    // Aggregate data by year
    const aggregatedData = d3.rollups(
        allData.filter(d => !isNaN(d.year)), // Ensure year is not NaN
        v => {
            const total = d3.sum(v, d => d.importerQuantity + d.exporterQuantity);
            console.log(`Year: ${v[0]?.year}, Total Quantity: ${total}`);
            return total;
        },
        d => d.year
    ).map(([year, totalQuantity]) => {
        console.log(`Aggregated data for year ${year}:`, totalQuantity);
        return { year, totalQuantity };
    });

    console.log("Final aggregated data before sorting:", aggregatedData);

    const sortedData = aggregatedData.sort((a, b) => a.year - b.year);
    console.log("Aggregated data sorted by year:", sortedData);

    return sortedData; // Sorted by year
}
// Declare and attach global variables to the window object
window.startYear = null;
window.endYear = null;

// Function to draw the area charat with a brush
function drawChart(data) {
    console.log("Drawing chart with data:", data);

    const width = 800;
    const height = 400;
    const margin = { top: 50, right: 30, bottom: 50, left: 50 };

    console.log("Chart dimensions:", { width, height, margin });

    // Create SVG container
    const svg = d3.select("#time-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    console.log("SVG container created.");

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalQuantity)])
        .range([height - margin.bottom, margin.top]);

    console.log("Scales created. X scale domain:", xScale.domain(), "Y scale domain:", yScale.domain());

    // Draw X and Y axes
    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d"))); // Format years as integers

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

    console.log("Axes drawn.");

    // Area generator
    const area = d3.area()
        .x(d => xScale(d.year))
        .y0(height - margin.bottom) // Baseline for the area
        .y1(d => yScale(d.totalQuantity))
        .curve(d3.curveMonotoneX); // Smooth curve

    console.log("Area generator created.");

    // Draw the area
    svg.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7)
        .attr("d", area);

    console.log("Area chart drawn.");

    const brush = d3.brushX()
        .extent([[margin.left, 0], [width - margin.right, height - margin.bottom]])
        .on("brush end", function () {
            const selection = d3.event.selection; // Access global event
            console.log("Brush 'end' event:", d3.event);
            console.log("Selection during 'end':", selection);

            if (selection) {
                // Update global variables
                window.startYear = Math.floor(xScale.invert(selection[0])); // Round down to nearest year
                window.endYear = Math.ceil(xScale.invert(selection[1]));   // Round up to nearest year
                console.log(`Selection made: Start Year = ${window.startYear}, End Year = ${window.endYear}`);

                // Update visualization if applicable
                if (typeof window.myMapVis !== "undefined" && typeof window.myMapVis.wrangleData === "function") {
                    window.myMapVis.wrangleData(window.startYear, window.endYear);
                    window.myMapVis.updateVis();
                }
            } else {
                console.log("No selection (brush cleared).");
            }
        });



    const brushGroup = svg.append("g")
        .attr("class", "brush")
        .call(brush);

    console.log("Brush added.");
}


// Load data and draw chart
loadAndProcessData()
    .then(data => {
        console.log("Data successfully loaded and processed. Proceeding to draw chart.");
        drawChart(data);
    })
    .catch(error => {
        console.error("An error occurred during data loading or chart drawing:", error);
    });
