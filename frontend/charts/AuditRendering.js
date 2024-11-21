// This file contains functions to render charts and components for visualizing 
// audit-related data, including XP points from "Received Audits" and other categories.
import { formatXP } from "../scripts/index.js";

const margin = { top: 20, right: 20, bottom: 60, left: 150 };
const width = 800;
const height = 400;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Extracts and formats data for "Received Audits" and their associated XP points.
async function extractAuditData(transactions) {
    return transactions
        .filter(elem => elem.type === "audit" && !elem.path.includes("piscine"))
        .map(elem => ({
            task: "Audit Received",
            xp: elem.amount
        }));
}

export function renderAuditBars(data) {
    const svg = d3.select("#barChartSvg");
    svg.selectAll("*").remove();

    const width = window.innerWidth > 768 ? window.innerWidth * 0.5 : window.innerWidth * 0.9;
    const height = 400;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.xp)])
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.task))
        .range([0, height - margin.top - margin.bottom])
        .padding(0.2);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", d => yScale(d.task))
        .attr("height", yScale.bandwidth())
        .attr("x", 0)
        .attr("width", d => xScale(d.xp))
        .attr("fill", "#98caff");

    g.append("g").call(d3.axisLeft(yScale));

    g.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => formatXP(d, 2)));

    g.append("text")
        .attr("class", "x-axis-label")
        .attr("y", height - margin.top - margin.bottom + 50)
        .attr("x", (width - margin.left - margin.right) / 2)
        .style("text-anchor", "middle")
        .text("XP Points");

    g.append("text")
        .attr("class", "chart-title")
        .attr("y", -10)
        .attr("x", (width - margin.left - margin.right) / 2)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Received Audits and XP Points");
}

// Renders a comparative bar chart for audits done versus audits received.
export function renderBarChart(auditDone, auditReceived) {
    const data = [
        { name: "Done", value: auditDone },
        { name: "Received", value: auditReceived }
    ];

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const width = window.innerWidth * 0.5 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#barChartContainer")
        .html('')
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) || 0])
        .nice()
        .range([height, 0]);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.name))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.value))
        .attr("fill", (d, i) => (i === 0 ? "#da049d" : "rgb(2, 198, 18)"));

    svg.selectAll(".bar-value")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar-value")
        .attr("x", d => x(d.name) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 10)
        .attr("text-anchor", "middle")
        .text(d => formatXP(d.value, 2));

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d => formatXP(d, 2)));

    const xpInfo = d3.select("#barChartContainer")
        .append("div")
        .attr("class", "xp-info");

    xpInfo.append("p").text("Received audit XP: " + formatXP(auditReceived, 2));
    xpInfo.append("p").text("Done audit XP: " + formatXP(auditDone, 2));
}
