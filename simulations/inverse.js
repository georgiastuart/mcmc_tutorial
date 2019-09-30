let w = 500;
let h = 300;

let u_scale = d3.scaleLinear()
    .domain([0, 1])
    .range([0, w - 2]);

let x_scale = d3.scaleLinear()
    .domain([0, 5])
    .range([0, w - 2]);

let u_x_axis = d3.axisBottom()
    .scale(u_scale);


var u_svg = d3.select("#usim")
    .append("svg")
    .attr("viewBox", "0 0 " + w + " " + h)
    .attr("preserveAspectRatio", "xMidYMid meet");


u_svg.append("g")
    .call(u_x_axis)
    .attr("class", "axis")
    .attr("transform", "translate(0, " + (h - 20) + ")");

let test_data = [0.15];

let u_textbox = d3.select("#utext")
    .data(test_data)
    .append("p");
// .text((d) => "Standard Uniform draw: " + d);

let u_data = [];
let x_data = [];
let num_to_sim = 500;

let u_hist_bounds = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
let u_hist_counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

u_svg.selectAll("rect")
    .data(u_hist_counts)
    .enter()
    .append("rect")
    .attr("x", (d, i) => (i * w / 10.0))
    .attr("y", (h - 20))
    .attr("width", w / 10.0 - 1)
    .attr("height", 0);

let filter_u = function (u_val) {
    for (let i = 0; i < 10; i++) {
        if (u_val < u_hist_bounds[i]) {
            u_hist_counts[i]++;
            break;
        }
    }
};

let count = 0;
let sample = () => {
    setTimeout(() => {
        count++;
        let u = Math.random();
        console.log(u);
        let x = -1.0 / 1.5 * Math.log(1 - u);
        u_data.push(u);
        x_data.push(x);

        u_textbox.text("Standard uniform draw: " + u);

        filter_u(u);
        console.log(u_hist_counts);

        u_svg.selectAll("rect")
            .data(u_hist_counts)
            .transition()
            .duration(500)
            .attr("y", (d) => h * (1 - d / (count)) - 20)
            .attr("height", (d) => d / (count) * h)

        if (count < num_to_sim) {
            sample();
        }
    }, 500);
};

d3.select("#invButton")
    .on("click", () => {
        console.log("Inverse Sampling Simulation Started");
        sample();
    });
