// Mapping of animal Latin names to common names
const animalLatintoName = {
	"Agapornis fischeri": "Fischer's Lovebird",
	"Eolophus roseicapilla": "Galah",
	"Ara ararauna": "Blue-and-yellow Macaw",
	"Macaca fascicularis": "Crab-eating Macaque",
	"Panthera leo": "Lion"
};

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
		this.mapping = animalLatintoName;
		this.displayData = data;
		this.initVis();
	}

	initVis() {
		const vis = this;

		// Define margins, width, and height
		vis.margin = vis.config.margin;
		vis.width = vis.config.width - vis.margin.left - vis.margin.right;
		vis.height = vis.config.height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select(`#${vis.parentElement}`).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

		// Scales
		vis.x = d3.scaleLinear().range([0, vis.width]);
		vis.y = d3.scaleBand().range([vis.height, 0]).paddingInner(0.2);

		// Axes
		vis.xAxis = d3.axisBottom(vis.x).ticks(5).tickFormat(d3.format(",d")).tickSizeOuter(0);
		vis.yAxis = d3.axisLeft(vis.y).tickSizeOuter(0);

		// Append axes groups
		vis.svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${vis.height})`);
		vis.svg.append("g").attr("class", "y-axis");

		// Tooltip
		vis.tooltip = d3.select(`#${vis.parentElement}`).append("div")
			.attr("class", "tooltip")
			.style("opacity", 0)
			.style("position", "absolute")
			.style("background", "white")
			.style("padding", "10px")
			.style("border", "1px solid #ccc")
			.style("border-radius", "5px")
			.style("box-shadow", "2px 2px 6px rgba(0,0,0,0.1)");

		// Axes labels
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
			.attr("y", -vis.margin.left + 50)
			.attr("x", -(vis.height / 2))
			.style("text-anchor", "middle")
			.style("font-size", "12px")
			.text("Species");

		vis.wrangleData();
	}

	wrangleData() {
		const vis = this;

		// Filter and process data
		let filteredData = vis.data.filter(d => d.Class);
		let groupedData = d3.rollup(
			filteredData,
			leaves => d3.sum(leaves, d => d.TotalQuantity),
			d => d[vis.config.key]
		);

		vis.displayData = Array.from(groupedData, ([key, value]) => ({
			key,
			value,
			displayName: vis.mapping[key] || key
		}))
			.sort((a, b) => b.value - a.value)
			.slice(0, 5);

		vis.updateVis();
	}

	updateVis() {
		const vis = this;

		// Update scales
		vis.x.domain([0, d3.max(vis.displayData, d => d.value)]);
		vis.y.domain(vis.displayData.map(d => d.key));

		// Update axes
		vis.svg.select(".x-axis")
			.transition()
			.duration(vis.config.transitionDuration)
			.call(vis.xAxis);

		vis.svg.select(".y-axis")
			.transition()
			.duration(vis.config.transitionDuration)
			.call(vis.yAxis);

		// Data binding
		const bars = vis.svg.selectAll(".bar").data(vis.displayData, d => d.key);

		// Enter
		bars.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", 0)
			.attr("y", d => vis.y(d.key))
			.attr("height", vis.y.bandwidth())
			.attr("width", 0)
			.attr("fill", vis.config.barColor)
			.on("click", (event, d) => {
				vis.tooltip
					.style("opacity", 1)
					.style("left", `${event.pageX + 10}px`)
					.style("top", `${event.pageY - 10}px`)
					.html(`<strong>English Name: ${d.displayName}</strong><br>Latin Name: ${d.key}<br>Quantity: ${d3.format(",")(d.value)}`);
			})
			.merge(bars)
			.transition()
			.duration(vis.config.transitionDuration)
			.attr("width", d => vis.x(d.value));

		// Exit
		bars.exit().remove();
	}
}
