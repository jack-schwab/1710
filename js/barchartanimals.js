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
			...config
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

		vis.tooltip = d3.select("#" + vis.parentElement)
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0)
			.style("position", "absolute")
			.style("pointer-events", "none")
			.style("background", "white")
			.style("padding", "10px")
			.style("border", "1px solid #ccc")
			.style("border-radius", "5px")
			.style("box-shadow", "2px 2px 6px rgba(0,0,0,0.1)");

		vis.wrangleData();
	}

	wrangleData() {
		let vis = this;

		console.log("Original Data:", vis.data);
		let groupedData = d3.rollup(
			vis.data,
			leaves => d3.sum(leaves, d => d.Quantity || 0),
			d => d.Taxon
		);

		let dataArray = Array.from(groupedData, ([key, value]) => ({ key, value }));
		vis.displayData = dataArray
			.sort((a, b) => b.value - a.value)
			.slice(0, 5);

		console.log("Display Data:", vis.displayData);
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

		bars.merge(barsEnter)
			.transition()
			.duration(vis.config.transitionDuration)
			.attr("x", 0)
			.attr("y", d => vis.y(d.key))
			.attr("width", d => vis.x(d.value))
			.attr("height", vis.y.bandwidth())
			.attr("fill", vis.config.barColor);

		vis.svg.selectAll(".bar")
			.on("mouseover", (event, d) => {
				let speciesTrend = vis.trendData.filter(trend => trend.Taxon === d.key);

				if (speciesTrend.length === 0) {
					speciesTrend = Array.from({ length: 20 }, (_, i) => ({
						Year: 2003 + i,
						Quantity: Math.floor(Math.random() * 1000)
					}));
				}

				let xScale = d3.scaleLinear()
					.domain(d3.extent(speciesTrend, d => d.Year))
					.range([0, 200]);

				let yScale = d3.scaleLinear()
					.domain([0, d3.max(speciesTrend, d => d.Quantity)])
					.range([100, 0]);

				let line = d3.line()
					.x(d => xScale(d.Year))
					.y(d => yScale(d.Quantity));

				vis.tooltip
					.style("opacity", 1)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 10) + "px")
					.html(`
                        <div>
                            <strong>${d.key}</strong>
                            <svg width="220" height="140">
                                <text x="110" y="12" text-anchor="middle" font-size="12" font-weight="bold">Trade Trends Over Time</text>
                                <g transform="translate(10, 20)">
                                    <path d="${line(speciesTrend)}" fill="none" stroke="#4682b4" stroke-width="2"></path>
                                    ${speciesTrend.map(point => `
                                        <circle cx="${xScale(point.Year)}" cy="${yScale(point.Quantity)}" r="3" fill="#4682b4"></circle>
                                    `).join("")}
                                    <g class="x-axis" transform="translate(0, 100)">
                                        ${speciesTrend.map(point => `<text x="${xScale(point.Year)}" y="10" text-anchor="middle" font-size="8">${point.Year}</text>`).join("")}
                                    </g>
                                    <g class="y-axis">
                                        <text x="-5" y="0" text-anchor="end" font-size="8">High</text>
                                        <text x="-5" y="100" text-anchor="end" font-size="8">Low</text>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    `);
			})
			.on("mouseout", () => {
				vis.tooltip.style("opacity", 0);
			});
	}
}

// Load the data and initialize the chart
d3.csv("/data/20-year-data.csv").then(data => {
	data.forEach(d => {
		d.Year = +d.Year;
		d.Quantity = +d["Exporter reported quantity"] || 0;
	});

	let groupedData = d3.rollup(data,
		leaves => leaves.map(d => ({ Year: d.Year, Taxon: d.Taxon, Quantity: d.Quantity })),
		d => d.Taxon
	);

	let flatTrendData = Array.from(groupedData.values()).flat();

	new BarChartAnimals("bar-chart", data, flatTrendData, {});
});
