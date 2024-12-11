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
    "specimens (frozen)": "Preserved, frozen specimens for scientific research or storage in genetic banks.",
    "feet": "Feet of animals, often used in traditional practices or as decorative items.",
    "leather products (large)": "Large leather goods such as bags, jackets, or furniture, made from animal skins.",
    "logs": "Unprocessed timber from endangered tree species, traded for construction or crafting purposes.",
    "timber": "Processed or raw wood materials from endangered plant species, used in various industries.",
    "tusks": "Ivory tusks, commonly sourced from elephants, used in jewelry, carvings, or traditional medicine."
};

// Set dimensions for the SVG canvas
const width = 800;
const height = 600;
const margin = { top: 20, right: 40, bottom: 20, left: 40 };

// Create the SVG container
const svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add a legend container
const legend = d3.select("#chart")
    .append("div")
    .attr("id", "legend")
    .style("margin-top", "20px")
    .style("font-size", "14px")
    .style("text-align", "left")
    .style("position", "absolute")
    .style("top", "750px") // Positioning the legend further below the chart
    .style("width", "100%");

// Add a label to display the selected year
const yearLabel = d3.select("#chart")
    .append("div")
    .attr("id", "year-label")
    .style("text-align", "center")
    .style("font-size", "16px")
    .style("margin", "10px 0")
    .text("Year: ");

// Define a consistent color scale with unique colors
const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
    .domain([
        "live", "skulls", "leaves", "powder", "trophies", "scales", "skins", "specimens",
        "extract", "shells", "rug", "derivatives", "sawn wood", "carvings", "leather products (small)",
        "tissues", "specimens (frozen)", "feet", "leather products (large)", "logs", "timber", "tusks"
    ]);

// Load the data
d3.csv("/data/20-year-data.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        d["Importer reported quantity"] = +d["Importer reported quantity"] || 0;
        d["Exporter reported quantity"] = +d["Exporter reported quantity"] || 0;
        d.TotalQuantity = d["Importer reported quantity"] + d["Exporter reported quantity"];
    });

    const years = Array.from(new Set(data.map(d => d.Year))).sort();

    const summarizedData = d3.rollups(
        data,
        v => d3.sum(v, d => d.TotalQuantity),
        d => d.Year,
        d => d.Term
    ).map(([year, terms]) => ({
        year: year,
        terms: terms.map(([term, total]) => ({ term, total }))
    }));

    // Create year slider
    const slider = d3.select("#year-slider")
        .attr("min", d3.min(years))
        .attr("max", d3.max(years))
        .attr("step", 1)
        .on("input", function () {
            const selectedYear = +this.value;
            yearLabel.text(`Year: ${selectedYear}`); // Update the year label
            update(selectedYear);
        });

    function update(selectedYear) {
        const yearData = summarizedData.find(d => d.year === selectedYear)?.terms || [];

        const radiusScale = d3.scaleSqrt()
            .domain([0, d3.max(yearData, d => d.total) || 1])
            .range([10, 80]);

        // Use a simulation for non-overlapping circles
        const simulation = d3.forceSimulation(yearData)
            .force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 3).strength(0.05)) // Move circles higher up to avoid legend overlap
            .force("collide", d3.forceCollide(d => radiusScale(d.total) + 5))
            .stop();

        for (let i = 0; i < 300; i++) simulation.tick();

        const circles = svg.selectAll("circle")
            .data(yearData, d => d.term);

        circles.enter()
            .append("circle")
            .merge(circles)
            .transition()
            .duration(800)
            .attr("r", d => radiusScale(d.total))
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("fill", d => colorScale(d.term));

        circles.exit()
            .transition()
            .duration(800)
            .attr("r", 0)
            .remove();

        const labels = svg.selectAll("text")
            .data(yearData, d => d.term);

        labels.enter()
            .append("text")
            .merge(labels)
            .transition()
            .duration(800)
            .text(d => `${d.total}`)
            .attr("x", d => d.x)
            .attr("y", d => d.y + 5) // Center text better
            .attr("text-anchor", "middle")
            .style("font-size", d => `${Math.max(radiusScale(d.total) / 2, 10)}px`);

        labels.exit().remove();

        const legendItems = legend.selectAll("div")
            .data(yearData, d => d.term);

        legendItems.enter()
            .append("div")
            .merge(legendItems)
            .html(d => `
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${colorScale(d.term)}; margin-right: 10px;"></span>
                <strong>${d.term}</strong>: ${termDescriptions[d.term] || "Description not available"}
            `);

        legendItems.exit().remove();
    }

    const initialYear = years[0];
    slider.property("value", initialYear);
    yearLabel.text(`Year: ${initialYear}`); // Set initial year label
    update(initialYear);
});
