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
    main.append("h1").text("Welcome")
        .style("font-size", "30px")
        .style("margin", "5px");

    const ticker_input =main.append("input")
        .attr("placeholder","Enter your ticker")
        .style("border", "none")
        .style("margin", "20px 20px")
        .style("font-size","20px")
        .style("padding", "10px 10px")
        .style("text-transform","uppercase")
        .style("box-shadow" ,"5px 5px 10px rgba(0, 0, 0, 0.5)");

    const svg = main.append("svg")
        .style("margin","50px")
        .attr("width","70%")
        .attr("height","auto")
        .style("overflow","visible")
        // .style("border","1px solid black");
    this.svg =svg;
    ticker_input.on("keypress", this.handle_enter.bind(this))
    }

    handle_enter(event){
        let main = this.main;
        let svg = this.svg;
        if (event.key === "Enter") {    
            const ticker = d3.select(event.target).property("value");
            const stock = new Security(ticker);
            main.append("button").text("Zoom In").on("click", () => console.log("zoom in"));
            main.append("button").text("Zoom Out").on("click", () => console.log("zoom out"));
            new Chart(stock,svg);
        }
    }

}

export default View;