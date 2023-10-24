import Chart from "./chart";
import Security from "./security";

class View {
    constructor(){
        const main = d3.select("#main"); 
        this.main = main;
        this.render(main)
    }

    // This function will render our main screen and handle the logic to take input and direct the logic elsewhere
    
    render(main){
    // Select the main element 
    
    
    // Render the screen
    main.style("height","500px")
        .style("width","70%")
        .style("border", "none")
        .style("border-radius", "2%")
        .style("background-color", "white")
        .style("box-shadow" ,"5px 5px 10px rgba(0, 0, 0, 0.5)");

    // Render the welcome message   
    // main.append("h1").text("Welcome")
    //     .style("font-size", "30px")
    //     .style("margin", "5px");
    const search_container = main.append("div").attr("id","search_container").attr("position","relative")  ;
    const ticker_input = search_container.append("input")
    .attr("id","search-input")
        .attr("placeholder","Search...")
        .style("border", "none")
        .style("margin", "20px 20px")
        .style("font-size","20px")
        .style("padding", "10px 10px")
        .style("text-transform","uppercase")
        // .style("box-shadow" ,"5px 5px 10px rgba(0, 0, 0, 0.5)");

    const svg = main.append("svg")
        .style("margin","50px")
        .attr("width","70%")
        .attr("height","80%")
        .style("overflow","visible")
        // .style("border","1px solid black");
    this.svg =svg;
    ticker_input.on("keypress", this.handle_enter.bind(this)) //This is the original one to be restored if required 
    // debugger
    // ticker_input.on("keypress", this.search_ticker);
    }
    async search_ticker(event){
        let main = this.main;
        let svg = this.svg;

        if (event.key === "Enter") {
            const base_url = "https://www.alphavantage.co/query?"
            const func = "SYMBOL_SEARCH";
            const keywords = d3.select(event.target).property("value");
            const data_type = "json"
            const apikey = "MHTLO8QSWV47YWUG";
            // const fetch_url = base_url + "function=" + func + "&keywords=" + keywords + "&datatype=" + data_type + "&apikey=" +apikey;

            // console.log(fetch_url);
            // const res = await fetch(fetch_url);
            // const list = await res.json();
            // console.log(list);

            const drop_down = d3.select("#search_container")
            .append("div")
            .attr("id", "dropdown")
            .attr("position","absolute")
            .attr("overflow-y","auto")
            .style("border","1px solid black");

            for (let i =0; i < 10;i++){
            let drop_item = drop_down.append("div")
                                     .attr("id",`div-${i}`);
            drop_item
            .attr("value",i)
            .text("Hello"+i)
            .style("background-color","grey");
            drop_item
            .on("click",()=>{
                d3.select("#search-input").property("value",i);
            } );
            }
            
    
        }
    }
    handle_click(event){
        console.log(event.value);
    }
    handle_enter(event){
        let main = this.main;
        let svg = this.svg;
        if (event.key === "Enter") {    
            const ticker = d3.select(event.target).property("value");
            const stock = new Security(ticker);
            // debugger
            this.render_chart(stock,"All",svg);
            this.show_zoom_buttons(stock);
        }
    }

    render_chart(stock,selected_time_period,svg){
        new Chart(stock,selected_time_period, svg);

    }
    show_zoom_buttons(stock){
        
        let main = this.main;
        let svg = this.svg;

        
        const time_period = ["All","10Y","5Y","2Y","1Y","6M","3M","1M"];
        let selected_time_period = time_period[0];


        let zoom = main.select("#zoom");


        if (zoom.empty()) {
            // debugger

            zoom = main.append("div")
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