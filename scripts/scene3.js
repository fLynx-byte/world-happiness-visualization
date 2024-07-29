function scene3() {
    clearChart();
    d3.select("#description").html(`
        <h2>Scene 3: Freedom to Make Life Choices vs. Life Ladder</h2>
        <p>This scene explores the relationship between the perceived freedom to make life choices and the subjective well-being (Life Ladder) in various countries.</p>
    `);
    loadCSVData(data => {
        // Filter out outliers
        data = data.filter(d => d.FreedomToMakeLifeChoices > 0);

        const { svg, width, height } = setupSVG();

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.FreedomToMakeLifeChoices))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.LifeLadder))
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        createAxisLabels(svg, width, height, "Freedom to Make Life Choices", "Life Ladder");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => xScale(d.FreedomToMakeLifeChoices))
            .attr("cy", d => yScale(d.LifeLadder))
            .attr("r", 4)
            .attr("fill", "red")
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Country: ${d.Country}<br/>Life Ladder: ${d.LifeLadder}<br/>Freedom: ${d.FreedomToMakeLifeChoices}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Example annotation
        const annotations = [
            {
                note: {
                    label: "Countries with more freedom to make life choices tend to have higher happiness scores.",
                    title: "High Freedom, High Happiness",
                    wrap: 200,
                    padding: 10
                },
                x: xScale(0.9),
                y: yScale(7.5),
                dy: -50,
                dx: -50
            }
        ];

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(makeAnnotations);
    });
    d3.select(".navigation").style("flex-direction", "row");
}
