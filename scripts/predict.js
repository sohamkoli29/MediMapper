// Initialize variables
const symptomInput = document.getElementById("symptomInput");
const suggestionsList = document.getElementById("suggestions");
const predictButton = document.getElementById("predictButton");
const resetButton = document.getElementById("resetButton");
const resultsDiv = document.getElementById("results");
let selectedSymptoms = [];



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
      li.addEventListener("click", () => {
        // Add symptom to selected list if not already added
        if (!selectedSymptoms.includes(match)) {
          selectedSymptoms.push(match);
          updateResults();
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

// Function to predict diseases based on selected symptoms
// Function to predict diseases based on selected symptoms
predictButton.addEventListener("click", () => {
  if (selectedSymptoms.length === 0) {
    resultsDiv.innerHTML = "No symptoms selected!";
    return;
  }

  const predictions = Object.entries(dataset)
    .map(([disease, symptoms]) => {
      const matchCount = symptoms.filter(symptom => selectedSymptoms.includes(symptom)).length;
      return { disease, matchCount };
    })
    .filter(({ matchCount }) => matchCount > 0) // Only include diseases with matches
    .sort((a, b) => b.matchCount - a.matchCount); // Sort by match count

  if (predictions.length > 0) {
    const maxMatches = predictions[0].matchCount; // Get the highest match count
    const topDiseases = predictions.filter(p => p.matchCount === maxMatches); // Filter only diseases with the highest match count

    resultsDiv.innerHTML = `Possible Diseases with Most Matches:
      <ul>
        ${topDiseases.map(p => `
          <li>
            ${p.disease} (Matches: ${p.matchCount}) 
            <button class="prescriptionButton" data-disease="${p.disease}">Get Prescription</button>
          </li>`).join("")}
      </ul>
    `;
  } else {
    resultsDiv.innerHTML = "No matching diseases found.";
  }

  // Add event listeners for Get Prescription buttons
  const prescriptionButtons = document.querySelectorAll(".prescriptionButton");
  prescriptionButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const disease = e.target.dataset.disease;
      showPrescription(disease);
    });
  });
});

// Function to display the medications for a selected disease
function showPrescription(disease) {
  const prescriptionsDiv = document.getElementById("prescriptions");
  if (diseaseMedicines[disease]) {
    prescriptionsDiv.innerHTML = `
      Medications for ${disease}:
      <ul>
        ${diseaseMedicines[disease].map(med => `<li>${med}</li>`).join("")}
      </ul>
    `;
  } else {
    prescriptionsDiv.innerHTML = "No prescription data available for this disease.";
  }
}

// Reset button functionality
resetButton.addEventListener("click", () => {
  symptomInput.value = "";
  suggestionsList.innerHTML = "";
  resultsDiv.innerHTML = "Selected Symptoms: None";
  selectedSymptoms = [];
  document.getElementById("prescriptions").innerHTML = ""; // Clear prescriptions
});
