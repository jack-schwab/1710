const animalLatintoName = {
	Agapornis fischeri: "Fischer's Lovebird",
	Eolophus roseicapilla: "Galah",
	Ara ararauna: "Blue-and-yellow macaw",
	Macaca fascicularis: "Crab-eating macaque",
	Panthera leo: "Lion"
};
	class BarChartAnimals {

	constructor(parentElement, data, config) {
		this.parentElement = parentElement;
		this.data = data;
		this.config = config;
		this.displayData = data;

		console.log(this.displayData);

		this.initVis();
	}

	initVis() {
		let vis = this;

		// * TO-DO *
		vis.margin = {top: 40, right: 0, bottom: 60, left: 160};

		//vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		// vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;
		vis.height = 300 - vis.margin.top - vis.margin.bottom;
		vis.width = 300 - vis.margin.left - vis.margin.right;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes
		vis.x = d3.scaleLinear()
			.range([0, vis.width]);

		vis.y = d3.scaleBand()
			.rangeRound([vis.height, 0])
			.paddingInner(0.1);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");

		vis.tooltip = d3.select("#" + vis.parentElement).append('div')
			.attr('class', "tooltip")

		// (Filter, aggregate, modify data)
		vis.wrangleData();
	}


	/*
	 * Data wrangling
	 */

	wrangleData() {
		let vis = this;

		// (1) Group data by key variable (e.g. 'electricity') and count leaves
		// (2) Sort columns descending
		// * TO-DO *
		let filteredData = vis.data.filter(d=>{
			return d.Class;
		})

		let countDataByKV = d3.rollup(filteredData,leaves=>leaves.length,d=> d[vis.config.key]);
		let dataArray = Array.from(countDataByKV, ([key, value]) => ({key, value}));
		dataArray = dataArray.sort(function(datum1, datum2) {
			return datum2.value - datum1.value;
		});

		vis.displayData = dataArray.slice(0,5);
		console.log(vis.displayData);

		// Update the visualization
		vis.updateVis();
	}


	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
	 */
	updateVis() {
		let vis = this;

		// (1) Update domains
		// (2) Draw rectangles
		// (3) Draw labels data.map(d => d.company)
		vis.x.domain([0,d3.max(vis.displayData, (d => d.value))]);
		vis.y.domain(vis.displayData.map(d => d.key));
		vis.svg.append("text")
			.attr("x",0)
			.attr("y",-10)
			.text(vis.config.title);

		if(vis.config.LabelTranslate){
			console.log(vis.config.LabelTranslate);
			vis.yAxis.tickFormat(d=>{
				return vis.config.LabelTranslate[d];
			})
		}


		// * TO-DO *
		let updatedRects = vis.svg.selectAll('rect').data(vis.displayData);


		let enteringData = updatedRects.enter()
			.append('rect')
			.merge(updatedRects)

			.attr("x", 0)
			.attr("y", d=> vis.y(d.key))
			.attr("width", d=> vis.x(d.value))
			.attr("height", function(d){
				return vis.y.bandwidth();
			})
			.attr("fill", "red")
			.on('mouseover', function(event, d){
				// d3.select(this)
				// 	.attr('stroke-width', '2px')
				// 	.attr('stroke', 'black')
				// 	.attr('fill', 'green')
				vis.tooltip
					.style("opacity", 1)
					.style("left", event.pageX + 20 + "px")
					.style("top", event.pageY + "px")
					.html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                            <img src="img/daniel.jpg" width="50" alt="Endangered Species">
                         </div>`);

			})
			.on('mouseout', function(event, d){
				// d3.select(this)
				// 	.attr('stroke-width', '0px')
				// 	.attr("fill", d=>{
				// 		return vis.linearColor(d.absCases)
				// 	})
				vis.tooltip
					.style("opacity", 0)
					.style("left", 0)
					.style("top", 0)
					.html(``);
			})
			.transition()
			.duration(1000);

		updatedRects.exit().remove();

		vis.svg.select(".y-axis").call(vis.yAxis);
		vis.svg.select(".x-axis").call(vis.xAxis);
	}

}
