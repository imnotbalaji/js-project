import Chart from "./chart";
import Security from "./security";

class View {
    constructor(){
        const main = d3.select("#main"); 
        this.render(main);
    }

    // This function will render our main screen and handle the logic to take input and direct the logic elsewhere
    
    render(main){
   
    main.style("height","90vh")
        .style("width","70%")
        .style("border", "none")
        .style("border-radius", "1%")
        .style("background-color", "white")
        .style("box-shadow" ,"5px 5px 10px rgba(0, 0, 0, 0.5)");
    

    
    const search_container = main.append("div")
                                 .attr("id","search_container")
                                 .attr("position","relative")
                                 .style("padding","20px")
                                 .style("width","90%")
                                 .style("height","10%");

 

    const ticker_input = search_container.append("input")
                                         .attr("id","search-input")
                                         .attr("placeholder","Input your ticker to get started...")
                                         .style("width","50%")
                                         .style("border", "1px solid grey")
                                         .style("border-radius","15px")
                                        //  .style("box-sizing","border-box")
                                         .style("margin", "20px 20px")
                                         .style("font-size","20px")
                                         .style("padding", "10px 10px")
                                         .style("box-shadow" ,"5px 5px 10px rgba(0, 0, 0, 0.5)")
                                         .style("text-transform","uppercase");
    
    const chart = main.append("div")
                       .attr("id","chart")
                       .style("height","80%")
                       .style("margin-top","25px")
                       .attr("position","absolute")


    
    const home_page = chart.append("img")
                            .attr("id","home_page")
                            .attr("src","./images/Home_page.png")
                            .style("height","90%")
                            .style("width","90%")
                            // .style("position","relative")
                            .style("margin-top","0px");

    
                    
    
                       
                       

    const svg = chart.append("svg")
                    .attr("viewBox","0 0 800 400")
                    .attr("preserveAspectRatio","none")
                    // .attr("style","outline: thin solid black")
                    // .style("border", "1px solid black") // temporary - let's remove it after some time 
                    // .style("fill","none")
                    
                    .style("width","0%")
                    .style("height","0%")
                    .style("overflow","visible");


     const footer = main.append("div")
                        .attr("id","footer")
                        .style("width", "100%")
                        .style("background-color","beige")
                        .style("height","10%")
                        .style("border-top","2px solid grey")
    
    const links = d3.select("#footer")
                    .append("div")
                    .attr("id","links")
                    .style("margin-left","20px");
                    

    links.append("a")
         .attr("id","github")
         .attr("href","https://github.com/imnotbalaji")
         .attr("target","_blank")
         .append("img")
         .attr("src","./images/github.png")
         .style("width","25px");

    links.append("a")
         .attr("id","github")
         .attr("href","https://www.linkedin.com/in/balajiv1/")
         .attr("target","_blank")
         .append("img")
         .attr("src","./images/linked_in.png")
         .style("width","25px")



    const openModal = d3.select("#footer")
                        .append("button")
                        .attr("id","Instructions")
                        .text("User Guide")
                        .style("margin-right","20px")

    
    
    let user_guide = d3.select("#user-guide")
    openModal.on("click", function(){
        user_guide.style("display","block")
    })

    let close = d3.select(".close");

    close.on("click", function(){
        user_guide.style("display","none");
    })

    d3.select(window).on("click", function(event){
        
        if (event.target == user_guide.node()){
            
            user_guide.style("display","none");

        }
    })




            
                  
    
    
    
    const bound_search_ticker = this.test_search_ticker.bind(this);
    const debounced_search_ticker = this.debounce(bound_search_ticker,250);
    
    ticker_input.on("input", debounced_search_ticker);
   
    

    }
    // ------------- Helper function to debounce;
    debounce(callback, delay) {
        let timeout;
        return (arg) => {
            clearTimeout(timeout);
            timeout = setTimeout(()=> callback(arg), delay);
        }
    }

    // --- look for the keyword
    async test_search_ticker(event){
        const keywords = event.target.value;
        if (keywords !== "") {
            // Construct the URL
            const base_url = "https://www.alphavantage.co/query?"
            const func = "SYMBOL_SEARCH";
            const keyword = d3.select(event.target).property("value");
            const data_type = "json"
            const apikey = "XIW7BTPB24E0PU15";
            const fetch_url = base_url + "function=" + func + "&keywords=" + keyword + "&datatype=" + data_type + "&apikey=" +apikey;
            // Make a fetch request and parse the json output 
            const res = await fetch(fetch_url);
            const tickers = await res.json();
            // Call the dropdown with the inner data from the received json data
            this.render_search_dropdown(tickers["bestMatches"]);
        } else {
            // Hide the dropdown if the input box is empty
            const dropdown = d3.select("#dropdown");
            dropdown.attr("class","dropdown-hidden");
        }

    }

    render_search_dropdown(dropdown_items_array) {

        d3.select("#dropdown").remove();

        const dropdown_items = dropdown_items_array.map((d)=> ({symbol: d["1. symbol"], name: d["2. name"]}));
        

        const drop_down = d3.select("#search_container")
                            .append("div")
                            .attr("id", "dropdown")
                            .style("position","absolute")
                            .style("width","45%")
                            .style("background-color","white")
                            .attr("overflow-y","auto")
                            .style("margin-left","5px")
                            .style("margin-top","65px")
                            .style("padding","10px 10px")
                            // .style("box-sizing","border-box")
                            .style("border","1px solid black")
                            .style("border-radius", "15px");

        const dropdownitems = drop_down.selectAll("div")
                                       .data(dropdown_items)
                                        .enter()
                                        .append("div")
                                        .attr('id','dropdown-item')
                                        .attr("width", "30%")
                                        .text(d=>`${d.symbol}      ${d.name}`);

        dropdownitems.on("click",(event,d)=>{
            d3.select("#search-input").property("value",d.symbol);
            
            this.render_chart_ticker(d);
            

        })
        

    }
    render_chart_ticker(ticker){
        d3.select("#dropdown").remove();
        d3.select("#home_page").remove();
        let svg = d3.select("svg");
        svg.style("width","80%")
            .style("height","75%")
        // debugger
        const stock = new Security(ticker);
        this.render_chart(stock,"All",svg);
        this.show_zoom_buttons(stock);
    }

   
    

    render_chart(stock,selected_time_period,svg){
        new Chart(stock,selected_time_period, svg);

    }
    show_zoom_buttons(stock){
        // debugger
        let chart = d3.select("#chart");
        let svg = d3.select("svg");

        
        const time_period = ["All","10Y","5Y","2Y","1Y","6M","3M","1M"];
        let selected_time_period = time_period[0];


        let zoom = d3.select("#zoom");


        if (zoom.empty()) {
            // debugger

            zoom = chart.append("div")
                       .attr("id","zoom");

                const zoom_out = zoom.append("img")
                            .attr("id","zoom-out")
                            .attr("src","./images/zoom_out.png")
                            .attr("width","25px")
                            .attr("height","25px");
                
                const zoom_text = zoom.append("span").attr("id","zoom_text");

                const zoom_in = zoom.append("img")
                          .attr("id","zoom-in")
                          .attr("src","./images/zoom_in.png")
                          .attr("width","25px")
                          .attr("height","25px");
        }

            
        let zoom_out = d3.select("#zoom-out");
        
        d3.select("#zoom_text").text(selected_time_period);
        
        zoom_out.on("click", () => {
                            selected_time_period = time_period[time_period.indexOf(selected_time_period)-1];
                            // d3.select("#zoom_text").remove();
                            d3.select("#zoom_text").text(selected_time_period);
                            this.render_chart(stock,selected_time_period,svg);
                            });
        
        
        
        

        
        let zoom_in = d3.select("#zoom-in");


            
            
        zoom_in.on("click", () => {
                        selected_time_period = time_period[time_period.indexOf(selected_time_period)+1];
                        // d3.select("#zoom_text").remove();
                        d3.select("#zoom_text").text(selected_time_period);
                        this.render_chart(stock,selected_time_period,svg);
                        });

   
        
    }

  


}

export default View;



