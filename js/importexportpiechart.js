// Data for import and export
const importData = [
    { Year: 2017, Country: "CD", Quantity: 9 },
    { Year: 2017, Country: "GH", Quantity: 0 },
    { Year: 2017, Country: "NG", Quantity: 0 },
];

const exportData = [
    { Year: 2017, Country: "ZA", Quantity: 7766 },
];

// Extract unique years
const years = [...new Set(importData.map(d => d.Year))];

// Append years to the dropdown
const dropdown = d3.select("#year-dropdown");
dropdown.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

// Function to create pie chart
const createPieChart = (data, selector, colorScale) => {
    const svg = d3.select(selector).select("svg");
    const width = svg.attr("width");
    const height = svg.attr("height");
    const radius = Math.min(width, height) / 2;

    const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie().value(d => d.Quantity);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    return year => {
        const filteredData = data.filter(d => d.Year === year);
        g.selectAll("*").remove();

        g.selectAll("path")
            .data(pie(filteredData))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", d => colorScale(d.data.Country))
            .append("title")
            .text(d => `${d.data.Country}: ${d.data.Quantity}`);
    };
};

// Color scales
const importColor = d3.scaleOrdinal(d3.schemeCategory10);
const exportColor = d3.scaleOrdinal(d3.schemeSet2);

// Create the pie charts
const updateImportChart = createPieChart(importData, "#import-chart", importColor);
const updateExportChart = createPieChart(exportData, "#export-chart", exportColor);

// Update charts on dropdown selection
dropdown.on("change", function() {
    const selectedYear = +this.value;
    updateImportChart(selectedYear);
    updateExportChart(selectedYear);
});

// Initialize with the first year
dropdown.property("value", years[0]).dispatch("change");
