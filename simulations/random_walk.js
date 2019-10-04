
(function() {
    let w = 500;
    let h = 300;

    let rwsSvg = d3.select("#rwsSimulation")
        .append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("preserveAspectRatio", "xMidYMid meet");

    let step = 30;

    let delay = 1000;
    let count = 0;
    let stop = false;
    let num_to_sim = 500;

    let points = [[w / 2, h / 2]];

    rwsSvg.selectAll('circle')
        .data(points)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("class", "rws");

    // Standard Normal variate using Box-Muller transform.
    // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    function randn_bm() {
        let u = 0;
        let v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    let drawStep = () => {
        return randn_bm() * step;
    };

    let rwsStep = () => {
        setTimeout(() => {
            points.push([points[points.length - 1][0] + drawStep(), points[points.length - 1][1] + drawStep()]);
            console.log(points[points.length - 1]);

            rwsSvg.append("line")
                .attr("class", "line")
                .attr("x1", points[points.length - 2][0])
                .attr("x2", points[points.length - 1][0])
                .attr("y1", points[points.length - 2][1])
                .attr("y2", points[points.length - 1][1]);

            rwsSvg.selectAll("circle")
                .data(points)
                .enter()
                .append("circle")
                .attr("r", 0)
                .attr("cx", (d) => d[0])
                .attr("cy", (d) => d[1])
                .attr("class", "rws");

            rwsSvg.selectAll("circle")
                .data(points)
                .transition(delay)
                .attr("r", 5);


            if ((count < num_to_sim) && !stop) {
                rwsStep();
            }
        }, delay);
    };

    d3.select("#rwsButton")
        .on("click", () => {
            console.log("Inverse Sampling Simulation Started");
            stop = false;
            rwsStep();


        });

    d3.select("#stopRwsButton")
        .on("click", () => stop = true);
})();



