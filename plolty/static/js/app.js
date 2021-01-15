//Check if JS is properly connected
console.log('Ok connected - app.js');
//Get jsonData
var jsonData = 'static/js/samples.json';

/**
 * Execute init functions
 */
function init(){
    fillDropdown();
    fillDemographics();
    initPlots();
}

/**
 * Get subject Names from JSON to fillout dropdown
 */
function fillDropdown(){
    d3.json(jsonData).then((data) => {
        //console.log(data.names);
        let subjectNames = data.names;
        //Add options to dropdown
        d3.select("#selDataset").append("option").text('-Select Subject-')
        for(x in subjectNames){
            d3.select("#selDataset").append("option").text(subjectNames[x]);
        }
    });
}

/**
 * Get demographics based on selectedSubject
 * @param {string} selectedSubject Selected subject from dropdown
 */
function fillDemographics(selectedSubject){
    console.log(`Fill Demographics: ${selectedSubject}`);
    d3.select('#sample-metadata').html('');
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

/**
 * Initialize Plolty plots on refresh
 */
function initPlots(){
    console.log('Init Plots');
    //Init Bar Plot
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
    //Init Bubble Plot
    var trace2 = {
        x:[1,2,3,4,5,6,7,8,9,10],
        y:[10,20,30,40,50,60,70,80],
        text:['a','b','c','d','f','g','h','i','j','k'],
        mode:'markers',
        marker:{
            size: [5,10,15,20,25,30,35,40,45,50],
            color: [10,20,30,40,50,60,70,80]
        }
    }
    var chartData2=[trace2];
    var layout2={
        title:'Bubble Chart'
    }
    Plotly.newPlot("bubble", chartData2, layout2);
    //Init Gauge Plot
    var data = [
        {
          value: 0,
          title: { text: "Scrubs per Week" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "#F7F2EC"},
              { range: [1, 2], color: "#F3F0E4" },
              { range: [2, 3], color: "#E8E6C8" },
              { range: [3, 4], color: "#E4E8AF" },
              { range: [4, 5], color: "#D4E494" },
              { range: [5, 6], color: "#B6CC8A" },
              { range: [6, 7], color: "#86BF7F" },
              { range: [7, 8], color: "#84BB8A" },
              { range: [8, 9], color: "#7FB485" },
            ],
          }
        }
      ];
      Plotly.newPlot('gauge', data);
}

/**
 * Update plots based on seleceted subject
 * @param {string} selectedSubject Selected subject from dropdown
 */
function updatePlots(selectedSubject){
    console.log(`Update Plots for: ${selectedSubject}`);
    d3.json(jsonData).then((data)=>{
        //console.log(data.samples);
        for(x in data.samples){
            if(data.samples[x].id == selectedSubject){
                //console.log(data.samples[x].otu_ids);
                //Order OTUs and select Top10
                let top10 = data.samples[x].sample_values.sort((firstNum, secondNum) => secondNum - firstNum);
                let top10ids = data.samples[x].otu_ids.sort(function(a,b){return top10.indexOf(a)-top10.indexOf(b)});
                let top10labels = data.samples[x].otu_labels.sort(function(a,b){return top10.indexOf(a)-top10.indexOf(b)});
                top10 = top10.slice(0,10).reverse();
                top10ids = top10ids.slice(0,10).reverse();
                top10ids = top10ids.map(i => 'OTU-' + i);
                top10labels = top10labels.slice(0,10).reverse();
                //console.log(top10labels);

                //Restyle Bar Plot
                Plotly.restyle("bar","x",[top10]);
                Plotly.restyle("bar","y",[top10ids]);
                Plotly.restyle("bar","text",[top10labels]);
                //console.log(data.samples[x].otu_ids);

                //Restyle Bubble Plot
                let x_bubble = data.samples[x].otu_ids
                let y_bubble = data.samples[x].sample_values
                let marker_bubble = {size:y_bubble, color:x_bubble}
                let text_bubble = data.samples[x].otu_labels
                Plotly.restyle("bubble","x",[x_bubble]);
                Plotly.restyle("bubble","y",[y_bubble]);
                Plotly.restyle("bubble","marker",[marker_bubble]);
                Plotly.restyle("bubble","text",[text_bubble]);
            }
        }
        //BONUS - Restyle Gauge Plot
        for(y in data.metadata){
            if(data.metadata[y].id == selectedSubject){
                //console.log(data.metadata[y].wfreq);
                let wfreq = data.metadata[y].wfreq
                Plotly.restyle("gauge","value",[wfreq])
            }
        }
    });
}

/**
 * Refresh demographics and plots
 * @param {string} selectedSubject Selected subject from dropdown
 */
function optionChanged(selectedSubject){
    console.log(`Selected subject: ${selectedSubject}`);
    if(selectedSubject==='-Select Subject-'){
        fillDemographics();
        initPlots();
    }else{
        fillDemographics(selectedSubject);
        updatePlots(selectedSubject);
    }
}

//Execute init fuctions
init();

