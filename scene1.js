// Load the dataset and create the map for Scene 1
d3.csv("data/world-happiness-report.csv").then(data => {
    // Convert data types
    data.forEach(d => {
        d.year = +d.year;
        d['Life ladder'] = +d['Life ladder'];
    });

    // Set up SVG for the map
    const width = 800;
    const height = 500;
    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Load and draw the world map
    d3.json("https://d3js.org/world-110m.v1.json").then(worldData => {
        const projection = d3.geoMercator().fitSize([width, height], topojson.feature(worldData, worldData.objects.countries));
        const path = d3.geoPath().projection(projection);

        // Draw countries
        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(worldData, worldData.objects.countries).features)
            .enter().append("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryData = data.find(c => c['Country name'] === d.properties.name && c.year === 2020);
                return countryData ? d3.interpolateBlues(countryData['Life ladder'] / 10) : "#ccc";
            })
            .attr("stroke", "#fff")
            .on("click", d => showCountryDetails(d.properties.name, data));
    });
});

// Show country details on map click
function showCountryDetails(countryName, data) {
    const countryData = data.filter(d => d['Country name'] === countryName && d.year === 2020)[0];
    alert(`Country: ${countryData['Country name']}\nLife Ladder: ${countryData['Life ladder']}`);
}
