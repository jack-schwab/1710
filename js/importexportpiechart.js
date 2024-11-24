// Function to load CSV data
async function loadCSVData(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
    }
    const csvData = await response.text();
    return d3.csvParse(csvData, d3.autoType);
}

// Process data for visualization
function processData(data) {
    const importData = [];
    const exportData = [];

    data.forEach(row => {
        if (row["Importer reported quantity"]) {
            importData.push({
                Year: row.Year,
                Country: row.Importer,
                Quantity: row["Importer reported quantity"]
            });
        }

        if (row["Exporter reported quantity"]) {
            exportData.push({
                Year: row.Year,
                Country: row.Exporter,
                Quantity: row["Exporter reported quantity"]
            });
        }
    });

    return { importData, exportData };
}

// Helper function to filter data by year
function filterDataByYear(data, year) {
    const filtered = data.filter(d => d.Year == year);
    return {
        labels: filtered.map(d => d.Country),
        values: filtered.map(d => d.Quantity)
    };
}

// Function to update pie charts
function updateCharts(importData, exportData, year) {
    const filteredImport = filterDataByYear(importData, year);
    const filteredExport = filterDataByYear(exportData, year);

    // Import Pie Chart
    Plotly.newPlot('import-chart', [{
        type: 'pie',
        labels: filteredImport.labels,
        values: filteredImport.values,
        textinfo: 'label+percent',
        hoverinfo: 'label+value'
    }], {
        title: `Import Distribution for ${year}`,
        height: 400,
        width: 400
    });

    // Export Pie Chart
    Plotly.newPlot('export-chart', [{
        type: 'pie',
        labels: filteredExport.labels,
        values: filteredExport.values,
        textinfo: 'label+percent',
        hoverinfo: 'label+value'
    }], {
        title: `Export Distribution for ${year}`,
        height: 400,
        width: 400
    });
}

// Initialize the visualization
async function initVisualization(csvPath) {
    try {
        const rawData = await loadCSVData(csvPath);
        const { importData, exportData } = processData(rawData);

        // Initialize dropdown with years
        const years = [...new Set(importData.map(d => d.Year))];
        const dropdown = document.getElementById('year-select2');
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            dropdown.appendChild(option);
        });

        // Initial render
        updateCharts(importData, exportData, years[0]);

        // Update charts on dropdown change
        dropdown.addEventListener('change', (e) => {
            const selectedYear = e.target.value;
            updateCharts(importData, exportData, selectedYear);
        });
    } catch (error) {
        console.error("Error initializing visualization:", error);
    }
}

// Path to the CSV file
const csvFilePath = '/data/20 year data.csv';

// Start the visualization
initVisualization(csvFilePath);
