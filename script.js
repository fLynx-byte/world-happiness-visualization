// Load the dataset
d3.csv("data/world-happiness-report.csv").then(data => {
    // Convert data types
    data.forEach(d => {
        d.year = +d.year;
        d['Life ladder'] = +d['Life ladder'];
        d['Log GDP per capita'] = +d['Log GDP per capita'];
        d['Social support'] = +d['Social support'];
        d['Healthy life expectancy at birth'] = +d['Healthy life expectancy at birth'];
        d['Freedom to make life choices'] = +d['Freedom to make life choices'];
        d.Generosity = +d.Generosity;
        d['perceptions of corruption'] = +d['perceptions of corruption'];
    });

    // Call functions to create visualizations for each page
    if (document.getElementById("map")) createWorldMap(data);
    if (document.getElementById("scatterplot")) createScatterPlot(data);
    if (document.getElementById("line-chart")) createLineChart(data);
});

// Scene 1: Global Happiness Overview
function createWorldMap(data) {
    const width = 800;
    const height = 500;
    const svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Load and draw the map
    d3.json("https://d3js.org/world-110m.v1.json").then(worldData => {
        const projection = d3.geoMercator().fitSize([width, height], topojson.feature(worldData, worldData.objects.countries));
        const path = d3.geoPath().projection(projection);

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
}

// Scene 2: Factors Influencing Happiness
function createScatterPlot(data) {
    const width = 800;
    const height = 500;
    const svg = d3.select("#scatterplot").append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleLinear().range([50, width - 50]);
    const y = d3.scaleLinear().range([height - 50, 50]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - 50})`);
    const yAxis = svg.append("g")
        .attr("transform", "translate(50,0)");

    const factorSelect = d3.select("#factor-select");
    factorSelect.on("change", updateScatterPlot);

    function updateScatterPlot() {
        const factor = factorSelect.property("value");
        x.domain(d3.extent(data, d => d[factor])).nice();
        y.domain(d3.extent(data, d => d['Life ladder'])).nice();

        xAxis.call(d3.axisBottom(x));
        yAxis.call(d3.axisLeft(y));

        svg.selectAll(".dot").remove();

        svg.append("g")
            .selectAll(".dot")
            .data(data.filter(d => d.year === 2020))
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d[factor]))
            .attr("cy", d => y(d['Life ladder']))
            .attr("r", 5)
            .attr("fill", "steelblue")
            .attr("stroke", "white");
    }

    updateScatterPlot();
}

// Scene 3: Happiness Trends Over Time
function createLineChart(data) {
    const width = 800;
    const height = 500;
    const svg = d3.select("#line-chart").append("svg")
        .attr("width", width)
        .attr("height", height);

    const x = d3.scaleLinear().range([50, width - 50]);
    const y = d3.scaleLinear().range([height - 50, 50]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height - 50})`);
    const yAxis = svg.append("g")
        .attr("transform", "translate(50,0)");

    const countries = [...new Set(data.map(d => d['Country name']))];
    const countrySelect = d3.select("#country-select");
    countries.forEach(country => {
        countrySelect.append("option").text(country).attr("value", country);
    });

    countrySelect.on("change", updateLineChart);

    function updateLineChart() {
        const selectedCountries = Array.from(countrySelect.property("selectedOptions")).map(option => option.value);

        x.domain(d3.extent(data, d => d.year)).nice();
        y.domain([0, d3.max(data, d => d['Life ladder'])]).nice();

        xAxis.call(d3.axisBottom(x).tickFormat(d3.format("d")));
        yAxis.call(d3.axisLeft(y));

        svg.selectAll(".line").remove();

        selectedCountries.forEach(country => {
            const countryData = data.filter(d => d['Country name'] === country);

            svg.append("path")
                .datum(countryData)
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", d3.line()
                    .x(d => x(d.year))
                    .y(d => y(d['Life ladder'])));
        });
    }

    updateLineChart();
}

// Show country details on map click
function showCountryDetails(countryName, data) {
    const countryData = data.find(d => d['Country name'] === countryName && d.year === 2020);
    if (countryData) {
        alert(`Country: ${countryData['Country name']}\nLife Ladder: ${countryData['Life ladder']}\nLog GDP per Capita: ${countryData['Log GDP per capita']}\nSocial Support: ${countryData['Social support']}\nHealthy Life Expectancy: ${countryData['Healthy life expectancy at birth']}\nFreedom: ${countryData['Freedom to make life choices']}\nGenerosity: ${countryData.Generosity}\nPerceptions of Corruption: ${countryData['perceptions of corruption']}`);
    }
}

