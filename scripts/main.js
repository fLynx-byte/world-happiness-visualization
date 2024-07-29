function loadCSVData(callback) {
    d3.csv("data/world-happiness-report.csv").then(data => {
        data.forEach(d => {
            d.year = +d.year;
            d.LifeLadder = +d['Life Ladder'];
            d.LogGDPperCapita = +d['Log GDP per capita'];
            d.SocialSupport = +d['Social support'];
            d.HealthyLifeExpectancyAtBirth = +d['Healthy life expectancy at birth'];
            d.FreedomToMakeLifeChoices = +d['Freedom to make life choices'];
            d.Generosity = +d.Generosity;
            d.PerceptionsOfCorruption = +d['Perceptions of corruption'];
            d.PositiveAffect = +d['Positive affect'];
            d.NegativeAffect = +d['Negative affect'];
            d.Country = d['Country name'];
        });
        callback(data);
    }).catch(error => {
        console.error('Error loading CSV data:', error);
    });
}

function setupSVG() {
    const margin = { top: 20, right: 20, bottom: 40, left: 40 },
          width = window.innerWidth * 0.7 - margin.left - margin.right,
          height = window.innerHeight * 0.6 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    return { svg, width, height, margin };
}

function createAxisLabels(svg, width, height, xLabel, yLabel) {
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 30)
        .text(xLabel);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -30)
        .attr("x", 0)
        .attr("dy", "1em")
        .text(yLabel);
}

function clearChart() {
    d3.select("#chart").selectAll("*").remove();
    d3.select("#description").text("");
}

function showHome() {
    clearChart();
    d3.select("#description").html(`
        <h2>Welcome to the World Happiness Report Visualization</h2>
        <p>This interactive visualization explores the factors that contribute to happiness around the world. Use the buttons below to navigate through different aspects of the data.</p>
        <h3>Scenes Overview:</h3>
        <ul class="scene-overview">
            <li><strong>Scene 1: GDP vs. Life Ladder</strong> - Explore the relationship between the economic production per person (GDP per capita) and subjective well-being (Life Ladder) in various countries.</li>
            <li><strong>Scene 2: Social Support vs. Life Ladder</strong> - Examine how social support correlates with subjective well-being across different nations.</li>
            <li><strong>Scene 3: Freedom to Make Life Choices vs. Life Ladder</strong> - Understand the impact of perceived freedom to make life choices on the happiness of individuals worldwide.</li>
        </ul>
    `);
}

