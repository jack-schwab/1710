/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */
const countryCodeToName = {
    AO: "Angola",
    BI: "Burundi",
    BJ: "Benin",
    BF: "Burkina Faso",
    BW: "Botswana",
    CF: "Central African Rep.",
    CI: "Côte d'Ivoire",
    CM: "Cameroon",
    CD: "Dem. Rep. Congo",
    CG: "Congo",
    DJ: "Djibouti",
    DZ: "Algeria",
    EG: "Egypt",
    ER: "Eritrea",
    ET: "Ethiopia",
    GA: "Gabon",
    GH: "Ghana",
    GN: "Guinea",
    GM: "Gambia",
    GW: "Guinea-Bissau",
    GQ: "Eq. Guinea",
    KE: "Kenya",
    LR: "Liberia",
    LY: "Libya",
    LS: "Lesotho",
    MA: "Morocco",
    MG: "Madagascar",
    ML: "Mali",
    MZ: "Mozambique",
    MR: "Mauritania",
    MW: "Malawi",
    NA: "Namibia",
    NE: "Niger",
    NG: "Nigeria",
    RW: "Rwanda",
    EH: "W. Sahara",
    SD: "Sudan",
    SS: "S. Sudan",
    SN: "Senegal",
    SL: "Sierra Leone",
    SO: "Somalia",
    SZ: "eSwatini",
    TD: "Chad",
    TG: "Togo",
    TN: "Tunisia",
    TZ: "Tanzania",
    UG: "Uganda",
    ZA: "South Africa",
    ZM: "Zambia",
    ZW: "Zimbabwe",
    VC: "St. Vin. and Gren.",
    KN: "St. Kitts and Nevis",
    LC: "Saint Lucia",
    ST: "São Tomé and Principe",
    FM: "Micronesia",
    MH: "Marshall Is.",
    VI: "U.S. Virgin Is.",
    VG: "British Virgin Is.",
    TC: "Turks and Caicos Is.",
    AI: "Anguilla",
    BM: "Bermuda",
    KY: "Cayman Is.",
    FK: "Falkland Is.",
    PN: "Pitcairn Is.",
    SH: "Saint Helena",
    IO: "Br. Indian Ocean Ter.",
    AQ: "Antarctica"
};

class WorldMapVis {

    constructor(parentElement, animalData, geoData) {
        this.parentElement = parentElement;
        this.animalData = animalData;
        this.geoData = geoData;
        this.colors = ['#fddbc7', '#f4a582', '#d6604d', '#b2182b']
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 20, bottom: 20, left: 20};
        vis.height = 500 - vis.margin.top - vis.margin.bottom;
        vis.width = 500 - vis.margin.left - vis.margin.right;
        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // add title
        vis.svg.append('g')
            .attr('class', 'title')
            .attr('id', 'map-title')
            .append('text')
            .text('Title for Map')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // TODO
        //create projection

        vis.projection = d3.geoOrthographic()// d3.geoStereographic()
            .scale(Math.min(vis.width, vis.height)/2.7)
            .translate([vis.width / 2, vis.height / 2])
        //geo generator
        vis.path = d3.geoPath()
            .projection(vis.projection);
        //TopoJSON data into GeoJSON data structure
        vis.world = topojson.feature(vis.geoData, vis.geoData.objects.countries).features
        //ocean
        vis.svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "graticule")
            .attr('fill', '#ADDEFF')
            .attr("stroke","rgba(129,129,129,0.35)")
            .attr("d", vis.path);
        //draw countries
        vis.countries = vis.svg.selectAll(".country")
            .data(vis.world)
            .enter().append("path")
            .attr('class', 'country')
            .attr("d", vis.path)

        //legend
        let legendrectsize = 20
        let valueScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0,4*legendrectsize]);
        let xAxis = d3.axisBottom()
            .scale(valueScale)
            .ticks(2)
        vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr('transform', `translate(${vis.width * 1.5 / 4}, ${vis.height-20})`)
            .call(xAxis);
        vis.legend = vis.svg.append("g")
            .attr('class', 'legend')
            .attr('transform', `translate(${vis.width * 1.5 / 4}, ${vis.height - 20- legendrectsize})`)
        vis.legend.selectAll().data(vis.colors)
            .enter()
            .append("rect")
            .attr("x", (d,index)=>{
                return legendrectsize*index
            })
            .attr("y", 0)
            .attr("width", legendrectsize)
            .attr("height", legendrectsize)
            .attr("fill", (d,index)=>{
                return vis.colors[index]
            })

        let m0,
            o0;

        vis.svg.call(
            d3.drag()
                .on("start", function (event) {

                    let lastRotationParams = vis.projection.rotate();
                    m0 = [event.x, event.y];
                    o0 = [-lastRotationParams[0], -lastRotationParams[1]];
                })
                .on("drag", function (event) {
                    if (m0) {
                        let m1 = [event.x, event.y],
                            o1 = [o0[0] + (m0[0] - m1[0]) / 4, o0[1] + (m1[1] - m0[1]) / 4];
                        vis.projection.rotate([-o1[0], -o1[1]]);
                    }

                    // Update the map
                    vis.path = d3.geoPath().projection(vis.projection);
                    d3.selectAll(".country").attr("d", vis.path)
                    d3.selectAll(".graticule").attr("d", vis.path)
                })
        )
// append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'globeToolTip')


        vis.wrangleData()

    }

    wrangleData() {
        let vis = this;

        // create random data structure with information for each land
        vis.countryInfo = {};
        vis.geoData.objects.countries.geometries.forEach(d => {
            let randomCountryValue = Math.random() * 4
            vis.countryInfo[d.properties.name] = {
                name: d.properties.name,
                category: 'category_' + Math.floor(randomCountryValue),
                color: vis.colors[Math.floor(randomCountryValue)],
                value: randomCountryValue / 4 * 100
            }
        })

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.svg.selectAll(".country")
            .attr("fill", d=>{
                console.log(d)
                console.log(vis.countryInfo[d.properties.name])
                return vis.countryInfo[d.properties.name].color
            })

            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'black')
                    .attr('fill', 'rgba(173,222,255,0.62)')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 5px; background: lightgrey; padding: 20px">
                             <h3>${vis.countryInfo[d.properties.name].name}<h3>
                              <h4> name: ${vis.countryInfo[d.properties.name].name}</h4>   
                              <h4> category: ${vis.countryInfo[d.properties.name].category}</h4>   
                              <h4> color: ${vis.countryInfo[d.properties.name].color}</h4>    
                             <h4> value: ${vis.countryInfo[d.properties.name].value}</h4>      
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '0px')
                    .attr("fill", d => vis.countryInfo[d.properties.name].color)

                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
    }
}
// init global variables, switches, helper functions
let myMapVis;

// load data using promises
let worldMapPromises = [
    d3.csv("data/20-year-data.csv"),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
];

Promise.all(worldMapPromises)
    .then( function(data){initWorldMapPage(data)})
    .catch( function (err){console.log(err)} );

function initWorldMapPage(allDataArray) {
    console.log(allDataArray);
    myMapVis = new WorldMapVis('world-map', allDataArray[0], allDataArray[1])
}
