const loadStatus = document.querySelector("#load-status");

if (window.location.protocol === "file:") {
  loadStatus.textContent = "Start a local web server (such as VS Code Live Server) to load the CSV data and display the charts.";
} else if (!window.d3) {
  loadStatus.textContent = "D3.js could not load. Check your internet connection and allow access to d3js.org, then reload.";
  throw new Error("D3.js is unavailable; dashboard charts cannot be rendered.");
} else {
  Promise.all([
    d3.csv("Data/Ex5_TV_energy.csv", d3.autoType),
    d3.csv("Data/Ex5_TV_energy_Allsizes_byScreenType.csv", d3.autoType),
    d3.csv("Data/Ex5_ARE_Spot_Prices.csv", d3.autoType)
  ]).then(([tvData, technologyData, priceData]) => {
    drawScatterPlot(tvData);
    drawBarChart(technologyData);
    drawLineChart(priceData);
    drawDonutChart(tvData);
    loadStatus.textContent = "Source: Australian television energy and electricity spot price datasets.";
  }).catch((error) => {
    console.error("Unable to load dashboard data.", error);
    loadStatus.textContent = `Chart data could not be loaded (${error.message}). Check that the server is serving the project folder, including its Data and Charts folders, then reload.`;
  });
}