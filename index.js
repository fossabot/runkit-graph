const { ValueViewerSymbol } = require("@runkit/value-viewer");
const d3 = require("d3");

function runkitGraph(graph) {
  let set = new Set();
  Object.keys(graph).forEach(k => set.add(k));
  Object.values(graph).forEach(arr => arr.forEach(d => set.add(d)));

  let nodes = [];
  set.forEach(d =>
    nodes.push({
      id: d
    })
  );

  let links = [];
  Object.keys(graph).forEach(k => {
    const arr = graph[k];
    arr.forEach(item => {
      links.push({ source: k, target: item });
    });
  });

  const sim = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody())
    .force(
      "link",
      d3
        .forceLink(links)
        .id(d => d.id)
        .distance(20)
    )
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  // D3 wants to animate the simulation, but I dunno how to make that
  // work with RunKit.
  sim.tick(10);
  sim.stop();

  const HTML = `
    <svg width="100vw" height="400" viewBox="0 0 100 100">
      <g style="transform: translate(50px, 50px)">
        ${links.map(link => {
          const path = d3.path();
          path.moveTo(link.source.x, link.source.y);
          path.lineTo(link.target.x, link.target.y);
          path.closePath();
          return `<path d=${path.toString()} stroke="black" />`;
        })}
        ${nodes.map(node => {
          const x = node.x;
          const y = node.y;
          return `
            <circle cx=${x} cy=${y} r="5" stroke="black" fill="white" />
            <text
              x=${x}
              y=${y}
              style="
                text-anchor: middle;
                dominant-baseline: middle;
                font-size: 5;
                font-family: system-ui;
                font-weight: bold;
              "
            >
              ${node.id}
            </text>
          `;
        })}
      </g>
    </svg>
  `;

  return {
    [ValueViewerSymbol]: {
      title: "Graph",
      HTML
    }
  };
}

module.exports = runkitGraph;
