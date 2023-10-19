const DUMMY_DATA = [
    {id: 'd1', value: 10, region: 'USA'},
    {id: 'd2', value: 20, region: 'GERMANY'},
    {id: 'd3', value: 30, region: 'INDIA'},
    {id: 'd4', value: 30, region: 'INDIA'},
    
];

// d3.select('div').selectAll('p').data(DUMMY_DATA).enter().append('p').text(data => data.region);
const xScale = d3.scaleBand()
                  .domain(DUMMY_DATA.map((dataPoint)=>dataPoint.region))
                  .rangeRound([0,250]).padding(0.1);
const yScale = d3.scaleLinear().domain([0,15]).range([200,0]);

const container = d3.select('svg')
                .classed('container', true)
                 

    const bars = container
    .selectAll('.bar')
    .data(DUMMY_DATA)
    .enter()
    .append('rect')
    .classed('bar',true)
    .attr('width',xScale.bandwidth())
    .attr('height', (data) => 200 - yScale(data.value))
    .attr('x', data=>xScale(data.region))
    .attr('y', data=> yScale(data.value));
    

    
