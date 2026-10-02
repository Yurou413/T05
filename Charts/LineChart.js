function drawLineChart(data) {
  const host = d3.select("#linechart");
  const width = 560;
  const height = 310;
  const margin = { top: 20, right: 22, bottom: 48, left: 54 };
  const rows = data
    .map((d) => ({ year: +d.Year, price: +d["Average Price (notTas-Snowy)"] }))
    .filter((d) => Number.isFinite(d.year) && Number.isFinite(d.price))
    .sort((a, b) => a.year - b.year);
  const x = d3.scaleLinear().domain(d3.extent(rows, (d) => d.year)).range([margin.left, width - margin.right]);
  const y = d3.scaleLinear().domain([0, d3.max(rows, (d) => d.price) * 1.12]).nice().range([height - margin.bottom, margin.top]);
  const svg = host.append("svg").attr("viewBox", `0 0 ${width} ${height}`).attr("role", "img")
    .attr("aria-label", "Average Australian electricity spot price by year");

  svg.append("g").attr("class", "grid").attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickSize(-(width - margin.left - margin.right)).tickFormat(""));
  svg.append("g").attr("class", "axis").attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));
  svg.append("g").attr("class", "axis").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y).ticks(5));
  svg.append("path")
    .datum(rows)
    .attr("fill", "none")
    .attr("stroke", "#4778e8")
    .attr("stroke-width", 2.5)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round")
    .attr("d", d3.line().x((d) => x(d.year)).y((d) => y(d.price)).curve(d3.curveMonotoneX));
  svg.selectAll(".price-point")
    .data(rows)
    .join("circle")
    .attr("class", "price-point")
    .attr("cx", (d) => x(d.year))
    .attr("cy", (d) => y(d.price))
    .attr("r", 3.2)
    .attr("fill", "#fff")
    .attr("stroke", "#4778e8")
    .attr("stroke-width", 2)
    .append("title")
    .text((d) => `${d.year}: $${d.price.toFixed(2)} / MWh`);
}