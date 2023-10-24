class Chart {

    constructor(stock,time_period, svg) {
        this.time_period = time_period;
        this.data = stock.data;
        console.log(time_period);
        // debugger
        // console.log(this.get_period(time_period));
        stock.get_data().then((data_array)=> {
            // this.render_bar(data_array,svg);
            this.render_line(data_array,this.get_period(time_period),svg);
        });
     
    
    }
    get_period(string){
        
        const time_period = ["All","10Y","5Y","2Y","1Y","6M","3M","1M"];
        switch(string) {
            case "All":
                return 365*50;
                break;
            case "10Y":
                return 365 * 10;
                break;
            case "5Y":
                return 365 * 5;
                break;
            case "2Y":
                return 365 * 2;
                break;
            case "1Y":
                return 365 * 1;
                break; 
            case "6M":
                return 30*6;
                break; 
            case "3M":
                return 30*3;
                break; 
            case "1M":
                return 30*1;
                break;
        }

    }
 
    render_line(received_data,time_period, svg){
        console.log(time_period);
        const formatTime = d3.timeFormat("%m-%y");
        const svg_width = svg.node().clientWidth;
        const svg_height = svg.node().clientHeight;

        
        
        const today = new Date();
        const cutoffdate = new Date();
        const daysAgo = time_period;
        cutoffdate.setDate(today.getDate()-daysAgo);

        // Filter data and sort data;
        const data = received_data.filter(d=> new Date(d.timestamp) > cutoffdate);
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
        .attr("stdDeviation", 15)
        .attr("result", "blurOut");


    filter   .append("feBlend")
             .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");
}

    // Line creation and transitions 

        let path = svg.select("path");

        // if (path.empty()){
        //     path = svg.append("path")
                      
        //               .attr("fill","none")
        //               .attr("stroke","steelblue")
        //               .attr("stroke-width", 2)
        //               .attr("filter", "url(#shadow");
        // } 
        //           path.datum(data)
        //               .transition()
        //               .duration(1000)
        //               .attr("d",line);
     


        if (path.empty()){
            path = svg.append("path")
                      .attr("fill","none")
                      .attr("stroke","steelblue")
                      .attr("stroke-width", 1)
                      .attr("filter", "url(#shadow");
        } 
                  path.datum(data)
                      .attr("d",line);

// Get the length of the path
        const totalLength = path.node().getTotalLength();

// Set up the initial properties for the "drawing" animation
            path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength);

// Create the transition
            path.transition()
                .duration(500)  // Duration of the animation in milliseconds
                .ease(d3.easeLinear)  // The easing function (easeLinear makes it a steady pace)
                .attr('stroke-dashoffset', 0);  // The final value of stroke-dashoffset, which will be reached when the animation is done

     


        


        /// Axes 
        
        const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d=>formatTime(d))

        const yAxis = d3.axisRight(yScale);

     

        let xAxisgroup = svg.select(".x-axis");

        if (xAxisgroup.empty()){
            xAxisgroup = svg.append("g")
                            .attr("class","x-axis")
                            .attr("transform", "translate(0,"+svg_height+")")
        }

        xAxisgroup.transition()
                  .duration(1000)
                  .call(xAxis);



        // let yAxisgroup = svg.select(".y-axis");
        // if (yAxisgroup.empty()) {
        //     yAxisgroup = svg.append("g")
        //                     .attr("class","y-axis")
        //     .attr("transform","translate("+svg_width+",0)");
        // }

    

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

            // console.log(closestDataPoint);
            
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