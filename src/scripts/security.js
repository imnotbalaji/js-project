class Security {
    constructor(ticker){
        console.log(ticker);
        this.ticker = ticker;
        this.data =  [30,80,45, 60, 121, 90, 15];   
    }
    async get_data(){
        
        // debugger;

        // We need this for the url fetching 
        let url = this.url_maker();
        console.log(url);
        const res = await fetch(url);
        const raw_data = await res.json();
        
        // const raw_data =  await d3.json('./test_data/IBM_daily_full.json');
        
        // console.log(raw_data);
        const time_series = raw_data["Time Series (Daily)"];
        let data_array = Object.keys(time_series).map(key => ({timestamp: key, value: parseFloat(time_series[key]["1. open"])}));

        return data_array;
    
    }



    url_maker(){
        let url = "https://www.alphavantage.co/query?"
        let func = "TIME_SERIES_DAILY";
        let symbol = this.ticker.symbol;
        // console.log(symbol);
        // let interval = "60min"
        let output_size = "full"
        let apikey = "XIW7BTPB24E0PU15";

        // return url+"function="+func+"&symbol="+symbol+"&interval="+interval+"&apikey="+apikey;
        return url+"function="+func+"&symbol="+symbol+"&outputsize="+output_size+"&apikey="+apikey;
    }
    

    generateRandomData(){
        const data = []
        const startTime = new Date();
        startTime.setHours(9,0,0,0);
        const endTime = new Date();
        endTime.setHours(17,0,0,0);

        for (let time = startTime; time <= endTime; time.setMinutes(time.getMinutes()+30)){
            const randomPrice = Math.random()*(200-100) + 100;
            data.push({
                timestamp: time.toISOString(),
                value: randomPrice.toFixed(2)
            }
            )
        }
        return data;
    }
}
export default Security;