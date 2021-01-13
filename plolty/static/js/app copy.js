console.log('Ok connected - app.js');
var jsonData = 'static/js/samples.json';

//Get subject Names from JSON to fillout drop down
function fillDropdown(){
    d3.json(jsonData).then((data) => {
        //console.log(data.names);
        let subjectNames = data.names;

        for(x in subjectNames){
            d3.select("#selDataset").append("option").text(subjectNames[x]);
        }
    });
}

//Get demographics based on selectedSubject
function fillDemographics(selectedSubject){
    d3.json(jsonData).then((data) => {
        for (x in data.metadata){
            if(data.metadata[x].id == selectedSubject){
                //console.log(data.metadata[x].ethnicity);
                d3.select('#sample-metadata').html(`
                    id: ${data.metadata[x].id} <br> 
                    ethnicity: ${data.metadata[x].ethnicity} <br>
                    gender: ${data.metadata[x].gender} <br>
                    age: ${data.metadata[x].age} <br>
                    location: ${data.metadata[x].location} <br>
                    bbtype: ${data.metadata[x].bbtype} <br>
                    wfreq: ${data.metadata[x].wfreq}
                `);
            }
        }
    });
}

function optionChanged(selectedSubject){
    console.log(`Selected subject: ${selectedSubject}`);
    fillDemographics(selectedSubject);
    updatePlots(selectedSubject);
}

function init(){
    fillDropdown();
    fillDemographics(940);
    initPlots();
}

function initPlots(){
    console.log('Init Plots');
    //Bar Plot
    var trace1 = {
        x:[1,2,3,4,5,6,7,8,9,10],
        y:['a','b','c','d','f','g','h','i','j','k'],
        type:'bar',
        orientation:'h'
    }
    var chartData=[trace1];
    var layout={
        title:'Top 10 OTUs'
    }
    Plotly.newPlot("bar", chartData, layout);
}

function updatePlots(selectedSubject){
    console.log(`Update Plots for: ${selectedSubject}`);
    d3.json(jsonData).then((data)=>{
        console.log(data.samples);
        for(x in data.samples){
            if(data.samples[x].id == selectedSubject){
                //console.log(data.samples[x].otu_ids);
                //console.log(data.samples[x]);
                //Order OTUs and select Top10
                let top10 = data.samples[x].sample_values.sort((firstNum, secondNum) => secondNum - firstNum);
                top10 = top10.slice(0,10).reverse();
                console.log('top10')
                //console.log(top10);
                console.log(top10.map(x => x.data.samples[x].sample_values));
                // Plotly.restyle("bar","x",[top10])
                // Plotly.restyle("bar","y",[data.samples[x].otu_ids])
                //console.log(data.samples[x].otu_ids);
            }
        }

    });
}

init();

