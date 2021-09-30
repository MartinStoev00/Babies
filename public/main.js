const prevData = []
const socket = io();
const dropdownSelect = document.getElementById("dropdown-select");
const dropdownOptions = document.getElementById("dropdown-options");
const result = document.getElementById("result");
const chartSelect = (chartName, dull) => {
    let borderColor = "rgb(75, 192, 192)";
    let tension = 0.2;
    let fill = true
    if (dull == true) {
        borderColor = "rgb(123, 123, 123)"
        tension = 0.1;
        fill = false
    }
    return new Chart(document.getElementById(chartName).getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Weight",
                borderColor,
                data: [],
                borderWidth: 2,
                fill,
                tension
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: {
                    beginAtZero: true
                }
            }
        }
    });
}

const myChartLive = chartSelect("liveChart", false)
const myChartData = chartSelect("dataChart", true)

let fetchedData = [];

/*example:
[
{
    date: date,
    data: [1,2,3,4,5]
    times: [time, time, time, time, time]
}
]






*/
function getDayList(date){
    for (let i = 0; i < fetchedData.length; i++) {
        if (fetchedData[i].date == date) {
            return fetchedData;
        }
    }
}


fetch("http://localhost:3000/babies")
    .then(res => res.json())
    .then(res => {
        console.log(res)
        res.forEach(({day ,babies}, index) => {
            const e = document.createElement('button');
            e.className = "dropdown-option"

            e.onclick = () => {
                dropdownOptions.style.display = "none"
                myChartData.data.datasets[0].data = [];
                myChartData.data.labels = [];
                myChartData.update()

                for (let i = 0; i < babies.length; i++) {
                    updateChart(myChartData, babies[i].speed, babies[i].time)
                }
            }
            e.innerHTML = `${day}`
            dropdownOptions.appendChild(e)
        })
    })
    .catch(console.log)

dropdownSelect.onclick = () => {
    let index = 0
    if(dropdownOptions.style.display === "block") {
        dropdownOptions.style.display = "none"
        dropdownSelect.style.borderRadius = "10px"
        index++
        Array.prototype.forEach.call(document.getElementsByClassName("dropdown-option"), (el) => {
            setTimeout(() => {
                el.style.display = "none"
                el.style.opacity = "0"
            }, index*100)
        });
    } else {
        dropdownOptions.style.display = "block"
        dropdownSelect.style.borderRadius = "10px 10px 0 0"
        Array.prototype.forEach.call(document.getElementsByClassName("dropdown-option"), (el) => {
            index++
            setTimeout(() => {
                el.style.display = "block"
                el.style.opacity = "1"
            }, index*100)
        });
    }
}


socket.on("data", ({speed, time}) => {
    updateChart(myChartLive, speed, time)
});

function updateChart(chart, dataValue, dataLabel) {
    chart.data.labels.push(dataLabel);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(dataValue);
    });
    chart.update()
}