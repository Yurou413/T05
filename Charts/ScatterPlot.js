function drawScatterPlot(data) {
  const host = d3.select("#scatterplot");
  const width = 720;
  const height = 310;
  const margin = { top: 16, right: 22, bottom: 48, left: 58 };
  const points = data.filter((d) => Number.isFinite(d.screensize) && Number.isFinite(d.energy_consumpt));
  const x = d3.scaleLinear()
    .domain([0, d3.max(points, (d) => d.screensize) * 1.04])
    .range([margin.left, width - margin.right]);
  const y = d3.scaleLinear()
    .domain([0, d3.max(points, (d) => d.energy_consumpt) * 1.08])
    .nice()
    .range([height - margin.bottom, margin.top]);
  const colors = d3.scaleOrdinal()
    .domain(["LCD", "LCD (LED)", "OLED"])
    .range(["#4778e8", "#24b6a2", "#f29a67"]);
  const svg = host.append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-label", "Television screen size versus annual energy consumption");

  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(width - margin.left - margin.right)).tickFormat(""));
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(7).tickFormat((d) => `${d}"`));
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5));

  svg.append("text")
    .attr("class", "axis-label")
    .attr("x", (margin.left + width - margin.right) / 2)
    .attr("y", height - 9)
    .attr("text-anchor", "middle")
    .text("Screen size (inches)");
  svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + height - margin.bottom) / 2)
    .attr("y", 14)
    .attr("text-anchor", "middle")
    .text("Energy (kWh / year)");

  svg.append("g")
    .selectAll("circle")
    .data(points)
    .join("circle")
    .attr("cx", (d) => x(d.screensize))
    .attr("cy", (d) => y(d.energy_consumpt))
    .attr("r", 4.2)
    .attr("fill", (d) => colors(d.screen_tech))
    .attr("fill-opacity", 0.65)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .append("title")
    .text((d) => `${d.brand} · ${d.screen_tech}\n${d.screensize}" · ${d.energy_consumpt} kWh/year`);

  const legend = svg.append("g").attr("transform", `translate(${margin.left + 4},${margin.top + 3})`);
  ["LCD", "LCD (LED)", "OLED"].forEach((technology, index) => {
    const item = legend.append("g").attr("transform", `translate(${index * 105},0)`);
    item.append("circle").attr("r", 4).attr("fill", colors(technology));
    item.append("text").attr("class", "axis-label").attr("x", 9).attr("y", 3).text(technology);
  });
}