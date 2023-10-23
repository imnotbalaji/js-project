class Chart {

    constructor(stock,svg) {
        
        this.data = stock.data;
        stock.get_data().then((data_array)=> {
            // this.render_bar(data_array,svg);
            this.render_line(data_array,svg);
        });
     
    
    }

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

 
    render_line(data,svg){
        
        const formatTime = d3.timeFormat("%m-%y");
        const svg_width = svg.node().clientWidth;
        const svg_height = svg.node().clientHeight;

        data.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));



        const xScale = d3.scaleTime()
                          .domain(d3.extent(data, d=> new Date(d.timestamp)))
                          .range([0,svg_width]);
        
        const yScale = d3.scaleLinear()
                         .domain([0,d3.max(data, d=> d.value)])
                         .range([svg_height,0]);

        const line = d3.line()
                       .x(d=>xScale(new Date(d.timestamp)))
                       .y(d=>yScale(d.value))
                    

        // Testing out some filter/ drop shadow effects 

        const existingFilter = svg.select("#shadow");
        if (existingFilter.empty()) {
        // Create the filter definition and append it to the SVG
            const filter = svg.append("defs")
                              .append("filter")
                              .attr("id", "shadow")
        

    filter.append("feOffset")
        .attr("in", "SourceGraphic")
        .attr("dx", 0)
        .attr("dy", 10)
        .attr("result", "offOut");

        filter.append("feGaussianBlur")
        .attr("in", "off0ut")
        .attr("stdDeviation", 10)
        .attr("result", "blurOut");


    filter   .append("feBlend")
             .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");
}



        let path = svg.select("path");

        if (path.empty()){
            path = svg.append("path")
                      .datum({})
                    .attr("fill","none")
               .attr("stroke","steelblue")
               .attr("stroke-width", 2)
               .attr("filter", "url(#shadow");
               
    
        } 
        path.datum(data)
        .transition()
        .duration(1000)
        .attr("d",line);
     

        


        /// Axes 
        
        const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d=>formatTime(d))

        const yAxis = d3.axisRight(yScale);

        // const yAxisGrid = d3.axisLeft(yScale)
        //                     .tickSize(-svg_width)
        //                     .tickFormat("");


        // svg.append("g")
        // .attr("class","x-axis")
        // .attr("transform", "translate(0," + svg_height + ")")
        // .transition()
        // .duration(1000)
        // .call(xAxis);

        // test method to try out axis transitions 

        let xAxisgroup = svg.select(".x-axis");

        if (xAxisgroup.empty()){
            xAxisgroup = svg.append("g")
                            .attr("class","x-axis")
                            .attr("transform", "translate(0,"+svg_height+")")
        }

        xAxisgroup.transition()
                  .duration(1000)
                  .call(xAxis);


        let yAxisgroup = svg.select(".y-axis");
        if (yAxisgroup.empty()) {
            yAxisgroup = svg.append("g")
                            .attr("class","y-axis")
            .attr("transform","translate("+svg_width+",0)");
        }

        yAxisgroup.transition()
                  .duration(1000)
                  .call(yAxis);


        // svg.append("g")
        //     .attr("class","grid")
        //     .call(yAxisGrid);

        //     svg.select(".grid")
        //      .style("stroke","grey")
        //     .style("stroke-opacity",0.7)
        //     .style("shape-rendering","crispEdges");
      

        const hoverCircle = svg.append('circle')
                               .attr("r",5)
                               .attr('fill',"red")
                               .style("display","none");

        const hoverText = svg.append('text')
                             .attr('dy','-1em')
                             .style('text-anchor','middle')
                             .style('display','none');

        const hoverLine = svg.append("line")
                              .attr("stroke", "grey")
                              .attr("stroke-width","1")
                              .attr("stroke-dasharray","5,5")
                              .style("display","none");

        svg.on('mouseover',onMouseOver)
            .on('mousemove', onMouseMove)
            .on('mouseout',onMouseOut);

        function onMouseOver(){
            hoverCircle.style('display',null);
            hoverText.style('display',null);
            hoverLine.style('display',null);

        }

        function onMouseMove(event) {
            const [mx, my] = d3.pointer(event);  // Get mouse coordinates
         
            const date = xScale.invert(mx);      // Invert the x-scale to get the date
        
            const bisectDate = d3.bisector(d=> new Date(d.timestamp)).left;

            const index = bisectDate(data,date);
            const closestDataPoint = data[index];

            console.log(closestDataPoint);
            
            hoverCircle.attr('cx', xScale(new Date(closestDataPoint.timestamp)))
                       .attr('cy',yScale(closestDataPoint.value));
            hoverLine.attr('x1',xScale(new Date(closestDataPoint.timestamp)))
                     .attr('x2',xScale(new Date(closestDataPoint.timestamp)))
                     .attr('y1',yScale(0))
                     .attr('y2',yScale(closestDataPoint.value))
                    
            hoverText.attr('x',xScale(new Date(closestDataPoint.timestamp))) 
                     .attr('y',yScale(closestDataPoint.value) -10)
                     .text(closestDataPoint.value);
            
        }

        function onMouseOut(){
            hoverCircle.style('display','none');
            hoverText.style('display','none');
            hoverLine.style('display','none');
        }
    }

}

export default Chart;