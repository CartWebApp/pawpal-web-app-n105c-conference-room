// mainCopy.js

// Adding a new profile //
// Pet Profiles - Vanilla JS, localStorage

document.addEventListener('DOMContentLoaded', function() {
    // Modal controls (example: open/close handlers)
    const modal = document.getElementById('newPetOverlay');
    const openModalBtn = document.getElementsById('addNewPet');
    const closeModalBtn = document.getElementById('exitOverlay');
    if (openModalBtn && modal) openModalBtn.onclick = () => modal.style.display = 'block';
    if (closeModalBtn && modal) closeModalBtn.onclick = () => modal.style.display = 'none';

    const form = document.getElementById('newPetForm');
    const imgInput = document.getElementById('petImageInput');
    const imgDrop = document.getElementById('petImageInput');
    let imageBase64 = '';

    // Drag-and-drop support for image
    if(imgDrop) {
        imgDrop.ondragover = (e) => { e.preventDefault(); imgDrop.classList.add('dragover'); };
        imgDrop.ondragleave = (e) => { e.preventDefault(); imgDrop.classList.remove('dragover'); };
        imgDrop.ondrop = (e) => {
            e.preventDefault();
            imgDrop.classList.remove('dragover');
            let file = e.dataTransfer.files[0];
            handleImageFile(file);
        };
    }

    // Fallback to input[type='file']
    if(imgInput) {
        imgInput.onchange = (e) => {
            let file = e.target.files[0];
            handleImageFile(file);
        };
    }

    function handleImageFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        let reader = new FileReader();
        reader.onload = function(evt) {
            imageBase64 = evt.target.result;
            if(imgDrop) imgDrop.style.backgroundImage = `url('${imageBase64}')`;
        };
        reader.readAsDataURL(file);
    }

    if(form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            // Collect and validate fields
            const name = form.elements['petName'].value.trim();
            const breed = form.elements['petBreed'].value.trim();
            const weight = form.elements['petWeight'].value.trim();
            const dob = form.elements['petDOB'].value.trim();
            if (!name || !breed || !weight || !dob) {
                alert('Please fill out all fields.');
                return;
            }
            const pet = {
                id: Date.now(),
                name,
                breed,
                weight: parseFloat(weight),
                dob,
                image: imageBase64
            };
            savePetProfile(pet);
            // Optionally close modal and reset form
            if(modal) modal.style.display = 'none';
            form.reset();
            imageBase64 = '';
            if(imgDrop) imgDrop.style.backgroundImage = '';
            renderPetProfiles();
        };
    }

    // Storage utilities
    function getPetProfiles() {
        return JSON.parse(localStorage.getItem('petProfiles') || '[]');
    }
    function savePetProfile(pet) {
        const pets = getPetProfiles();
        pets.push(pet);
        localStorage.setItem('petProfiles', JSON.stringify(pets));
    }

    // Simple example rendering: add your own DOM logic
    function renderPetProfiles() {
        const pets = getPetProfiles();
        const container = document.getElementById('petProfilesContainer');
        if(!container) return;
        container.innerHTML = '';
        pets.forEach(pet => {
            const div = document.createElement('div');
            div.className = 'pet-profile';
            div.innerHTML = `
                <div class="pet-thumb" style="width:64px;height:64px;background-image:url('${pet.image || ''}');background-size:cover;"></div>
                <div><strong>${pet.name}</strong></div>
                <div>${pet.breed}</div>
                <div>${pet.weight} lbs</div>
                <div>${pet.dob}</div>
            `;
            container.appendChild(div);
        });
    }

    // Initial render
    renderPetProfiles();
});






/* Logging activites */

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
