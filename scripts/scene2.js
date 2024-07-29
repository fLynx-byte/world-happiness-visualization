function scene2() {
    clearChart();
    d3.select("#description").html(`
        <h2>Scene 2: Social Support vs. Life Ladder</h2>
        <p>This scene explores the relationship between social support and the subjective well-being (Life Ladder) in various countries.</p>
    `);
    loadCSVData(data => {
        // Filter out outliers
        data = data.filter(d => d.SocialSupport > 0);

        const { svg, width, height } = setupSVG();

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.SocialSupport))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.LifeLadder))
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        createAxisLabels(svg, width, height, "Social Support", "Life Ladder");

        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => xScale(d.SocialSupport))
            .attr("cy", d => yScale(d.LifeLadder))
            .attr("r", 4)
            .attr("fill", "green")
            .on("mouseover", (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`Country: ${d.Country}<br/>Life Ladder: ${d.LifeLadder}<br/>Social Support: ${d.SocialSupport}`)
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
                    label: "Countries with higher social support tend to have higher happiness scores.",
                    title: "High Social Support, High Happiness",
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
