class BarChartAnimals {
	constructor(parentElement, data, trendData, config) {
		this.parentElement = parentElement;
		this.data = data;
		this.trendData = trendData; // Preprocessed trend data
		this.config = {
			margin: { top: 40, right: 60, bottom: 80, left: 180 },
			height: 400,
			width: 1200,
			transitionDuration: 1000,
			barColor: "#4682b4",
			hoverColor: "#2c5282",
			selectedColor: "#1d3557",
			...config,
		};

		this.displayData = data;
		this.initVis();
	}

	initVis() {
		let vis = this;

		vis.width = vis.config.width - vis.config.margin.left - vis.config.margin.right;
		vis.height = vis.config.height - vis.config.margin.top - vis.config.margin.bottom;

		d3.select("#" + vis.parentElement).select("svg").remove(); // Remove any existing chart

		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
			.attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
			.append("g")
			.attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

		vis.x = d3.scaleLinear().range([0, vis.width]);
		vis.y = d3.scaleBand()
			.rangeRound([vis.height, 0])
			.paddingInner(0.2);

		vis.xAxis = d3.axisBottom(vis.x)
			.ticks(5)
			.tickFormat(d3.format(",d"))
			.tickSizeOuter(0);

		vis.yAxis = d3.axisLeft(vis.y)
			.tickSizeOuter(0);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", `translate(0,${vis.height})`);

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		vis.svg.append("text")
			.attr("class", "x-axis-label")
			.attr("x", vis.width / 2)
			.attr("y", vis.height + 50)
			.style("text-anchor", "middle")
			.text("Total Quantity Traded");

		vis.svg.append("text")
			.attr("class", "y-axis-label")
			.attr("transform", "rotate(-90)")
			.attr("y", -vis.config.margin.left + 20)
			.attr("x", -(vis.height / 2))
			.style("text-anchor", "middle")
			.text("Mammal Species");

		vis.tooltip = d3.select("#tooltip-container")
			.style("opacity", 0)
			.style("position", "absolute");

		vis.selectedBar = null; // Track the selected bar

		vis.wrangleData();
	}

	wrangleData() {
		let vis = this;

		// Filter for mammals and sum quantities by species
		let mammalData = vis.data.filter(d => d.Class === "Mammalia");

		let groupedData = d3.rollup(
			mammalData,
			leaves => d3.sum(leaves, d => d.Quantity || 0),
			d => d.Taxon
		);

		let dataArray = Array.from(groupedData, ([key, value]) => ({ key, value }));

		// Get the top 5 traded mammals
		vis.displayData = dataArray.sort((a, b) => b.value - a.value).slice(0, 5);

		// Extract trend data for the top 5 mammals
		vis.trendData = mammalData.filter(d => vis.displayData.some(m => m.key === d.Taxon));

		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
		vis.y.domain(vis.displayData.map(d => d.key));

		vis.svg.select(".x-axis")
			.transition()
			.duration(vis.config.transitionDuration)
			.call(vis.xAxis);

		vis.svg.select(".y-axis")
			.transition()
			.duration(vis.config.transitionDuration)
			.call(vis.yAxis);

		let bars = vis.svg.selectAll(".bar")
			.data(vis.displayData, d => d.key);

		bars.exit()
			.transition()
			.duration(vis.config.transitionDuration)
			.attr("width", 0)
			.remove();

		let barsEnter = bars.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("y", d => vis.y(d.key))
			.attr("height", vis.y.bandwidth())
			.attr("width", 0)
			.attr("fill", vis.config.barColor);

		barsEnter
			.merge(bars)
			.transition()
			.duration(vis.config.transitionDuration)
			.attr("x", 0)
			.attr("y", d => vis.y(d.key))
			.attr("width", d => vis.x(d.value))
			.attr("height", vis.y.bandwidth())
			.attr("fill", d => vis.selectedBar === d.key ? vis.config.selectedColor : vis.config.barColor);

		barsEnter
			.merge(bars)
			.on("mouseover", (event, d) => {
				d3.select(event.currentTarget)
					.attr("fill", vis.config.hoverColor);

				let speciesTrend = vis.trendData.filter(trend => trend.Taxon === d.key);

				let xScale = d3.scaleLinear()
					.domain(d3.extent(speciesTrend, d => d.Year))
					.range([0, 250]);

				let yScale = d3.scaleLinear()
					.domain([0, d3.max(speciesTrend, d => d.Quantity)])
					.range([150, 0]);

				let line = d3.line()
					.curve(d3.curveMonotoneX)
					.x(d => xScale(d.Year))
					.y(d => yScale(d.Quantity));

				const tooltipContent = d3.select("#tooltip-container")
					.html("")
					.append("svg")
					.attr("width", 300)
					.attr("height", 200);

				tooltipContent
					.append("path")
					.datum(speciesTrend)
					.attr("fill", "none")
					.attr("stroke", "#4682b4")
					.attr("stroke-width", 2)
					.attr("d", line);

				tooltipContent.append("g")
					.selectAll("circle")
					.data(speciesTrend)
					.enter()
					.append("circle")
					.attr("cx", d => xScale(d.Year))
					.attr("cy", d => yScale(d.Quantity))
					.attr("r", 3)
					.attr("fill", "#4682b4");

				tooltipContent.append("text")
					.attr("x", 150)
					.attr("y", 15)
					.attr("text-anchor", "middle")
					.attr("font-size", "14px")
					.attr("font-weight", "bold")
					.text(`${d.key} Trade Trends`);

				d3.select("#tooltip-container")
					.style("opacity", 1)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 10) + "px");
			})
			.on("mouseout", (event, d) => {
				d3.select(event.currentTarget)
					.attr("fill", d => vis.selectedBar === d.key ? vis.config.selectedColor : vis.config.barColor);
				d3.select("#tooltip-container").style("opacity", 0);
			})
			.on("click", (event, d) => {
				vis.selectedBar = vis.selectedBar === d.key ? null : d.key;
				vis.updateVis();
			});
	}
}

// Load the data and initialize the chart
d3.csv("/data/20-year-data.csv").then(data => {
	data.forEach(d => {
		d.Year = +d.Year;
		d.Quantity = +d["Exporter reported quantity"] || 0;
	});

	new BarChartAnimals("bar-chart", data, [], {});
});
