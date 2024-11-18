// Set dimensions for the SVG canvas
const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

// Create the SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load the data from CSV
d3.csv("data.csv").then(data => {
    // Process the data: Ensure numeric fields are parsed correctly
    data.forEach(d => {
        d.Year = +d.Year;
        d["Importer reported quantity"] = +d["Importer reported quantity"] || 0;
        d["Exporter reported quantity"] = +d["Exporter reported quantity"] || 0;
        d.TotalQuantity = d["Importer reported quantity"] + d["Exporter reported quantity"];
    });

    // Summarize data by Year and Term
    const summarizedData = d3.rollups(
        data,
        v => d3.sum(v, d => d.TotalQuantity),
        d => d.Year,
        d => d.Term
    ).map(([year, terms]) => ({
        year: year,
        terms: terms.map(([term, total]) => ({ term, total }))
    }));

    // Extract available years
    const years = summarizedData.map(d => d.year);

    // Create the dropdown
    const dropdown = d3.select("#year-select");

    dropdown.selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Function to update visualization based on selected year
    function update(selectedYear) {
        // Find data for the selected year
        const yearData = summarizedData.find(d => d.year == selectedYear)?.terms || [];

        // Set up scales
        const radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(yearData, d => d.total) || 1]) // Avoid errors if data is empty
            .range([10, 50]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Bind data to circles
        const circles = svg.selectAll("circle")
            .data(yearData, d => d.term);

        // Enter: Add new circles
        circles.enter()
            .append("circle")
            .attr("cx", (_, i) => (i + 1) * (width / (yearData.length + 1)))
            .attr("cy", height / 2)
            .attr("r", 0)
            .attr("fill", d => colorScale(d.term))
            .merge(circles)
            .transition()
            .duration(800)
            .attr("r", d => radiusScale(d.total));

        // Update: Modify existing circles
        circles
            .transition()
            .duration(800)
            .attr("cx", (_, i) => (i + 1) * (width / (yearData.length + 1)))
            .attr("cy", height / 2)
            .attr("r", d => radiusScale(d.total))
            .attr("fill", d => colorScale(d.term));

        // Exit: Remove old circles
        circles.exit()
            .transition()
            .duration(800)
            .attr("r", 0)
            .remove();

        // Add labels for terms
        const labels = svg.selectAll("text")
            .data(yearData, d => d.term);

        labels.enter()
            .append("text")
            .attr("x", (_, i) => (i + 1) * (width / (yearData.length + 1)))
            .attr("y", height / 2 + 60)
            .attr("text-anchor", "middle")
            .merge(labels)
            .transition()
            .duration(800)
            .text(d => `${d.term}: ${d.total}`);

        labels.exit().remove();
    }

    // Set the initial year and render the chart
    const initialYear = years[0];
    dropdown.property("value", initialYear);
    update(initialYear);

    // Update the chart when a new year is selected
    dropdown.on("change", function () {
        const selectedYear = d3.select(this).property("value");
        update(selectedYear);
    });
});
