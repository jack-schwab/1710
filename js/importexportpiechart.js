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

// Initialize the visualization
async function initVisualization(csvPath) {
    try {
        const rawData = await loadCSVData(csvPath);
        if (!rawData) throw new Error("No data loaded");
        const { importData, exportData } = processData(rawData);

        // Populate dropdown with unique years
        const years = [...new Set(importData.map(d => d.Year))];
        const dropdown = document.getElementById('year-selector');
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            dropdown.appendChild(option);
        });

        // Render initial charts with the first year
        updateCharts(importData, exportData, years[0]);

        // Update charts on year selection
        dropdown.addEventListener('change', (e) => {
            const selectedYear = e.target.value;
            updateCharts(importData, exportData, selectedYear);
        });
    } catch (error) {
        console.error("Error initializing visualization:", error);
    }
}

// Set the file path to the uploaded CSV
const csvFilePath = 'data/20-year-data.csv';
initVisualization(csvFilePath);
