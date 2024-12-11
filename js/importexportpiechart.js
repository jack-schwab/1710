const countryFullNames = {
    "CD": "Democratic Republic of the Congo",
    "ZA": "South Africa",
    "TZ": "Tanzania",
    "NG": "Nigeria",
    "GH": "Ghana",
    // Add all necessary abbreviations and their full names
};

// Function to load CSV data
async function loadCSVData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load CSV: ${filePath}`);
        const csvData = await response.text();
        return d3.csvParse(csvData, d3.autoType);
    } catch (error) {
        console.error("Error loading CSV data:", error);
    }
}

// Process data for visualization
function processData(data) {
    const importData = [];
    const exportData = [];

    data.forEach(row => {
        const importQty = row["Importer reported quantity"] || 0; // Handle NaN as 0
        const exportQty = row["Exporter reported quantity"] || 0; // Handle NaN as 0

        if (importQty > 0) {
            importData.push({
                Year: row.Year,
                Abbreviation: row.Importer,
                FullName: countryFullNames[row.Importer] || row.Importer, // Map to full name
                Quantity: importQty
            });
        }

        if (exportQty > 0) {
            exportData.push({
                Year: row.Year,
                Abbreviation: row.Exporter,
                FullName: countryFullNames[row.Exporter] || row.Exporter, // Map to full name
                Quantity: exportQty
            });
        }
    });

    return { importData, exportData };
}

// Helper function to filter data by year
function filterDataByYear(data, year) {
    const filtered = data.filter(d => d.Year == year);
    return {
        labels: filtered.map(d => d.Abbreviation), // Use abbreviations for labels
        values: filtered.map(d => d.Quantity),
        hoverText: filtered.map(d => d.FullName) // Use full names for hover text
    };
}

function updateCharts(importData, exportData, year) {
    const filteredImport = filterDataByYear(importData, year);
    const filteredExport = filterDataByYear(exportData, year);

    // Import Pie Chart
    Plotly.react('import-chart', [{
        type: 'pie',
        labels: filteredImport.labels, // Abbreviations
        values: filteredImport.values,
        textinfo: 'label+percent',
        hoverinfo: 'text+value', // Full names appear on hover
        text: filteredImport.hoverText // Full names for hover text
    }], {
        title: `Import Distribution for ${year}`,
        height: 400,
        width: 400
    }, {
        transition: {
            duration: 500, // Smooth transition duration in milliseconds
            easing: 'cubic-in-out' // Easing effect
        }
    });

    // Export Pie Chart
    Plotly.react('export-chart', [{
        type: 'pie',
        labels: filteredExport.labels, // Abbreviations
        values: filteredExport.values,
        textinfo: 'label+percent',
        hoverinfo: 'text+value', // Full names appear on hover
        text: filteredExport.hoverText // Full names for hover text
    }], {
        title: `Export Distribution for ${year}`,
        height: 400,
        width: 400
    }, {
        transition: {
            duration: 2000, // Smooth transition duration in milliseconds
            easing: 'ease-in-out' // Easing effect
        }
    });
}

// Function to create and animate the timeline
function createTimeline(years) {
    const timelineContainer = document.createElement("div");
    timelineContainer.id = "timeline-container";
    timelineContainer.style.display = "flex";
    timelineContainer.style.flexWrap = "wrap";
    timelineContainer.style.justifyContent = "center";
    timelineContainer.style.alignItems = "center";
    timelineContainer.style.margin = "1em 0";

    // Create individual year markers
    years.forEach((year, index) => {
        const yearMarker = document.createElement("div");
        yearMarker.className = "timeline-year";
        yearMarker.textContent = year;
        yearMarker.style.padding = "0.5em 1em";
        yearMarker.style.margin = "0.2em";
        yearMarker.style.borderRadius = "5px";
        yearMarker.style.transition = "background-color 0.5s, color 0.5s";
        yearMarker.style.backgroundColor = "#ddd";
        yearMarker.style.color = "#333";
        yearMarker.dataset.index = index;
        timelineContainer.appendChild(yearMarker);
    });

    document.getElementById("pi-chart-section").appendChild(timelineContainer);
}

function highlightYear(index, years) {
    const timelineYears = document.querySelectorAll(".timeline-year");
    timelineYears.forEach((yearMarker, i) => {
        if (i === index) {
            yearMarker.style.backgroundColor = "#007bff"; // Highlight color
            yearMarker.style.color = "#fff"; // Text color
        } else {
            yearMarker.style.backgroundColor = "#ddd"; // Default background
            yearMarker.style.color = "#333"; // Default text color
        }
    });
}

// Modified startAnimation function to include timeline animation
function startAnimation(importData, exportData, years) {
    let index = 0; // Start with the first year
    const intervalDuration = 2000; // Duration for each year (in milliseconds)

    // Stop any existing interval before starting a new one
    if (window.yearAnimationInterval) {
        clearInterval(window.yearAnimationInterval);
    }

    // Start the animation
    window.yearAnimationInterval = setInterval(() => {
        const currentYear = years[index];
        updateCharts(importData, exportData, currentYear);

        // Highlight the current year in the timeline
        highlightYear(index, years);

        // Update the display to show the current year
        const yearDisplay = document.getElementById("year-display");
        yearDisplay.textContent = `Year: ${currentYear}`;

        // Move to the next year
        index = (index + 1) % years.length; // Loop back to the start
    }, intervalDuration);
}

// Initialize the visualization with animation and timeline
async function initVisualizationWithAnimation(csvPath) {
    try {
        const rawData = await loadCSVData(csvPath);
        if (!rawData) throw new Error("No data loaded");
        const { importData, exportData } = processData(rawData);

        // Get unique years and sort them
        const years = [...new Set(importData.map(d => d.Year))].sort();

        // Create a display for the current year
        const yearDisplay = document.createElement("div");
        yearDisplay.id = "year-display";
        yearDisplay.style.fontSize = "1.5em";
        yearDisplay.style.textAlign = "center";
        yearDisplay.style.marginBottom = "1em";
        document.getElementById("pi-chart-section").prepend(yearDisplay);

        // Create the timeline
        createTimeline(years);

        // Start the timeline animation
        startAnimation(importData, exportData, years);
    } catch (error) {
        console.error("Error initializing visualization:", error);
    }
}

// Set the file path to the uploaded CSV
const csvFilePath = 'data/20-year-data.csv';
initVisualizationWithAnimation(csvFilePath);