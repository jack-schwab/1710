// Dictionary for term meanings
const termDescriptions = {
    "live": "Refers to live animals traded for zoos, breeding programs, the pet trade, or other uses.",
    "skulls": "Specimens of animal skulls, often traded for scientific research, education, or trophy collections.",
    "leaves": "Plant leaves harvested and traded for medicinal use, ornamental purposes, or traditional practices.",
    "powder": "Powdered parts of plants or animals, commonly used in traditional medicine or cosmetic products.",
    "trophies": "Animal parts such as heads, horns, or skins, typically obtained through hunting and displayed as trophies.",
    "scales": "Scales from reptiles, especially pangolins, used in traditional medicine or jewelry.",
    "skins": "Animal skins used for fashion, leather goods, or decoration.",
    "specimens": "Whole specimens (plants or animals), preserved and traded for education, research, or display.",
    "extract": "Chemical or natural extracts derived from plants or animals, often used in pharmaceuticals or cosmetics.",
    "shells": "Shells of animals like turtles, traded for decoration, jewelry, or traditional crafts.",
    "rug": "Animal skins processed into rugs, often representing species with unique patterns or colors.",
    "derivatives": "Byproducts derived from plants or animals, including oils, powders, and chemical compounds.",
    "sawn wood": "Processed wood from endangered plant species, often traded for furniture or construction materials.",
    "carvings": "Handcrafted items made from endangered woods or animal parts, used as decorative pieces.",
    "leather products (small)": "Small leather items made from animal skins, including belts, wallets, or shoes.",
    "tissues": "Biological tissues from animals or plants used for scientific research or industrial applications.",
    "specimens (frozen)": "Preserved, frozen specimens for scientific research or storage in genetic banks."
};


// Set dimensions for the SVG canvas
const width = 800;
const height = 600;
const margin = { top: 20, right: 20, bottom: 20, left: 20 };

// Create the SVG container
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Add a legend container
const legend = d3.select("#chart")
    .append("div")
    .attr("id", "legend")
    .style("margin-top", "20px")
    .style("font-size", "14px")
    .style("text-align", "left");

// Load the data from the CSV file
d3.csv("/data/data1.csv").then(data => {
    // Process the data: Ensure numeric fields are parsed correctly
    data.forEach(d => {
        d.Year = +d.Year; // Convert Year to a number
        d["Importer reported quantity"] = +d["Importer reported quantity"] || 0;
        d["Exporter reported quantity"] = +d["Exporter reported quantity"] || 0;
        d.TotalQuantity = d["Importer reported quantity"] + d["Exporter reported quantity"];
    });

    // Extract unique years
    const years = Array.from(new Set(data.map(d => d.Year))).sort();

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

    // Populate the dropdown with years
    const dropdown = d3.select("#year-select");

    dropdown.selectAll("option")
        .data(years)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d);

    // Function to update the visualization based on the selected year
    function update(selectedYear) {
        // Find data for the selected year
        const yearData = summarizedData.find(d => d.year == selectedYear)?.terms || [];

        // Set up scales
        const radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(yearData, d => d.total) || 1]) // Avoid errors if data is empty
            .range([40, 100]); // Larger circles

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Create a grid-like layout for circles
        const gridCols = Math.ceil(Math.sqrt(yearData.length));
        const gridRows = Math.ceil(yearData.length / gridCols);
        const gridSpacingX = width / (gridCols + 1);
        const gridSpacingY = height / (gridRows + 1);

        // Bind data to circles
        const circles = svg.selectAll("circle")
            .data(yearData, d => d.term);

        // Enter: Add new circles
        circles.enter()
            .append("circle")
            .attr("cx", (_, i) => ((i % gridCols) + 1) * gridSpacingX)
            .attr("cy", (_, i) => Math.floor(i / gridCols + 1) * gridSpacingY)
            .attr("r", 0)
            .attr("fill", d => colorScale(d.term))
            .merge(circles)
            .transition()
            .duration(800)
            .attr("r", d => radiusScale(d.total))
            .attr("cx", (_, i) => ((i % gridCols) + 1) * gridSpacingX)
            .attr("cy", (_, i) => Math.floor(i / gridCols + 1) * gridSpacingY);

        // Update: Modify existing circles
        circles
            .transition()
            .duration(800)
            .attr("cx", (_, i) => ((i % gridCols) + 1) * gridSpacingX)
            .attr("cy", (_, i) => Math.floor(i / gridCols + 1) * gridSpacingY)
            .attr("r", d => radiusScale(d.total))
            .attr("fill", d => colorScale(d.term));

        // Exit: Remove old circles
        circles.exit()
            .transition()
            .duration(800)
            .attr("r", 0)
            .remove();

        // Add labels inside the circles
        const labels = svg.selectAll("text")
            .data(yearData, d => d.term);

        labels.enter()
            .append("text")
            .attr("x", (_, i) => ((i % gridCols) + 1) * gridSpacingX)
            .attr("y", (_, i) => Math.floor(i / gridCols + 1) * gridSpacingY)
            .attr("dy", "0.35em") // Center text vertically
            .attr("text-anchor", "middle")
            .style("font-size", d => `${Math.min(radiusScale(d.total) / 3, 14)}px`) // Dynamic font size
            .merge(labels)
            .transition()
            .duration(800)
            .text(d => `${d.term}: ${d.total}`)
            .attr("x", (_, i) => ((i % gridCols) + 1) * gridSpacingX)
            .attr("y", (_, i) => Math.floor(i / gridCols + 1) * gridSpacingY);

        labels.exit().remove();

        // Update legend
        const legendItems = legend.selectAll("div")
            .data(yearData, d => d.term);

        // Enter: Add legend items
        legendItems.enter()
            .append("div")
            .merge(legendItems)
            .html(d => `
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${colorScale(d.term)}; margin-right: 10px;"></span>
                <strong>${d.term}</strong>: ${termDescriptions[d.term] || "Description not available"}
            `);

        // Remove unused legend items
        legendItems.exit().remove();
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
    let config = [
        {key: "Taxon", title: "Species"}];
    let barchart = new BarChart("bar-chart", data, config[0]);
});
