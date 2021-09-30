const prevData = []
const socket = io();
const dropdownSelect = document.getElementById("dropdown-select");
const dropdownOptions = document.getElementById("dropdown-options");
const result = document.getElementById("result");
const chartSelect = (chartName) => {
    return new Chart(document.getElementById(chartName).getContext('2d'), {
        type: 'line',
        data: {
            datasets: [{
                label: "Feeding Speed",
                borderWidth: 2,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const myChartLive = chartSelect("liveChart")
const myChartData = chartSelect("dataChart")

fetch("http://localhost:3000/babies")
    .then(res => res.json())
    .then(res => {
        console.log(res)
        res.forEach(({start, end ,babies}) => {
            const e = document.createElement('button');
            e.className = "dropdown-option"
            const startDate = new Date(start)
            const endDate = new Date(end)
            const dayDate = startDate.getDate()
            const monthDate = startDate.getMonth()
            const yearDate = startDate.getFullYear()
            const startHour = startDate.getHours().toString().padStart(2, '0')
            const endHour = endDate.getHours().toString().padStart(2, '0')
            const startMinute = startDate.getMinutes().toString().padStart(2, '0')
            const endMinute = endDate.getMinutes().toString().padStart(2, '0')
            e.onclick = () => {
                dropdownOptions.style.display = "none"
                myChartData.data.labels = []
                myChartData.data.datasets.data = []
                myChartData.update()

                babies.sort((o1, o2) => {
                    return new Date(o1.time) - new Date(o2.time)
                  })
                .forEach(({speed, time}) => {    
                    const h = new Date(time).getHours().toString().padStart(2, '0')
                    const m = new Date(time).getMinutes().toString().padStart(2, '0')
                    const s = new Date(time).getSeconds().toString().padStart(2, '0')
                    const t = `${h}:${m}:${s}` 
                    updateLiveChart(myChartData, speed, t)
                })
            }
            e.innerHTML = `${dayDate}-${monthDate}-${yearDate}(${startHour}:${startMinute}-${endHour}:${endMinute})`
            dropdownOptions.appendChild(e)
        })
    })
    .catch(console.log)

dropdownSelect.onclick = () => {
    if(dropdownOptions.style.display === "block") {
        dropdownOptions.style.display = "none"
    } else {
        dropdownOptions.style.display = "block"
    }
}


socket.on("data", ({speed, date}) => {
    const h = new Date(date).getHours().toString().padStart(2, '0')
    const m = new Date(date).getMinutes().toString().padStart(2, '0')
    const s = new Date(date).getSeconds().toString().padStart(2, '0')
    const time =  `${h}:${m}:${s}` 
    updateLiveChart(myChartLive, speed, time)
});

function updateLiveChart(chart, dataValue, dataLabel) {
    chart.data.labels.push(dataLabel);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(dataValue);
    });
    chart.update()
}