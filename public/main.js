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
                label: "Feeding Speed",
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
            e.onclick = () => {
                dropdownOptions.style.display = "none"

                myChartData.data.labels = []
                myChartData.data.datasets.data = []
                myChartData.update()

                babies.sort(({time: t1}, {time: t2}) => {
                    return new Date(t1) - new Date(t2)
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