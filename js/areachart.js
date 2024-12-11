// Bar chart configurations for different aspects of the data
let configs = [
    {key: "Class", title: "Species Class Distribution"},
    {key: "Order", title: "Order Distribution"},
    {key: "Family", title: "Family Distribution"},
    {key: "Taxon", title: "Taxon Distribution"}
];


// Area Chart Class
class AreaChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;
        this.displayData = [];
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 10, bottom: 20, left: 100};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right - 40;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(6);

        // Append axes
        vis.svg.append("g")
            .attr("class", "y-axis axis");

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        // Area path
        vis.timePath = vis.svg.append("path")
            .attr("class", "area");

        // Initialize brush component
        vis.brush = d3.brushX()
            .extent([[0, 0], [vis.width, vis.height]])
            .on("brush end", brushed);

        vis.svg.append("g")
            .attr("class", "brush")
            .call(vis.brush);

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // Group data by year and sum trade volumes
        let yearlyData = d3.rollup(
            vis.data,
            v => d3.sum(v, d => Math.max(d["Importer reported quantity"], d["Exporter reported quantity"])),
            d => d.Year
        );

        // Convert to array format
        vis.displayData = Array.from(yearlyData, ([year, value]) => ({
            date: new Date(year, 0),
            value: value
        })).sort((a, b) => a.date - b.date);

        this.updateVis();
    }

    updateVis() {
        let vis = this;

        // Update domains
        vis.x.domain(d3.extent(vis.displayData, d => d.date));
        vis.y.domain([0, d3.max(vis.displayData, d => d.value)]);

        // Area generator
        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(d => vis.x(d.date))
            .y0(vis.height)
            .y1(d => vis.y(d.value));

        // Update area path
        vis.timePath
            .datum(vis.displayData)
            .attr("d", area)
            .attr("fill", "steelblue")
            .attr("fill-opacity", 0.5);

        // Update axes
        vis.svg.select(".y-axis").call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

        d3.select(`#${vis.parentElement} svg`)
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("viewBox", `0 0 ${vis.width + vis.margin.left + vis.margin.right} ${vis.height + vis.margin.top + vis.margin.bottom}`);
    }
}

// Bar Chart Class
class BarChart {
    constructor(parentElement, data, config) {
        this.parentElement = parentElement;
        this.data = data;
        this.config = config;
        this.originalData = data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 50, bottom: 30, left: 100};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right -40;
        vis.height = 200 - vis.margin.top - vis.margin.bottom;

        // Create SVG area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales
        vis.y = d3.scaleBand()
            .range([0, vis.height])  // Changed from [vis.height, 0] to [0, vis.height]
            .paddingInner(0.1)
            .paddingOuter(0.1);

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);

        // Axes
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .ticks(5);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        // Append axes
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        // Group by the specified category
        let categoryCounts = d3.rollup(
            vis.data,
            v => d3.sum(v, d => Math.max(d["Importer reported quantity"], d["Exporter reported quantity"])),
            d => d[vis.config.key] || "Unknown"
        );

        // Convert to array and sort
        vis.displayData = Array.from(categoryCounts, ([category, count]) => ({
            category,
            count
        }))
            .filter(d => d.category !== "Unknown" && d.count > 0)
            .sort((a, b) => b.count - a.count)
            .slice(0, 4); // Top 8 categories


        this.updateVis();
    }

    updateVis() {
        let vis = this;

        vis.y.domain(vis.displayData.map(d => d.category));
        vis.x.domain([0, d3.max(vis.displayData, d => d.count)]);

        let bars = vis.svg.selectAll(".bar")
            .data(vis.displayData);

        // Enter + Update
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .merge(bars)
            .attr("x", 0)
            .attr("y", d => vis.y(d.category))
            .attr("width", d => vis.x(d.count))
            .attr("height", vis.y.bandwidth())
            .attr("fill", "steelblue");

        bars.exit().remove();

        // Add labels
        let labels = vis.svg.selectAll(".bar-label")
            .data(vis.displayData, d => d.category);

        labels.enter()
            .append("text")
            .attr("class", "bar-label")
            .merge(labels)
            .transition()
            .duration(500)
            .attr("y", d => vis.y(d.category) + vis.y.bandwidth() / 2)
            .attr("x", d => vis.x(d.count) + 5)
            .attr("dy", ".35em")
            .text(d => Math.round(d.count));

        // Remove old elements
        bars.exit().remove();
        labels.exit().remove();

        // Update axes
        vis.svg.select(".x-axis").transition().duration(500).call(vis.xAxis);
        vis.svg.select(".y-axis").transition().duration(500).call(vis.yAxis);

        d3.select(`#${vis.parentElement} svg`)
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("viewBox", `0 0 ${vis.width + vis.margin.left + vis.margin.right} ${vis.height + vis.margin.top + vis.margin.bottom}`);
    }

    selectionChanged(timeRange) {
        let vis = this;

        // Filter data based on selected time range
        vis.data = vis.originalData.filter(d => {
            return d.date >= timeRange[0] && d.date <= timeRange[1];
        });

        vis.wrangleData();
    }
}

// Initialize variables to save the charts
let barcharts = [];
let areachart;

// Load and process the data
d3.csv("data/20-year-data.csv").then(data => {
    // Process dates and quantities
    data.forEach(d => {
        d.date = new Date(d.Year, 0);
        d["Importer reported quantity"] = +d["Importer reported quantity"] || 0;
        d["Exporter reported quantity"] = +d["Exporter reported quantity"] || 0;
    });

    // Create area chart
    areachart = new AreaChart("area-chart", data);

    // Create bar charts for different aspects
    ["class", "order", "family", "taxon"].forEach((category, i) => {
        let barchart = new BarChart(`bar-chart-${category}`, data, configs[i]);
        barcharts.push(barchart);
    });
});

// Brush event handler
function brushed(event) {
    if (!event.selection) return;
    let timeRange = event.selection.map(areachart.x.invert);
    barcharts.forEach(chart => chart.selectionChanged(timeRange));
}

