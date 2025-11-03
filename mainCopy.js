// dashboard.js

// Example: Load user data from localStorage or use defaults
const storedData = JSON.parse(localStorage.getItem('petActivity')) || {};

const petData = storedData['Bruno'] || {
    weight: [40, 42, 43, 41, 44, 45, 46],
    walking: [1, 2, 1.5, 3, 2.5, 4, 5],
    medication: [10, 8, 12, 6, 14, 15, 10]
};

// Labels for the week
const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

document.addEventListener("DOMContentLoaded", () => {
    // chart creation code here
    // Function to create bar charts using Chart.js
    function createBarChart(canvasId, label, data, color) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: color,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 5 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }


    // Initialize all graphs
    document.addEventListener("DOMContentLoaded", () => {
        createBarChart('weightChart', 'Weight (lbs)', petData.weight, '#86A873');
        createBarChart('walkingChart', 'Walking (Miles)', petData.walking, '#C2EABD');
        createBarChart('medicationChart', 'Medication (mg)', petData.medication, '#E08E45');
    });
});

// log-activity.js
function savePetData(petName, category, newValue) {
    const data = JSON.parse(localStorage.getItem('petActivity')) || {};
    data[petName] = data[petName] || { weight: [], walking: [], medication: [] };

    data[petName][category].push(newValue);
    localStorage.setItem('petActivity', JSON.stringify(data));
}

savePetData('Bruno', 'walking', 4.2);


// new-activity.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form"); // assuming you have one <form> element

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Get form data
        const title = document.querySelector("#title").value;
        const date = document.querySelector("#date").value;
        const time = document.querySelector("#time").value;
        const category = document.querySelector("#category").value;
        const amount = parseFloat(document.querySelector("#amount").value);
        const description = document.querySelector("#description").value;

        // Load current data or create new object
        const data = JSON.parse(localStorage.getItem("petActivity")) || {};
        const petName = "Bruno"; // (You can replace this with dynamic pet selection later)

        // Initialize pet data if missing
        if (!data[petName]) {
            data[petName] = {
                weight: [],
                walking: [],
                medication: [],
                events: []
            };
        }

        // Add event to "upcoming events"
        data[petName].events.push({
            title,
            date,
            time,
            category,
            amount,
            description
        });

        // Add numerical data to the right chart
        if (category === "weight") data[petName].weight.push(amount);
        if (category === "walking") data[petName].walking.push(amount);
        if (category === "medication") data[petName].medication.push(amount);

        // Save back to localStorage
        localStorage.setItem("petActivity", JSON.stringify(data));

        alert("Activity saved!");
        window.location.href = "dashboard.html"; // Go back to dashboard
    });
});

// dashboard.js (add this near the bottom)

function displayUpcomingEvents() {
    const container = document.getElementById("upcomingEvents");
    const data = JSON.parse(localStorage.getItem("petActivity")) || {};
    const pet = data["Bruno"];
    if (!pet || !pet.events) return;

    container.innerHTML = ""; // clear old items

    pet.events.slice(-3).forEach(event => {
        const div = document.createElement("div");
        div.classList.add("event-card");
        div.innerHTML = `
      <h4>${event.title}</h4>
      <p>${event.date} at ${event.time}</p>
      <p>Category: ${event.category}</p>
    `;
        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    displayUpcomingEvents();
});
