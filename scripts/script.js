// Initialize variables
const symptomInput = document.getElementById("symptomInput");
const suggestionsList = document.getElementById("suggestions");
const predictButton = document.getElementById("predictButton");
const resetButton = document.getElementById("resetButton");
const resultsDiv = document.getElementById("results");
const prescriptionsDiv = document.getElementById("prescriptions");
let selectedSymptoms = [];

// Function to show pop-ups with animation
function showPopup(message) {
    let popup = document.createElement("div");
    popup.classList.add("popup");
    popup.textContent = message;
    document.body.appendChild(popup);
    
    // Click to dismiss
    popup.addEventListener("click", () => popup.remove());
    
    setTimeout(() => popup.remove(), 2500);
}

// Function to filter symptoms and show suggestions
symptomInput.addEventListener("input", () => {
    const query = symptomInput.value.toLowerCase();
    suggestionsList.innerHTML = ""; // Clear previous suggestions

    if (query) {
        // Find matching symptoms in the dataset
        const allSymptoms = [...new Set(Object.values(dataset).flat())];
        const matches = allSymptoms.filter(symptom =>
            symptom.toLowerCase().includes(query)
        );

        // Populate suggestions dropdown
        matches.forEach(match => {
            const li = document.createElement("li");
            li.textContent = match;
            li.classList.add("suggestion-item");
            li.addEventListener("click", () => {
                if (!selectedSymptoms.includes(match)) {
                    selectedSymptoms.push(match);
                    updateResults();
                    showPopup(`✅ Added: ${match}`);
                }
                symptomInput.value = ""; // Clear input
                suggestionsList.innerHTML = ""; // Clear suggestions
            });
            suggestionsList.appendChild(li);
        });
    }
});

// Function to update the results display
function updateResults() {
    resultsDiv.innerHTML = `Selected Symptoms: ${selectedSymptoms.join(", ")}`;
}

// Predict Diseases with pop-up animation
predictButton.addEventListener("click", () => {
    if (selectedSymptoms.length === 0) {
        showPopup("⚠️ No symptoms selected!");
        return;
    }

    const predictions = Object.entries(dataset)
        .map(([disease, symptoms]) => {
            const matchCount = symptoms.filter(symptom => selectedSymptoms.includes(symptom)).length;
            return { disease, matchCount };
        })
        .filter(({ matchCount }) => matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount);

    if (predictions.length > 0) {
        const maxMatches = predictions[0].matchCount;
        const topDiseases = predictions.filter(p => p.matchCount === maxMatches);

        resultsDiv.innerHTML = `Possible Diseases with Most Matches:
          <ul>
            ${topDiseases.map(p => `
              <li>
                ${p.disease} (Matches: ${p.matchCount}) 
                <button class="prescriptionButton" data-disease="${p.disease}">Get Prescription</button>
              </li>`).join("")}
          </ul>
        `;

        showPopup("✅ Prediction Complete!");
    } else {
        resultsDiv.innerHTML = "No matching diseases found.";
        showPopup("⚠️ No matching diseases found!");
    }

    document.querySelectorAll(".prescriptionButton").forEach(button => {
        button.addEventListener("click", (e) => {
            const disease = e.target.dataset.disease;
            showPrescription(disease);
        });
    });
});

// Function to display medications in a modal pop-up
function showPrescription(disease) {
    if (diseaseMedicines[disease]) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Medications for ${disease}</h2>
                <ul>
                    ${diseaseMedicines[disease].map(med => `<li>${med}</li>`).join("")}
                </ul>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal when clicking the close button
        modal.querySelector(".close").addEventListener("click", () => {
            modal.remove();
        });
    } else {
        showPopup("⚠️ No prescription data available for this disease.");
    }
}

// Reset button with pop-up animation
resetButton.addEventListener("click", () => {
    symptomInput.value = "";
    suggestionsList.innerHTML = "";
    resultsDiv.innerHTML = "Selected Symptoms: None";
    selectedSymptoms = [];
    prescriptionsDiv.innerHTML = "";

    showPopup("✅ Form Reset!");
});
