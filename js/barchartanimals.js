// Mammal facts dataset
const mammalFacts = {
	"Cercopithecus ascanius": {
		commonName: "Red-tailed Monkey",
		fact: "Red-tailed monkeys are commonly traded for their distinctive hide that can be made into clothing."
	},
	"Panthera leo": {
		commonName: "Lion",
		fact: "Lions are traded primarily for their bones and other body parts, often used in traditional medicines."
	},
	"Macaca fascicularis": {
		commonName: "Long-tailed Macaque",
		fact: "Long-tailed macaques are often traded for use in biomedical research."
	},
	"Lophocebus aterrimus": {
		commonName: "Black Crested Mangabey",
		fact: "Black crested mangabeys are traded for their meat and occasionally as exotic pets."
	},
	"Cercopithecus neglectus": {
		commonName: "De Brazza's Monkey",
		fact: "De Brazza's monkeys are sought after for their unique fur and as exotic pets."
	}
};

// Update the BarChartAnimals class
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

		d3.select("#" + vis.parentElement).select("svg").remove();

		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.config.margin.left + vis.config.margin.right)
			.attr("height", vis.height + vis.config.margin.top + vis.config.margin.bottom)
			.append("g")
			.attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);

		vis.x = d3.scaleLinear().range([0, vis.width]);
		vis.y = d3.scaleBand().rangeRound([vis.height, 0]).paddingInner(0.2);

		vis.xAxis = d3.axisBottom(vis.x).ticks(5).tickFormat(d3.format(",d")).tickSizeOuter(0);
		vis.yAxis = d3.axisLeft(vis.y).tickSizeOuter(0);

		vis.svg.append("g").attr("class", "x-axis axis").attr("transform", `translate(0,${vis.height})`);
		vis.svg.append("g").attr("class", "y-axis axis");

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

		vis.tooltip = d3.select("#tooltip-container").style("opacity", 0).style("position", "absolute");

		vis.wrangleData();
	}

	wrangleData() {
		let vis = this;

		let mammalData = vis.data.filter(d => d.Class === "Mammalia");
		let groupedData = d3.rollup(
			mammalData,
			leaves => d3.sum(leaves, d => d.Quantity || 0),
			d => d.Taxon
		);

		let dataArray = Array.from(groupedData, ([key, value]) => ({ key, value }));
		vis.displayData = dataArray.sort((a, b) => b.value - a.value).slice(0, 5);

		vis.updateVis();
	}

	updateVis() {
		let vis = this;

		vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
		vis.y.domain(vis.displayData.map(d => d.key));

		vis.svg.select(".x-axis").transition().duration(vis.config.transitionDuration).call(vis.xAxis);
		vis.svg.select(".y-axis").transition().duration(vis.config.transitionDuration).call(vis.yAxis);

		let bars = vis.svg.selectAll(".bar").data(vis.displayData, d => d.key);

		bars.exit().transition().duration(vis.config.transitionDuration).attr("width", 0).remove();

		let barsEnter = bars.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("y", d => vis.y(d.key))
			.attr("height", vis.y.bandwidth())
			.attr("width", 0)
			.attr("fill", vis.config.barColor);

		barsEnter.merge(bars)
			.transition()
			.duration(vis.config.transitionDuration)
			.attr("x", 0)
			.attr("y", d => vis.y(d.key))
			.attr("width", d => vis.x(d.value))
			.attr("height", vis.y.bandwidth())
			.attr("fill", d => vis.selectedBar === d.key ? vis.config.selectedColor : vis.config.barColor);

		barsEnter.merge(bars)
			.on("mouseover", (event, d) => {
				d3.select(event.currentTarget).attr("fill", vis.config.hoverColor);

				// Fetch common name and fact
				let { commonName, fact } = mammalFacts[d.key] || { commonName: "Unknown", fact: "No data available." };

				d3.select("#tooltip-container")
					.style("opacity", 1)
					.style("left", (event.pageX + 10) + "px")
					.style("top", (event.pageY - 10) + "px")
					.html(`<strong>${commonName}</strong><br>${fact}`);
			})
			.on("mouseout", (event, d) => {
				d3.select(event.currentTarget).attr("fill", d => vis.selectedBar === d.key ? vis.config.selectedColor : vis.config.barColor);
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

	new BarChartAnimals("bar-chart", data, {});
});
