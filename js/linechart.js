
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

class LineChart {
    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.displayData = data;
        this.initVis();
    }
    initVis() {
        let margin = {top: 40, right: 40, bottom: 60, left: 60};

        let width = 600 - margin.left - margin.right;
        let height = 500 - margin.top - margin.bottom;

        let svg = d3.select("#line-chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Date parser
        let formatDate = d3.timeFormat("%Y");
        let parseDate = d3.timeParse("%Y");


// Scales
        let x = d3.scaleLinear()
            .range([0, width]);

        let y = d3.scaleLinear()
            .range([height, 0]);


// Axes
        let xAxis = d3.axisBottom()
            .scale(x)
            .tickFormat(d => formatDate(parseDate(d)));
        let yAxis = d3.axisLeft()
            .scale(y);

        let xGroup = svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + (height) + ")")
            .call(xAxis);
        let yGroup = svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", "translate(0,0)")
            .call(yAxis);


// Event listener
        d3.select("#ranking-type").on("change", updateVisualization);


        updateVisualization();

// Create the line for line graph later
        let line = d3.line()
            .curve(d3.curveLinear);

        let path = svg.append("path")
            .attr("class", "line");

// Create slider
        let slider = document.getElementById('time-period-slider');
        noUiSlider.create(slider, {
            start: [2004, 2023],
            step: 1,
            connect: true,
            range: {
                'min': 2004,
                'max': 2023
            }
        });

        let firstYear = document.getElementById("first-year");
        let secondYear = document.getElementById("second-year");

        slider.noUiSlider.on('update', function (values) {
            firstYear.innerText = Math.round(values[0]);
            secondYear.innerText = Math.round(values[1]);
            updateVisualization();
        });

// Render visualization
        function updateVisualization() {

            console.log(this.data);

            let rankVersion = d3.select("#ranking-type").property("value");

            // Function that gets the property we will use for our y axis
            let yRanking = function (d) {
                if (rankVersion == "goals") {
                    return d.Quantity;
                } else if (rankVersion == "average-goals") {
                    return d.AVERAGE_GOALS;
                } else if (rankVersion == "matches") {
                    return d.MATCHES;
                } else if (rankVersion == "teams") {
                    return d.TEAMS;
                } else if (rankVersion == "average-attendance") {
                    return d.AVERAGE_ATTENDANCE;
                }
            };

            let filteredData = this.data.filter(function(d) {
                return (formatDate(d.YEAR) >= firstYear.innerText) && (formatDate(d.YEAR) <= secondYear.innerText);
            });

            let xMin = d3.min(filteredData, (d => formatDate(d.YEAR)));
            let xMax = d3.max(filteredData, (d => formatDate(d.YEAR)));
            let yMax = d3.max(filteredData, (d => yRanking(d)));

            x.domain([xMin, xMax]);
            y.domain([0, yMax]);

            line.x((d) => x(formatDate(d.YEAR)))
                .y((d) => y(yRanking(d)));

            path.datum(filteredData)
                .transition()
                .duration(800)
                .attr("d", line(filteredData));

            let updatedCircles = svg.selectAll('circle').data(filteredData);

            updatedCircles.exit().remove();

            let enteringData = updatedCircles.enter()
                .append('circle')
                .attr("r", 5)
                .attr("fill", "#86AC86")
                .attr("stroke", "black")
                .on("click", (event, d) => showEdition(d));

            updatedCircles.merge(enteringData)
                .transition()
                .duration(800)
                .attr("cx", d=> x(formatDate(d.YEAR)))
                .attr("cy", d=> y(yRanking(d)));

            xGroup.transition()
                .duration(800)
                .call(xAxis);
            yGroup.transition()
                .duration(800)
                .call(yAxis);

        }
    }
}







// Show details for a specific FIFA World Cup
function showEdition(d){
    d3.select("#world-cup-edition")
        .style("display", "block");
    document.getElementById("world-cup-title").innerText = d.EDITION;
    document.getElementById("winner").innerText = d.WINNER;
    document.getElementById("goals").innerText = d.Quantity;
    document.getElementById("average-goals").innerText = d.AVERAGE_GOALS;
    document.getElementById("matches").innerText = d.MATCHES;
    document.getElementById("teams").innerText = d.TEAMS;
    document.getElementById("average-attendance").innerText = d.AVERAGE_ATTENDANCE;
}

d3.csv("/data/20-year-data.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        d.Quantity = +d["Exporter reported quantity"] || 0;
    });

    new LineChart("bar-chart", data);
});


