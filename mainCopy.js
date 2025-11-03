// mainCopy.js

document.addEventListener("DOMContentLoaded", () => {
  // Detect which page we're on
  const isNewActivityPage = document.body.classList.contains("newActivityPage");
  const isProfilePage = document.body.classList.contains("singlePetProfilePage");

  // Load stored data or create empty structure
  const petName = "Bruno"; // You can make this dynamic later
  const storedData = JSON.parse(localStorage.getItem("petActivity")) || {};
  if (!storedData[petName]) {
    storedData[petName] = {
      weight: [],
      walking: [],
      medication: [],
      events: []
    };
  }

  // ============================================
  // 🟢 NEW ACTIVITY PAGE LOGIC
  // ============================================
  if (isNewActivityPage) {
    const form = document.querySelector("form");

    form.addEventListener(".submit", (event) => {
      event.preventDefault();

      // Gather form values
      const title = document.querySelector("#title").value;
      const date = document.querySelector("#date").value;
      const time = document.querySelector("#time").value;
      const category = document.querySelector("#category").value;
      const amount = parseFloat(document.querySelector("#amount").value);
      const description = document.querySelector("#description").value;
      const reminderDate = document.querySelector("#reminder-date").value;
      const reminderTime = document.querySelector("#reminder-time").value;

      // Create new activity object
      const newActivity = {
        title,
        date,
        time,
        category,
        amount,
        description,
        reminderDate,
        reminderTime,
        timestamp: new Date().toISOString()
      };

      // Add to events list
      storedData[petName].events.push(newActivity);

      // Add numerical data to graphs
      if (category === "weight") storedData[petName].weight.push(amount);
      if (category === "walking") storedData[petName].walking.push(amount);
      if (category === "medication") storedData[petName].medication.push(amount);

      // Save to localStorage
      localStorage.setItem("petActivity", JSON.stringify(storedData));

      alert("✅ Activity saved successfully!");
      window.location.href = "profiles.html"; // Go back to the dashboard page
    });
  }

  // ============================================
  // 🔵 PROFILE PAGE LOGIC (graphs + events)
  // ============================================
  if (isProfilePage) {
    const data = storedData[petName];

    // --------- Chart.js setup ----------
    function createBarChart(canvasId, label, dataArray, color) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;

      const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: label,
            data: dataArray.slice(-7), // show last 7 entries
            backgroundColor: color,
            borderRadius: 6,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // Create the three graphs
    createBarChart("weightGraph", "Weight (lbs)", data.weight, "#789851");
    createBarChart("walkGraph", "Walking (Miles)", data.walking, "#789851");
    createBarChart("medicationGraph", "Medication (mg)", data.medication, "#789851");

    // --------- Upcoming Events Section ----------
    const upcomingSection = document.querySelector(".upcomingEvents");
    if (upcomingSection && data.events.length > 0) {
      // Clear any static example event
      const existingObjects = upcomingSection.querySelectorAll(".eventObject");
      existingObjects.forEach(obj => obj.remove());

      // Show the 3 most recent upcoming events
      data.events.slice(-3).forEach(event => {
        const div = document.createElement("div");
        div.classList.add("eventObject");
        div.innerHTML = `
          <img src="images/hospital-icon.png" />
          <div class="textItems">
            <h4>${event.title}</h4>
            <p><time datetime="${event.date}">${event.date}</time></p>
            <p>${event.description}</p>
          </div>
        `;
        upcomingSection.prepend(div);
      });
    }
  }
});
