class BarChartAnimals {
	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data;
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

		vis.width = vis.config.width - vis.config.margin.left - vis.config.margin.right;
		vis.height = vis.config.height - vis.config.margin.top - vis.config.margin.bottom;

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
			.tickFormat(d3.format(",d"))  // Use thousands separator
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
			.attr("y", vis.height + 40)
			.style("text-anchor", "middle")
			.style("font-size", "12px")
			.text("Quantity Traded: 2017-2023");

		vis.svg.append("text")
			.attr("class", "y-axis-label")
			.attr("transform", "rotate(-90)")
			.attr("y", -vis.config.margin.left + 50)
			.attr("x", -(vis.height / 2))
			.style("text-anchor", "middle")
			.style("font-size", "12px")
			.text("Species");


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

		console.log(vis.data);
		// Filter out entries without Class if needed
		let filteredData = vis.data.filter(d => {
			return d[vis.config.key] &&
				d.Class == 'Mammalia' || d.class == 'Aves';
		});

		// Group by key and sum the TotalQuantity
		let groupedData = d3.rollup(
			filteredData,
			leaves => d3.sum(leaves, leaf => leaf.TotalQuantity), // Sum TotalQuantity instead of counting
			d => d[vis.config.key]
		);

		// Convert to array and sort descending
		let dataArray = Array.from(groupedData, ([key, value]) => ({
			key,
			value: +value,  // Ensure value is a number
			displayName: vis.config.LabelTranslate ? vis.config.LabelTranslate[key] : key
		}));

		vis.displayData = dataArray
			.sort((a, b) => b.value - a.value)
			.slice(0, 5);  // Take top 5

		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
		vis.y.domain(vis.displayData.map(d => d.key));

		// Update x-axis with proper tick values
		let maxValue = d3.max(vis.displayData, d => d.value);
		let step = Math.ceil(maxValue / 5);
		vis.xAxis.tickValues(d3.range(0, maxValue + step, step));

		if (vis.config.LabelTranslate) {
			vis.yAxis.tickFormat(d => vis.config.LabelTranslate[d]);
		}

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
			.attr("width", 0);

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
				d3.select(event.currentTarget)
					.transition()
					.duration(200)
					.attr("fill", vis.config.hoverColor);

				let originalData = vis.data.find(item => item[vis.config.key] === d.key);
				let taxonName = originalData ? originalData.Taxon : "";
				let imagePath = `../img/${taxonName.toLowerCase().replace(/\s+/g, '_')}.jpg`;

				vis.tooltip
					.style("opacity", 1)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 10) + "px")
					.html(`
                        <div style="background: white; padding: 10px; border-radius: 5px; min-width: 200px;">
                            <img src="${imagePath}" 
                                 alt="${taxonName}" 
                                 style="width: 150px; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 8px;"
                                 onerror="this.src='../img/panthera_leo.jpg'">
                            <div style="margin-top: 5px;">
                                <strong>${this.mapping[d.displayName]}</strong><br>
                                <span style="color: #666;">Taxon: ${taxonName}</span><br>
                                <strong>Quantity: ${d3.format(",")(d.value)}</strong>
                            </div>
                        </div>
                    `);
			})
			.on("mouseout", (event) => {
				d3.select(event.currentTarget)
					.transition()
					.duration(200)
					.attr("fill", vis.config.barColor);

				vis.tooltip.style("opacity", 0);
			});
	}
}