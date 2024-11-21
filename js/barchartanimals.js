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


		// * TO-DO *
		let updatedRects = vis.svg.selectAll('rect').data(vis.displayData);


		let enteringData = updatedRects.enter()
			.append('rect')
			.merge(updatedRects)
			.transition()
			.duration(1000)
			.attr("x", 0)
			.attr("y", d=> vis.y(d.key))
			.attr("width", d=> vis.x(d.value))
			.attr("height", function(d){
				return vis.y.bandwidth();
			})
			.attr("fill", "red");


		updatedRects.exit().remove();

		// Update the y-axis
		vis.svg.select(".y-axis").call(vis.yAxis);
	}

}
