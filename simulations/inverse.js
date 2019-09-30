let w = 500;
let h = 300;

let umax = 1.0;
let xmax = 4.0;

let u_scale = d3.scaleLinear()
    .domain([0, umax])
    .range([0, w - 2]);

let x_scale = d3.scaleLinear()
    .domain([0, xmax])
    .range([0, w - 2]);

let u_x_axis = d3.axisBottom()
    .scale(u_scale);

let x_x_axis = d3.axisBottom()
    .scale(x_scale);


var u_svg = d3.select("#usim")
    .append("svg")
    .attr("viewBox", "0 0 " + w + " " + h)
    .attr("preserveAspectRatio", "xMidYMid meet");

var x_svg = d3.select("#xsim")
    .append("svg")
    .attr("viewBox", "0 0 " + w + " " + h)
    .attr("preserveAspectRatio", "xMidYMid meet");


u_svg.append("g")
    .call(u_x_axis)
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - 20) + ")");

x_svg.append("g")
    .call(x_x_axis)
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - 20) + ")");

let test_data = [0.15];

let u_textbox = d3.select("#utext")
    .data(test_data)
    .append("p")
    .text("Standard uniform draw: 0.000000");

let x_textbox = d3.select("#xtext")
    .data(test_data)
    .append("p")
    .text("Calculated exponential draw: 0.000000");

let u_data = [];
let x_data = [];
let num_to_sim = 500;

let num_bins = 10;
let u_hist_bounds = [];
let u_hist_counts = [];
let x_hist_bounds = [];
let x_hist_counts = [];



let ubinsize = umax / num_bins;
let xbinsize = xmax / num_bins;

for (let i = 0; i < num_bins; i++) {
    u_hist_bounds.push((i + 1) * ubinsize);
    u_hist_counts.push(0);

    x_hist_bounds.push((i + 1) * xbinsize);
    x_hist_counts.push(0);
}

u_svg.selectAll("rect")
    .data(u_hist_counts)
    .enter()
    .append("rect")
    .attr("class", "histogram")
    .attr("x", (d, i) => (i * w / num_bins))
    .attr("y", (h - 20))
    .attr("width", w / num_bins - 1)
    .attr("height", 0);

x_svg.selectAll("rect")
    .data(u_hist_counts)
    .enter()
    .append("rect")
    .attr("class", "histogram")
    .attr("x", (d, i) => (i * w / num_bins))
    .attr("y", (h - 20))
    .attr("width", w / num_bins - 1)
    .attr("height", 0);

let histogram = function (val, bins, counts) {
    for (let i = 0; i < bins.length; i++) {
        if (val < bins[i]) {
            counts[i]++;
            break;
        }
    }
};

let delay = 250;
let count = 0;
let stop = false;

let sample = () => {
    setTimeout(() => {
        count++;
        let u = Math.random();
        console.log(u);
        let x = -1.0 / 1.5 * Math.log(1 - u);
        u_data.push(u);
        x_data.push(x);

        u_textbox.text("Standard uniform draw: " + u);
        x_textbox.text("Calculated exponential draw: " + x);


        histogram(u, u_hist_bounds, u_hist_counts);
        histogram(x, x_hist_bounds, x_hist_counts);

        u_svg.selectAll("rect")
            .data(u_hist_counts)
            .transition()
            .duration(delay )
            .attr("y", (d) => h * (1 - d / (count)) - 20)
            .attr("height", (d) => d / (count) * h);

        x_svg.selectAll("rect")
            .data(x_hist_counts)
            .transition()
            .duration(delay)
            .attr("y", (d) => h * (1 - d / (count)) - 20)
            .attr("height", (d) => d / (count) * h);

        if ((count < num_to_sim) && !stop) {
            sample();
        }
    }, delay);
};


d3.select("#invButton")
    .on("click", () => {
        console.log("Inverse Sampling Simulation Started");
        stop = false;
        sample();
    });

d3.select("#stopInvButton")
    .on("click", () => stop = true);

// d3.select("#resetInvButton")
//     .on("click", () => {
//         stop = true
//
//     });
