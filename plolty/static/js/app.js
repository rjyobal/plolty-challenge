console.log('Ok connected - app.js');
var jsonData = 'static/js/samples.json';

//Get subject Names from JSON to fillout drop down
function fillDropdown(){
    d3.json(jsonData).then((data) => {
        console.log(data.names);
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
    console.log(selectedSubject);
    fillDemographics(selectedSubject);
}

fillDropdown();

