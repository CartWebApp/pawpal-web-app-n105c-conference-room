const button = document.querySelector(".back-button");
const filterButton = document.querySelector(".filter");
const filterOverlay = document.querySelector(".filter-overlay"); // Select the overlay element
const closeOverlayButton = document.querySelector(".close-overlay"); // Select the close button

button.addEventListener("click", () => {
    window.history.back();
});
filterButton.addEventListener("click", () => {
    // Implement filter functionality here
    openFilterOptions();
});

// Function to open the overlay
function openFilterOptions() {
    if (filterOverlay) {
        filterOverlay.style.display = "block";
    }
}

// Function to close the overlay
function closeFilterOptions(event) {
    if (filterOverlay) {
        filterOverlay.style.display = "none";
    }
    const type = event.target.parentElement.querySelector(
        'input[name="filterOption"]:checked'
    ).value;
    sort_activities(activities, type);
}

/**
 * @param {HTMLUListElement} activities
 * @param {'a-z' | 'z-a' | 'recent' | 'oldest'} type
 */
function sort_activities(activities, type) {
    const items = Array.from(activities.children);
    switch (type) {
        case "a-z": {
            activities.replaceChildren(
                ...items.sort((a, b) => {
                    const textA = a
                        .querySelector(".event-details > h2")
                        .textContent.trim()
                        .toLowerCase();
                    const textB = b
                        .querySelector(".event-details > h2")
                        .textContent.trim()
                        .toLowerCase();
                    return textA.localeCompare(textB);
                })
            );
            break;
        }
        case "z-a": {
            activities.replaceChildren(
                ...items.sort((a, b) => {
                    const textA = a
                        .querySelector(".event-details > h2")
                        .textContent.trim()
                        .toLowerCase();
                    const textB = b
                        .querySelector(".event-details > h2")
                        .textContent.trim()
                        .toLowerCase();
                    return textB.localeCompare(textA);
                })
            );
            break;
        }
        case "recent": {
            activities.replaceChildren(
                ...items.sort((a, b) => {
                    const dateA = new Date(
                        a.querySelector(".event-details > p").textContent.slice(2).replace(/,|th/g, '').trim()
                    );
                    const dateB = new Date(
                        b.querySelector(".event-details > p").textContent.slice(2).replace(/,|th/g, '').trim()
                    );
                    return dateB - dateA;
                })
            );
            break;
        }
        case "oldest": {
            activities.replaceChildren(
                ...items.sort((a, b) => {
                    const dateA = new Date(
                        a.querySelector(".event-details > p").textContent.slice(2).replace(/,|th/g, '').trim()
                    );
                    const dateB = new Date(
                        b.querySelector(".event-details > p").textContent.slice(2).replace(/,|th/g, '').trim()
                    );
                    return dateA - dateB;
                })
            );
            break;
        }
    }
}

const filter_button = document.querySelector("#filterForm > button");
const activities = document.querySelector("article > section > ul");
if (filter_button) {
    filter_button.addEventListener("click", closeFilterOptions);
}

// Add event listener to close button
if (closeOverlayButton) {
    closeOverlayButton.addEventListener("click", () => {
        if (filterOverlay) {
            filterOverlay.style.display = "none";
        }
    });
}

// Optional: Close the overlay if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target === filterOverlay) {
        closeFilterOptions();
    }
});
const checkboxes = document.querySelectorAll('input[name="filterOption"]');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
        if (this.checked) {
            checkboxes.forEach((otherCheckbox) => {
                if (otherCheckbox !== this) {
                    otherCheckbox.checked = false;
                }
            });
            // You can add logic here to apply the filter immediately
            console.log(`Filter selected: ${this.value}`);
        }
    });
});
