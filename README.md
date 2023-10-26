## Overview and Background
My project is meant as a simple stock market visualizer for complete beginners.  It is meant to provide a simple way to allow the users to visualize key market data e.g. search for a stock price and look at its performance over time. It fetches with live data from a web API.


## Core Features

![Alt text](images/output.gif)

1. **Search and autocomplete** for a security with a provided auto-complete feature. 
 The app fetches a series of best matches from a web API allowing for incomplete and imprecise input.


        
2. **Render chart based on live price data** - the app fetches the latest price data from a web API and renders a chart 

3. **Zoom In and Zoom out of time horizons** - Given the importance of time horizones to stock returns, the app allows users to zoom in and zoom out to their time period of interest and accordingly see the price chart. The color of the chart changes to indicate stock performance in that time period 

4. **Hover to get stock price at any given time** The app fetches the relevant price at any given date allowing an easy way to see stock prices


## Some key code snippets 

**Code for autocomplete feature incorporating debounce**

```javascript 
// Bind and debounce the callback to ensure that the API call is made only after a complete ticker has been entered
const bound_search_ticker = this.test_search_ticker.bind(this);
const debounced_search_ticker = this.debounce(bound_search_ticker,250);
ticker_input.on("input", debounced_search_ticker)
```

**Method to construct a URL with the inptu and make the API call**

```javascript
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
```



## Some future enhancements 

1. **Saving and rendering recent searches**
2. **Dropdown to move from price to other security metrics e.g. recent revenue, rolling averages etc.**





