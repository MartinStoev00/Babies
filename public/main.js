const prevData = []
const socket = io();
const dropdownSelect = document.getElementById("dropdown-select");
const dropdownOptions = document.getElementById("dropdown-options");
const result = document.getElementById("result");
const chartSelect = (chartName) => {
    return new Chart(document.getElementById(chartName).getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "Weight",
                borderColor = "rgb(75, 192, 192)",
                data: [],
                borderWidth: 2,
                fill = true,
                tension = 0.1
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

const myChartLive = chartSelect("liveChart")

fetch("http://localhost:3000/babies")
    .then(res => res.json())
    .then(res => {
        console.log(res)
        res.forEach(({start, end ,babies}, index) => {
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

            babies.sort(({time: t1}, {time: t2}) => {
                return new Date(t1) - new Date(t2)
            })
            .forEach(({speed, time}) => {    
                const h = new Date(time).getHours().toString().padStart(2, '0')
                const m = new Date(time).getMinutes().toString().padStart(2, '0')
                const s = new Date(time).getSeconds().toString().padStart(2, '0')
                const t = `${h}:${m}:${s}` 
                updateChart(myChartLive, speed, t)
            })
        })
    })
    .catch(console.log)



socket.on("data", ({speed, date}) => {
    const h = new Date(date).getHours().toString().padStart(2, '0')
    const m = new Date(date).getMinutes().toString().padStart(2, '0')
    const s = new Date(date).getSeconds().toString().padStart(2, '0')
    const time =  `${h}:${m}:${s}` 
    updateChart(myChartLive, speed, time)
});

function updateChart(chart, dataValue, dataLabel) {
    chart.data.labels.push(dataLabel);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(dataValue);
    });
    chart.update()
}