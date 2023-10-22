class Security {
    constructor(ticker){
        // debugger
        this.ticker = ticker;
        this.data =  [30,80,45, 60, 121, 90, 15];   
    }
    async get_data(){
        // debugger
        // const res = await fetch("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo")
        // console.log(this.ticker);
        // const raw_data =  await d3.json("./test_data/test_data.json");
        // const time_series = raw_data["Time Series (Daily)"];
        // let data_array = Object.keys(time_series).map(key => ({name: key, open: parseFloat(time_series[key]["1. open"])}));
        // let data = this.generateRandomArray(100, 100,200);
        // let data_array2 = data.map((ele)=> ({name: `${ele}`, open: ele}));
        // debugger

        let data_array3 =  this.generateRandomData();
        console.log(data_array3);
        // debugger
        return data_array3;
    
    }

    generateRandomArray(num, min, max) {
        var randomArray = [];
        for (var i = 0; i < num; i++) {
            var randomNum = Math.random() * (max - min) + min;
            randomArray.push(randomNum);
        }
        return randomArray;
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