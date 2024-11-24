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
                Country: row.Importer,
                Quantity: importQty
            });
        }

        if (exportQty > 0) {
            exportData.push({
                Year: row.Year,
                Country: row.Exporter,
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
        if (!rawData) throw new Error("No data loaded");
        const { importData, exportData } = processData(rawData);

        // Populate dropdown with unique years
        const years = [...new Set(importData.map(d => d.Year))];
<<<<<<< Updated upstream
        const dropdown = document.getElementById('year-select2');
=======
        const dropdown = document.getElementById('year-selector');
>>>>>>> Stashed changes
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
