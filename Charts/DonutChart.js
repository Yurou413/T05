function drawDonutChart(data) {
  const host = d3.select("#donutchart");
  const width = 720;
  const height = 250;
  const radius = 86;
  const totals = Array.from(
    d3.rollup(data, (rows) => d3.sum(rows, (d) => Number.isFinite(d.count) ? d.count : 1), (d) => d.screen_tech),
    ([technology, count]) => ({ technology, count })
  ).filter((d) => d.technology && d.count > 0).sort((a, b) => b.count - a.count);
  const colors = d3.scaleOrdinal().domain(["LCD (LED)", "LCD", "OLED"]).range(["#4778e8", "#24b6a2", "#f29a67"]);
  const pie = d3.pie().sort(null).value((d) => d.count);
  const arc = d3.arc().innerRadius(radius * 0.68).outerRadius(radius);
  const svg = host.append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("role", "img")
    .attr("aria-label", "Television listings by screen technology");
  const chart = svg.append("g").attr("transform", `translate(${width / 2 - 100},${height / 2})`);
  const arcs = pie(totals);
  chart.selectAll("path")
    .data(arcs)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => colors(d.data.technology))
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .append("title")
    .text((d) => `${d.data.technology}: ${d.data.count} listings (${d3.format(".0%")(d.data.count / d3.sum(totals, (item) => item.count))})`);
  chart.append("text").attr("text-anchor", "middle").attr("y", -2).attr("fill", "#17253c")
    .attr("font-family", "Manrope, sans-serif").attr("font-size", 23).attr("font-weight", 800)
    .text(d3.sum(totals, (d) => d.count));
  chart.append("text").attr("text-anchor", "middle").attr("y", 16).attr("fill", "#8491a3")
    .attr("font-family", "DM Sans, sans-serif").attr("font-size", 9).text("LISTINGS");

  const legend = svg.append("g").attr("transform", `translate(${width / 2 + 25},${height / 2 - (totals.length * 25) / 2})`);
  totals.forEach((d, index) => {
    const item = legend.append("g").attr("transform", `translate(0,${index * 25})`);
    item.append("circle").attr("r", 5).attr("cy", 1).attr("fill", colors(d.technology));
    item.append("text").attr("class", "axis-label").attr("x", 13).attr("y", 4).text(d.technology);
    item.append("text").attr("class", "axis-label").attr("x", 175).attr("y", 4).attr("text-anchor", "end")
      .attr("font-weight", 600)
      .text(`${d3.format(".1%")(d.count / d3.sum(totals, (row) => row.count))}  ·  ${d.count}`);
  });
}