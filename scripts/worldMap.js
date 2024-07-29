function drawWorldMap(worldData, csvData) {
    const width = 960, height = 500;

    const svg = d3.select("#chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .scale(150)
        .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain(d3.extent(csvData, d => d.LifeLadder));

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    const countries = topojson.feature(worldData, worldData.objects.countries).features;

    const countryDataMap = new Map();
    csvData.forEach(d => {
        if (d.Country) {
            countryDataMap.set(d.Country.toLowerCase().trim(), d);
        }
    });

    svg.selectAll(".country")
        .data(countries)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path)
        .attr("fill", d => {
            const countryName = d.properties.name ? d.properties.name.toLowerCase().trim() : '';
            const countryData = countryDataMap.get(countryName);
            if (!countryData) {
                console.log(`No data for country: ${d.properties.name}`);
            }
            return countryData ? colorScale(countryData.LifeLadder) : "#ccc";
        })
        .on("mouseover", (event, d) => {
            const countryName = d.properties.name ? d.properties.name.toLowerCase().trim() : '';
            const countryData = countryDataMap.get(countryName);
            if (countryData) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Country: ${countryData.Country}<br/>Happiness Score: ${countryData.LifeLadder}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            }
        })
        .on("mouseout", () => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const legendWidth = 300, legendHeight = 10;

    const legendSvg = svg.append("g")
        .attr("transform", `translate(${width - legendWidth - 20},${height - 20})`);

    const legendGradient = legendSvg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradient");

    legendGradient.selectAll("stop")
        .data(d3.range(0, 1.01, 0.01))
        .enter().append("stop")
        .attr("offset", d => d)
        .attr("stop-color", d => d3.interpolateViridis(d));

    legendSvg.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legendGradient)");

    const legendScale = d3.scaleLinear()
        .domain(d3.extent(csvData, d => d.LifeLadder))
        .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickSize(legendHeight);

    legendSvg.append("g")
        .attr("transform", `translate(0,${legendHeight})`)
        .call(legendAxis)
        .select(".domain")
        .remove();
}
