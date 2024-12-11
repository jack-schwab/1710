// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let my_margin = {top: 40, right: 40, bottom: 60, left: 60};

let my_width = 600 - my_margin.left - my_margin.right;
let my_height = 500 - my_margin.top - my_margin.bottom;

let my_svg = d3.select("#line-chart").append("svg")
    .attr("width", my_width + my_margin.left + my_margin.right)
    .attr("height", my_height + my_margin.top + my_margin.bottom)
    .append("g")
    .attr("transform", "translate(" + my_margin.left + "," + my_margin.top + ")");


let firstYear = document.getElementById("first-year");
let secondYear = document.getElementById("second-year");

let line = d3.line()
    .curve(d3.curveLinear);

let my_path = my_svg.append("path")
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

function makeLineChart(data) {


// Date parser
    let formatDate = d3.timeFormat("%Y");
    let parseDate = d3.timeParse("%Y");


// Scales
    let x = d3.scaleLinear()
        .range([0, my_width]);

    let y = d3.scaleLinear()
        .range([my_height, 0]);


// Axes
    let xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d => formatDate(parseDate(d)));
    let yAxis = d3.axisLeft()
        .scale(y);

    let xGroup = my_svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height) + ")")
        .call(xAxis);
    let yGroup = my_svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis);


// Initialize data


// FIFA world cup


// Event listener
    d3.select("#ranking-type").on("change", updateVisualization);


// Load CSV file
    updateVisualization();

// Create the line for line graph later






    slider.noUiSlider.on('update', function (values) {
        firstYear.innerText = Math.round(values[0]);
        secondYear.innerText = Math.round(values[1]);
        updateVisualization();
    });

// Render visualization
    function updateVisualization() {




        let rankVersion = d3.select("#ranking-type").property("value");

        // Function that gets the property we will use for our y axis
        let yRanking = function (d) {
            if (rankVersion == "goals") {
                return d.Quantity;
            } else if (rankVersion == "average-goals") {
                return d.Quantity;
            } else if (rankVersion == "matches") {
                return d.Quantity;
            } else if (rankVersion == "teams") {
                return d.Quantity;
            } else if (rankVersion == "average-attendance") {
                return d.Quantity;
            }
        };

        console.log(data);

        let filteredData = data.filter(function(d) {
            return (formatDate(d.Year) >= firstYear.innerText) && (formatDate(d.Year) <= secondYear.innerText);
        });

        let xMin = d3.min(filteredData, (d => formatDate(d.Year)));
        let xMax = d3.max(filteredData, (d => formatDate(d.Year)));
        let yMax = d3.max(filteredData, (d => yRanking(d)));

        x.domain([xMin, xMax]);
        y.domain([0, yMax]);

        line.x((d) => x(formatDate(d.Year)))
            .y((d) => y(yRanking(d)));

        my_path.datum(filteredData)
            .transition()
            .duration(800)
            .attr("d", line(filteredData));

        let updatedCircles = my_svg.selectAll('circle').data(filteredData);

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
            .attr("cx", d=> x(formatDate(d.Year)))
            .attr("cy", d=> y(yRanking(d)));

        xGroup.transition()
            .duration(800)
            .call(xAxis);
        yGroup.transition()
            .duration(800)
            .call(yAxis);

    }
}




// Show details for a specific FIFA World Cup
function showEdition(d){
    d3.select("#world-cup-edition")
        .style("display", "block");
    document.getElementById("world-cup-title").innerText = d.Quantity;
    document.getElementById("winner").innerText = d.Quantity;
    document.getElementById("goals").innerText = d.Quantity;
    document.getElementById("average-goals").innerText = d.Quantity;
    document.getElementById("matches").innerText = d.Quantity;
    document.getElementById("teams").innerText = d.Quantity;
    document.getElementById("average-attendance").innerText = d.Quantity;
    console.log("heyo" + d.Quantity);
}

