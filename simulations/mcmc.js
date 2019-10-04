(() => {
    let gaussian = (x) => {
        return 1.0 / Math.sqrt(2 * Math.PI) * Math.exp(-0.5 * Math.pow(x, 2))
    };



    let w = 500;
    let h = 300;
    let svg = d3.select("#mcmcSim")
        .append("svg")
        .attr("viewBox", "0 0 " + w + " " + h)
        .attr("preserveAspectRatio", "xMidYMid meet");

    let scale = d3.scaleLinear()
        .domain([-3, 3])
        .range([2, w - 2]);

    let x_axis = d3.axisBottom()
        .scale(scale);

    svg.append("g")
        .call(x_axis)
        .attr("class", "axis")
        .attr("transform", "translate(0, " + (h - 20) + ")");

    let hist_bounds = [];
    let hist_counts = [];
    let num_bins = 10;
    let min = -3;
    let max = 3;
    let binsize = (max - min) / num_bins;

    for (let i = 0; i < num_bins; i++) {
        hist_bounds.push((i + 1) * binsize + min);
        hist_counts.push(0);
    }

    svg.selectAll("rect")
        .data(hist_counts)
        .enter()
        .append("rect")
        .attr("class", "histogram")
        .attr("x", (d, i) => (i * w / num_bins))
        .attr("y", (h - 20))
        .attr("width", w / num_bins - 1)
        .attr("height", 0);



    let histogram = (val, bins, counts) => {
        for (let i = 0; i < bins.length; i++) {
            if (val < bins[i]) {
                counts[i]++;
                break;
            }
        }
    };

    function randn_bm() {
        let u = 0;
        let v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    let step = 1.5;

    let drawStep = () => {
        return randn_bm() * step;
    };

    let previous = -1;
    let next;
    let delay = 500;
    let count = 0;
    let accepted = 0;
    let stop = false;
    let num_to_sim = 500;

    let tb_prev = d3.select("#mcmc-prev")
        .append("text")
        .text("Previously Accepted: " + previous);

    let tb_next = d3.select("#mcmc-next")
        .append("text")
        .text("Proposed: ");

    let tb_acc = d3.select("#mcmc-accepted")
        .append("text")
        .text("Accepted?: ");

    let tb_ratio = d3.select("#mcmc-ratio")
        .append("text")
        .text("Acceptance ratio: 0");

    let tb_step = d3.select("#step-length")
        .append("text")
        .text("Step length: " + step);

    let mcmc = () => {
        setTimeout(() => {
            count ++;
            let acc_flag = false;
            next = previous + drawStep();
            let threshold = Math.random();

            tb_prev.text("Previously Accepted: " + previous.toFixed(2));
            tb_next.text("Proposed: " + next.toFixed(2));

            if (threshold < (gaussian(next) / gaussian(previous))) {
                histogram(next, hist_bounds, hist_counts);
                previous = next;
                accepted++;
                acc_flag = true;
            } else {
                histogram(previous, hist_bounds, hist_counts);
            }


            tb_acc.text("Accepted?: " + acc_flag)
                .style("color", () => {
                    if (acc_flag) {
                        return "green"
                    } else {
                        return "red"
                    }
                });
            tb_ratio.text("Acceptance Ratio: " +  Number(accepted / count).toFixed(2));

            svg.selectAll("rect")
                .data(hist_counts)
                .transition()
                .duration(delay )
                .attr("y", (d) => h * (1 - d / (count)) - 20)
                .attr("height", (d) => d / (count) * h);


            if ((count < num_to_sim) && !stop) {
                mcmc();
            }
        }, delay);
    };

    d3.select("#mcmcButton")
        .on("click", () => {
            console.log("Inverse Sampling Simulation Started");
            stop = false;
            mcmc();
        });

    d3.select("#stopMcmcButton")
        .on("click", () => stop = true);
})();
