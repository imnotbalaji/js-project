
render_bar (data,svg){
           


    const xScale = d3.scaleBand()
                     .domain(data.map(d => d.name))
                     .range([0,200]);

    const maxOpenValue = d3.max(data, d => d.open);
    const domainMax = maxOpenValue > 0 ? maxOpenValue : 1;  // Ensures the 
    const yScale = d3.scaleLinear()
                     .domain([0,domainMax])
                     .range([200,0]);

    let data_bars = svg.selectAll("rect")
                       .data(data);

    


    data_bars.enter()
            .append("rect")
            .attr("x", d => xScale(d.name))
            .attr("y", d=> 200)
            .attr("width", xScale.bandwidth()-5)
            .attr("height",0)
            .attr("fill", "blue")
            .transition()
            .duration(1000)
            .attr("y", d=> yScale(d.open))
            .attr("height", d => 200 -yScale(d.open))

            

    data_bars.transition()
        .duration(1000)
        .attr("y", d=> yScale(d.open))
        .attr("height", d=> 200 - yScale(d.open))



    data_bars.exit()
             .transition()
             .duration(1000)
              .attr("y", 200)
              .attr("height",0)
              .remove();

  
    svg.selectAll("rect")
       .on("mouseover",function(event,d) {
        d3.select(this).attr("fill", "orange");
        })
       .on("mouseout", function(event,d) {
        d3.select(this).attr("fill","blue")
        })
            


    svg.append("g")
       .attr("class","x-axis")
       .attr("transform", "translate(0," + 200 + ")")
       .call(d3.axisBottom(xScale).ticks(data.length));


    svg.append("g")
       .attr("class","y-axis")
       .call(d3.axisLeft(yScale))
}
