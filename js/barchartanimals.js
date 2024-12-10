class BarChartAnimals {
	constructor(parentElement, data, trendData, config) {
		this.parentElement = parentElement;
		this.data = [
			{ key: "Panthera leo", value: 5000 },
			{ key: "Macaca fascicularis", value: 3000 },
			{ key: "Lophocebus aterrimus", value: 2000 },
			{ key: "Cercopithecus neglectus", value: 1500 },
			{ key: "Cercopithecus ascanius", value: 1000 }
		];
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

		this.mapping = {
			"Macaca fascicularis": "Crab-eating Macaque",
			"Cercopithecus neglectus": "De Brazza's Monkey",
			"Panthera leo": "Lion",
			"Lophocebus aterrimus": "Black Crested Mangabey",
			"Cercopithecus ascanius": "Red-tailed Monkey"
		};

		this.displayData = data;
		this.initVis();
	}

	initVis() {
		let vis = this;

		// Tooltip container
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

		// Rest of initialization code...
		this.wrangleData();
	}

	updateVis() {
		let vis = this;

		// Code to draw bars...

		// Tooltip logic with line graph
		vis.svg.selectAll(".bar")
			.on("mouseover", (event, d) => {
				// Filter trend data for the selected species
				let speciesTrend = vis.trendData.filter(trend => trend.Taxon === d.key);

				// Create scales for the line chart
				let xScale = d3.scaleLinear()
					.domain(d3.extent(speciesTrend, d => d.Year))
					.range([0, 200]); // Tooltip SVG width
				let yScale = d3.scaleLinear()
					.domain([0, d3.max(speciesTrend, d => d.Quantity)])
					.range([100, 0]); // Tooltip SVG height

				// Generate line path
				let line = d3.line()
					.x(d => xScale(d.Year))
					.y(d => yScale(d.Quantity));

				vis.tooltip
					.style("opacity", 1)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 10) + "px")
					.html(`
                        <div>
                            <strong>${vis.mapping[d.key]}</strong>
                            <svg width="220" height="120">
                                <g transform="translate(10, 10)">
                                    <path d="${line(speciesTrend)}" fill="none" stroke="#4682b4" stroke-width="2"></path>
                                    ${speciesTrend.map(point => `
                                        <circle cx="${xScale(point.Year)}" cy="${yScale(point.Quantity)}" r="3" fill="#4682b4"></circle>
                                    `).join("")}
                                    <g class="axis">
                                        <g transform="translate(0, 100)" class="x-axis"></g>
                                        <g class="y-axis"></g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                    `);
			})
			.on("mouseout", (event) => {
				vis.tooltip.style("opacity", 0);
			});
	}
}