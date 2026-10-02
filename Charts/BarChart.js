function drawBarChart(data) {
  const host = d3.select("#barchart");
  const width = 560;
  const height = 310;
  const margin = { top: 19, right: 26, bottom: 48, left: 52 };
  const rows = data
    .map((d) => ({ technology: d.Screen_Tech, energy: +d["Mean(Labelled energy consumption (kWh/year))"] }))
    .filter((d) => d.technology && Number.isFinite(d.energy));
  const x = d3.scaleBand().domain(rows.map((d) => d.technology)).range([margin.left, width - margin.right]).padding(0.38);
  const y = d3.scaleLinear().domain([0, d3.max(rows, (d) => d.energy) * 1.2]).nice().range([height - margin.bottom, margin.top]);
  const colors = d3.scaleOrdinal().domain(["LCD", "LED", "OLED"]).range(["#4778e8", "#24b6a2", "#f29a67"]);
  const svg = host.append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("role", "img")
    .attr("aria-label", "Average annual television energy consumption by screen technology");

  svg.append("g").attr("class", "grid").attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(width - margin.left - margin.right)).tickFormat(""));
  svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(x));
  svg.append("g").attr("class", "axis").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5));
  svg.selectAll(".bar")
    .data(rows)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.technology))
    .attr("y", (d) => y(d.energy))
    .attr("width", x.bandwidth())
    .attr("height", (d) => y(0) - y(d.energy))
    .attr("rx", 5)
    .attr("fill", (d) => colors(d.technology))
    .append("title")
    .text((d) => `${d.technology}: ${d.energy.toFixed(1)} kWh/year`);
  svg.selectAll(".bar-value")
    .data(rows)
    .join("text")
    .attr("class", "axis-label")
    .attr("x", (d) => x(d.technology) + x.bandwidth() / 2)
    .attr("y", (d) => y(d.energy) - 8)
    .attr("text-anchor", "middle")
    .text((d) => `${d.energy.toFixed(0)}`);
  svg.append("text").attr("class", "axis-label").attr("x", margin.left).attr("y", 11).text("kWh / year");
}