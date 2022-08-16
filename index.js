// const express = require("express");
const csv = require("csvtojson");




const csvFilePath = `./matches.csv`;
const csvFilePathOne =`./deliveries.csv`;

let matches ;
let deliveries ;



(async()=>{

    matches = await csv().fromFile(csvFilePath);
    console.log(`
    
    MatchesPerYear..........
    
    `)

    const  years = matches.map(item => Number(item.season));
    const  seasons = [...new Set(years)].sort();

    let numberOfMatchesPerYear =[];
    for(let year of seasons){
        let matchCount = years.filter(e=>e===year) ;
        numberOfMatchesPerYear.push({
            'season' : year ,
            'matches' : matchCount.length
        })
    }
    console.log( numberOfMatchesPerYear)
    
})();


  
// console.log(totalMatches());

(async()=>{

    matches =await csv().fromFile(csvFilePath);
    console.log(`
    
    WinsPerTeam .... 
    
    `)

    const winnerList = matches.map(item => item.winner);

    const teams = [...new Set(winnerList)].sort();

    let teamWins = []; //2

    for (const team of teams) {
        const matchCount = winnerList.filter(e => e === team);
        teamWins.push({
            'team': team,
            'matches': matchCount.length
        });
    }
    console.log(teamWins)

})() ;

( async () => {
    deliveries = await csv().fromFile(csvFilePathOne);

    matches = await csv().fromFile(csvFilePath);

    let matchIds = [];
    let result = {}

    console.log(`
    Extra runs..
    `)

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

    console.log(result);
})();

(async()=>{
    

    matches = await csv().fromFile(csvFilePath);

    deliveries = await csv().fromFile(csvFilePathOne);

    console.log(`
    Most Economical Bowler...
    `)

    let matchIds = [];
    let matchPlayedInYear;
    let bowlers = {};


    matches.forEach(item=>{
        if (Number(item.season) === 2015) matchIds.push(item.id)
    })
    
    matchIds.forEach(item =>{

         matchPlayedInYear = deliveries.filter(e=> e.match_id === item)
    })


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
    Object.keys(bowlers).forEach(item => {
        const bowler = bowlers[item];
 
        const economy = Number((bowler.runsGiven / (bowler.bowled / 6)).toFixed(1));

        bowlers[item] = { ...bowlers[item], overs: Number((bowler.bowled / 6).toFixed(1)), economy };
        if (currRate > Number((bowler.runsGiven / (bowler.bowled / 6)).toFixed(1))) {
            currRate = economy,
                economicalBowler = { bowler: item, ...bowlers[item] };
        }
    });



    console.log(economicalBowler);
})();


(async()=>{
    matches = await csv().fromFile(csvFilePath);

    console.log(`
    
    Matches played in the Stadium
    
    `);

    const venues ={} ;

    matches.forEach(item => {
        if (venues.hasOwnProperty(item.venue)){
            const matchesPlayed =  venues[item.venue]+ 1;
            venues[item.venue] =matchesPlayed
        }
        else{
            const matchesPlayed = 1 ;
            (venues[item.venue ] )= matchesPlayed;
        }
    })
    console.log(venues)
    
})();


    








