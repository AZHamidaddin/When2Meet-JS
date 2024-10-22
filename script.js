const startTime = document.getElementById("start-time");
const endTime = document.getElementById("end-time");

let startHour = 8
let endHour = 17

populateDropdown(startTime, 8)
populateDropdown(endTime, 17)

function populateDropdown(selectElem, selectedValue) {
    for (let i = 0; i < 24; i++) {
        let optionElem = document.createElement("option")
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ":00"
        hour += i < 12 ? " AM" : " PM"
        optionElem.text = hour
        optionElem.value = i
        if (i === selectedValue) {
            optionElem.selected = true
        }

        selectElem.appendChild(optionElem)
    }
}

startTime.addEventListener("change", function() {
    startHour = parseInt(this.value)
    createTable()
});

endTime.addEventListener("change", function() {
    endHour = parseInt(this.value)
    createTable()
});

function createTable() {
    const container = document.getElementById("timeTable")

    let tableHTML = "<table><thead><tr><th></th>"
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    days.forEach(day => {
        tableHTML += `<th class="day-header">${day}</th>`
    })

    tableHTML += "</tr></thead><tbody>"

    for (let i = startHour; i <= endHour; i++) {
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ":00"
        hour += i < 12 ? " AM" : " PM"
        
        tableHTML += `<tr><td class="time-label">${hour}</td>`;
        days.forEach(day => {
            tableHTML += `<td class="time-slot" onclick="toggleTimeSlot(this)" data-day="${day}" data-time="${hour}"></td>`
        });

        tableHTML += "</tr>";
    }

    tableHTML += "</tbody></table>"
    container.innerHTML = tableHTML;
};

const selectedTimeSlots = new Set();

function toggleTimeSlot(tdElem) {
    const timeSlotId = `${tdElem.dataset.day}-${tdElem.dataset.time}`
    if (selectedTimeSlots.has(timeSlotId)) {
        selectedTimeSlots.delete(timeSlotId)
        tdElem.classList.remove("selected")
    }

    else {
        selectedTimeSlots.add(timeSlotId)
        tdElem.classList.add("selected")
    }

}

document.getElementById("submitMeeting").addEventListener("click", async function () {
    const username = document.getElementById("user-name").value;
    const eventName = document.getElementById("event-name").value;

    if (!username || !eventName) {
        alert("Please enter your name and the event name.")
        return
    }

    const payload = {
        username: username,
        eventName: eventName,
        slots: [...selectedTimeSlots]
    }

    const api_url = "https://jsonplaceholder.typicode.com/posts"
    const response = await (fetch(api_url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
            "Content-type": "application/json"
        }
        
    }));

    const data = await response.json();
    console.log(`We got this response from the server:`)
    console.log(data)
})

createTable()
