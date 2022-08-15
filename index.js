const express = require("express");
const csv = require("csvtojson");

const app = express();


const csvFilePath = `./matches.csv`;





app.get("/", async ( req,res) => {

    const jsonArray = await csv().fromFile(csvFilePath);
    const years = jsonArray.map(item => Number(item.season));
    const seasons = [...new Set(years)].sort();

    let noOfMatchesPerYear = []; // 1 

    for (const year of seasons) {
        const matchCount = years.filter(e => e === year);
        noOfMatchesPerYear.push({
            'season': year,
            'matches': matchCount.length
        });
    }
    res.send(noOfMatchesPerYear);
});


app.get("/teamWins",async(req,res)=>{
    const jsonArray =await csv().fromFile(csvFilePath);
    const winnerList = jsonArray.map(item => item.winner);
    console.log(winnerList)
    const teams = [...new Set(winnerList)].sort();
    let teamWins = []; //2

    for (const team of teams) {
        const matchCount = winnerList.filter(e => e === team);
        teamWins.push({
            'team': team,
            'matches': matchCount.length
        });
    }
    res.send(teamWins)

})

app.get("/extras", async (req, res) => {
    const csvFilePath = `./deliveries.csv`;
    const deliveries = await csv().fromFile(csvFilePath);

    const csvFilePathOne = `./matches.csv`;
    const matches = await csv().fromFile(csvFilePathOne);

    let matchIds = [];
    let result = {}

    matches.forEach(item => {
        if (Number(item.season) === 2016) matchIds.push(item.id)
    })

    matchIds.forEach((item) => {
        const row = deliveries.filter(e => e.match_id === item);
        row.forEach(item => {
            if (result.hasOwnProperty(item.bowling_team)) {
                result[item.bowling_team] = result[item.bowling_team] + Number(item.extra_runs)
            }
            else {
                result[item.bowling_team] = Number(item.extra_runs)
            }
        })
    })

    res.send(result);
});

    
app.get("/eco", async (req, res) => {
    console.log("first");
    const csvFilePathOne = `./matches.csv`;
    const matchesData = await csv().fromFile(csvFilePathOne);

    const csvFilePath = `./deliveries.csv`;
    const data = await csv().fromFile(csvFilePath);

    let matchIds = [];
    let matchPlayedInYear;
    let bowlers = {};

    matchesData.forEach(item=>{
        if (Number(item.season) === 2015) matchIds.push(item.id)
    })
    
    matchIds.forEach(item =>{

         matchPlayedInYear = data.filter(e=> e.match_id === item)
    })

    // console.log(matchPlayedInYear);

    matchPlayedInYear.forEach(item => {
        if (bowlers.hasOwnProperty(item.bowler)) {
            const bowled = item.ball <= 6 ? bowlers[item.bowler].bowled + 1 : bowlers[item.bowler].bowled;
            const runsGiven = bowlers[item.bowler].runsGiven + Number(item.total_runs);

            bowlers[item.bowler] = { bowled, runsGiven };
        }
        else {
            const bowled = 1;
            const runsGiven = Number(item.total_runs);

            bowlers[item.bowler] = { bowled, runsGiven};
        }
    });

    
    // console.log(bowlers);

    let economicalBowler = {};

    let currRate = 100;
console.log(bowlers);
    Object.keys(bowlers).forEach(item => {
        const bowler = bowlers[item];
 
        const economy = Number((bowler.runsGiven / (bowler.bowled / 6)).toFixed(1));

        bowlers[item] = { ...bowlers[item], overs: Number((bowler.bowled / 6).toFixed(1)), economy };
        if (currRate > Number((bowler.runsGiven / (bowler.bowled / 6)).toFixed(1))) {
            currRate = economy,
                economicalBowler = { bowler: item, ...bowlers[item] };
        }
    });



    res.send(economicalBowler);
});

app.get("/orangecap",async(req,res)=>{
    const matchpath = `./matches.csv`
    const matches = await csv().fromFile(matchpath);
    const deliveriesPath = `./deliveries.csv`
    const deliveries = await csv().fromFile(deliveriesPath);

    let matchIds = []

    matches.forEach(item => {
        if(Number(item.season)===2017)   matchIds.push(item.id)
    })

    matchIds.forEach(e=>{
        matchesInTheYear= deliveries.filter(item => item.match_id===e)
    })

    let batsmen ={};

    matchesInTheYear.forEach(item => {
        console.log(item.batsman);
        if(batsmen.hasOwnProperty(item.batsman)){
            const batsman = item.batsman ;
                        // const runs = batsmen[item.runs]+item.batsman_runs;
             const runs= Number(batsmen[batsman].runs) + Number(item.batsman_runs)
            let innings = batsmen[batsman].innings
            if(innings !== item.match_id){
                innings ++
            }
            batsmen [batsman]= {innings , runs};
        }
        else {
            const batsman = item.batsman ;
            const runs = item.batsman_runs ;
            const innings = 1 ;
            batsmen [batsman]= {innings , runs};
        }
    })
    // console.log(batsmen)

})

app.listen(8099);


    








