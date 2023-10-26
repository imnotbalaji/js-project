class Chart {

    constructor(stock,time_period, svg) {
        this.time_period = time_period;
        this.data = stock.data;
        console.log(time_period);
        // debugger
        // console.log(this.get_period(time_period));
        stock.get_data().then((data_array)=> {
            // this.render_bar(data_array,svg);
            // debugger
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
        // debugger
        console.log(time_period);
      
        const formatTime = d3.timeFormat("%b-%y");
        
        // const svg_width = svg.node().clientWidth;
        // const svg_height = svg.node().clientHeight;
        // console.log(svg_width);
        // console.log(svg_height);

        

        const margin = {top: 0, bottom:0};
        console.log(margin.top);
        
        
        const today = new Date();
        const cutoffdate = new Date();
        const daysAgo = time_period;
        cutoffdate.setDate(today.getDate()-daysAgo);

        // Filter data and sort data;
        const data = received_data.filter(d=> new Date(d.timestamp) > cutoffdate);
        data.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));



        const start_value = data[0].value;

        const end_value = data[data.length-1].value;

        console.log(end_value);
        console.log(start_value);

        let chart_color;
        if (end_value > start_value) {
            chart_color = "green";
        } else {
            // debugger
            chart_color = "red";

        }



        const xScale = d3.scaleTime()
                          .domain(d3.extent(data, d=> new Date(d.timestamp)))
                          .range([0,800]);
        
        const yScale = d3.scaleLinear()
                         .domain([d3.min(data,d=>d.value),d3.max(data, d=> d.value)])
                         .range([400,0+margin.top]);

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
                              .attr("x","0%")
                              .attr("y","-50%")
                              .attr("height","200%")
                              .attr("width","200%")

            
            filter.append("feGaussianBlur")
                  .attr("in", "SourceAlpha")
                  .attr("stdDeviation", 3)
                  .attr("result", "blur");
            

            filter.append("feOffset")
                  .attr("in", "blur")
                  .attr("dx", 3)
                  .attr("dy", 3)
                  .attr("result", "offsetBlur");

        let feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
               .attr("in","offsetBlur");
        
        feMerge.append("feMergeNode")
               .attr("in","SourceGraphic")


    // filter.append("feBlend")
    //         .attr("in", "offsetBlur")
    //       .attr("in2", "blurOut")
    //         .attr("mode", "normal");
          
        }

        let existing_gradient = svg.select("#gradient");

        if (existing_gradient.empty()){

            let gradient = svg.select("defs").append('linearGradient')
                                            .attr('id','gradient')
                                            .attr('x1','0%')
                                            .attr('y1','0%')
                                            .attr('x2','0%')
                                            .attr('y2','100%');
            gradient.append('stop')
                    .attr('offset','0%')
                    .attr('stop-color',chart_color)
                    .attr('stop-opacity',0.3);
            gradient.append('stop')
                    .attr('offset','100%')
                    .attr('stop-color',chart_color)
                    .attr('stop-opacity',0);

        }

        
        

        svg.select("#gradient").selectAll("stop").attr('stop-color',chart_color);
        let min_value = d3.min(data,d=>d.value);
        
        let area = d3.area()
                     .x(d=>xScale(new Date(d.timestamp)))
                     .y1(d=>yScale(d.value))
                     .y0(yScale(min_value));
    
 
        // Line creation and transitions 

        console.log(gradient);

        let line_path = svg.select(".line-path");
                        

        let area_path = svg.select(".area-path");


        if (area_path.empty()){

             area_path = svg.append('path')
                               .attr('class',"area-path")
                              .style("fill", "url(#gradient");


        }

        area_path.datum(data)
                 .attr('d', area);

        if (line_path.empty()){
           
            line_path = svg.append("path")
                           .attr("class","line-path")
                           .attr("fill","none")
                           .attr("stroke",chart_color)
                           .attr("stroke-width", 0.7)
                    //   .attr("filter", "url(#shadow");
        } 

        svg.select(".line-path").attr("stroke",chart_color);

                  line_path.datum(data)
                      .attr("d",line);



         line_path
               .attr("opacity",0)
               .transition()
               .duration(500)
               .ease(d3.easeLinear)
               .attr("opacity",1);


        


        /// Axes 
        
        const xAxis = d3.axisBottom(xScale)
                        .tickFormat(d=>formatTime(d))

        let max_value = d3.max(data,d=>d.value);
        
        let tick_interval = ( max_value-min_value )/4;

        let tick_values_axis = [min_value, min_value+tick_interval, min_value+2*tick_interval,min_value+3*tick_interval,max_value];
        let tick_values_grid = [ min_value+tick_interval, min_value+2*tick_interval,min_value+3*tick_interval,max_value];

        
        const yAxis = d3.axisRight(yScale)
                        .tickValues(tick_values_axis);

     

        let xAxisgroup = svg.select(".x-axis");

        if (xAxisgroup.empty()){
            xAxisgroup = svg.append("g")
                            .attr("class","x-axis")
                            .attr("transform", "translate(0,"+400+")")
        }

        xAxisgroup.transition()
                  .duration(1000)
                  .call(xAxis);



        let yAxisgroup = svg.select(".y-axis");
        if (yAxisgroup.empty()) {
            yAxisgroup = svg.append("g")
                            .attr("class","y-axis")
                            .attr("transform","translate("+800+",0)");
        }

        yAxisgroup.transition()
                  .duration(1000)
                  .call(yAxis);

        
        const yAxisGrid = d3.axisRight(yScale)
                            // .attr("transform","translate("+600+",0)")
                            .tickSize(+800)
                            .tickValues(tick_values_grid)
                            .tickFormat('');
        
        svg.append('g')
            .attr('class','y grid')
            .call(yAxisGrid);

            svg.selectAll("text")
                .style("font-family","Arial")
                .style("font-zie","14px");
                        

    

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
                     .attr('y1',yScale(min_value))
                     .attr('y2',yScale(closestDataPoint.value))
                    
            hoverText.attr('x',xScale(new Date(closestDataPoint.timestamp))) 
                     .attr('y',yScale(closestDataPoint.value) -10)
                     .text(closestDataPoint.value)
                     .style("font-family","Roboto, Sans Serif")
                     .style("font-size","12px")
                     .style("font-weight","bold");
            
        }

        function onMouseOut(){
            hoverCircle.style('display','none');
            hoverText.style('display','none');
            hoverLine.style('display','none');
        }
    }

}

export default Chart;