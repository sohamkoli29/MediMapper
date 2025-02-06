const remedies = { 
    "Cold": ["Ginger Tea", "Tulsi Leaves", "Honey & Lemon", "Steam Inhalation", "Turmeric Milk"],
    "Fever": ["Coriander Tea", "Hydration", "Ginger Tea", "Tulsi Leaves"],
    "Headache": ["Peppermint Oil", "Ginger Tea", "Cold Compress", "Hydration"],
    "Migraine": ["Lavender Oil", "Ginger Tea", "Dark Room Rest", "Magnesium-Rich Diet"],
    "Sore Throat": ["Honey & Lemon", "Salt Water Gargle", "Lemon Tea"],
    "Cough": ["Ginger Tea", "Honey", "Tulsi Leaves", "Turmeric Milk"],
    "Runny Nose": ["Steam Inhalation", "Tulsi Leaves", "Honey & Lemon"],
    "Indigestion": ["Ginger Tea", "Fennel Seeds", "Apple Cider Vinegar"],
    "Bloating": ["Carom Seeds (Ajwain)", "Peppermint Tea", "Ginger Tea"],
    "Constipation": ["Flax Seeds", "Isabgol (Psyllium Husk)", "Warm Lemon Water"],
    "Diarrhea": ["Homemade ORS", "Banana & Yogurt", "Ginger Tea"],
    "Acidity/Heartburn": ["Cold Milk", "Apple Cider Vinegar", "Fennel Seeds"],
    "Nausea": ["Ginger Tea", "Lemon Juice", "Peppermint Tea"],
    "Motion Sickness": ["Ginger Tea", "Peppermint Oil", "Lemon Juice"],
    "Gas Trouble": ["Ajwain", "Ginger Tea", "Fennel Seeds"],
    "Muscle Cramps": ["Magnesium-Rich Foods", "Hot Compress", "Coconut Water"],
    "Fatigue": ["Ashwagandha", "Turmeric Milk", "Hydration"],
    "Back Pain": ["Hot Compress", "Stretching Exercises", "Turmeric Milk"],
    "Joint Pain": ["Turmeric Paste", "Eucalyptus Oil Massage", "Hot Compress"],
    "Toothache": ["Clove Oil", "Salt Water Gargle", "Garlic"],
    "Gum Bleeding": ["Guava Leaves", "Clove Oil", "Salt Water Rinse"],
    "Bad Breath": ["Fennel Seeds", "Clove", "Lemon Water"],
    "Insomnia": ["Chamomile Tea", "Lavender Oil", "Warm Milk"],
    "Stress/Anxiety": ["Ashwagandha", "Lavender Oil", "Meditation"],
    "Dizziness": ["Ginger Tea", "Hydration", "Lemon Juice"],
    "Eye Strain": ["Cold Compress", "Rose Water", "Cucumber Slices"],
    "Dark Circles": ["Cucumber Slices", "Almond Oil", "Cold Tea Bags"],
    
    // **COMMON INFECTIOUS DISEASES**
    "Malaria": ["Cinnamon Water", "Fenugreek Seeds", "Papaya Leaf Juice", "Neem Leaves"],
    "Dengue": ["Papaya Leaf Juice", "Coconut Water", "Pomegranate Juice", "Giloy Juice", "Hydration"],
    "Typhoid": ["Banana & Yogurt", "Homemade ORS", "Garlic", "Pomegranate Juice"],
    "Cholera": ["Homemade ORS", "Rock Salt & Buttermilk", "Coconut Water"],
    "Tuberculosis": ["Drumstick Soup", "Amla Juice", "Garlic", "Turmeric Milk", "Tulsi Leaves"],
    "Pneumonia": ["Eucalyptus Oil", "Steam Inhalation", "Garlic"],
    "Bronchitis": ["Eucalyptus Oil", "Honey & Lemon", "Steam Inhalation"],
    "Sinusitis": ["Steam Inhalation", "Eucalyptus Oil", "Tulsi Leaves"],
    "Mumps": ["Clove Oil", "Basil Tea"],
    "Measles": ["Turmeric Milk", "Lemon Juice"],
    "Polio": ["Healthy Diet & Physical Therapy"],
    "Rabies": ["Garlic", "Coconut Oil"],
    
    // **DEADLY & SERIOUS DISEASES**
    "Hepatitis A": ["Sugarcane Juice", "Amla Juice", "Lemon Water"],
    "Hepatitis B": ["Beetroot Juice", "Neem Water", "Lemon Water"],
    "Hepatitis C": ["Lemon Water"],
    "Zika Virus": ["Guava Juice", "Coconut Water", "Hydration"],
    "Black Fungus (Mucormycosis)": ["Neem Water", "Turmeric Paste", "Clove Oil"],
    "Anthrax": ["Garlic", "Turmeric Milk", "Honey"],
    "Plague": ["Garlic", "Tulsi Leaves", "Clove Oil"],
    "Smallpox": ["Neem Leaves", "Turmeric Paste", "Aloe Vera", "Honey"],
    "Lassa Fever": ["Neem Water", "Coconut Water", "Giloy Juice"],
    "Ebola": ["Hydration", "Ginger Tea", "Coconut Water", "Neem Water"],
    "Marburg Virus": ["Neem Water", "Hydration", "Turmeric Milk"],
    
    // **SKIN CONDITIONS**
    "Eczema": ["Aloe Vera", "Coconut Oil", "Oatmeal Bath", "Turmeric Paste"],
    "Psoriasis": ["Aloe Vera", "Coconut Oil", "Apple Cider Vinegar"],
    "Acne": ["Tea Tree Oil", "Aloe Vera", "Turmeric Paste", "Honey & Lemon"],
    "Hyperpigmentation": ["Lemon Juice", "Aloe Vera", "Turmeric Paste"],
    "Sunburn": ["Aloe Vera", "Cold Compress", "Coconut Oil"],
    "Dandruff": ["Coconut Oil", "Apple Cider Vinegar", "Neem Water"],
    "Vitiligo": ["Turmeric & Mustard Oil", "Neem Leaves", "Coconut Oil"],
    "Hives": ["Cold Compress", "Oatmeal Bath", "Aloe Vera"],
    "Fungal Infection": ["Apple Cider Vinegar", "Garlic", "Neem Paste"],
    "Rosacea": ["Green Tea Extract", "Aloe Vera", "Oatmeal Mask"],
    
    // **CHRONIC CONDITIONS**
    "Diabetes": ["Fenugreek Seeds", "Cinnamon Water", "Bitter Gourd Juice", "Amla Juice"],
    "Hypertension (High Blood Pressure)": ["Flax Seeds"],
    "Heart Disease": ["Garlic", "Olive Oil", "Flax Seeds"],
    "Cold": ["Ginger Tea", "Tulsi Leaves", "Honey & Lemon", "Steam Inhalation", "Turmeric Milk"],
    "Fever": ["Coriander Tea", "Hydration", "Ginger Tea", "Tulsi Leaves"],
    "Headache": ["Peppermint Oil", "Ginger Tea", "Cold Compress", "Hydration"],
    "Migraine": ["Lavender Oil", "Ginger Tea", "Dark Room Rest", "Magnesium-Rich Diet"],
    "Sore Throat": ["Honey & Lemon", "Salt Water Gargle", "Lemon Tea"],
    "Cough": ["Ginger Tea", "Honey", "Tulsi Leaves", "Turmeric Milk"],
    "Runny Nose": ["Steam Inhalation", "Tulsi Leaves", "Honey & Lemon"],
    "Indigestion": ["Ginger Tea", "Fennel Seeds", "Apple Cider Vinegar"],
    "Bloating": ["Carom Seeds (Ajwain)", "Peppermint Tea", "Ginger Tea"],
    "Constipation": ["Flax Seeds", "Isabgol (Psyllium Husk)", "Warm Lemon Water"],
    "Diarrhea": ["Homemade ORS", "Banana & Yogurt", "Ginger Tea"],
    "Acidity/Heartburn": ["Cold Milk", "Apple Cider Vinegar", "Fennel Seeds"],
    "Nausea": ["Ginger Tea", "Lemon Juice", "Peppermint Tea"],
    "Motion Sickness": ["Ginger Tea", "Peppermint Oil", "Lemon Juice"],
    "Gas Trouble": ["Ajwain", "Ginger Tea", "Fennel Seeds"],
    "Muscle Cramps": ["Magnesium-Rich Foods", "Hot Compress", "Coconut Water"],
    "Fatigue": ["Ashwagandha", "Turmeric Milk", "Hydration"],
    "Back Pain": ["Hot Compress", "Stretching Exercises", "Turmeric Milk"],
    "Joint Pain": ["Turmeric Paste", "Eucalyptus Oil Massage", "Hot Compress"],
    "Toothache": ["Clove Oil", "Salt Water Gargle", "Garlic"],
    "Gum Bleeding": ["Guava Leaves", "Clove Oil", "Salt Water Rinse"],
    "Bad Breath": ["Fennel Seeds", "Clove", "Lemon Water"],
    "Insomnia": ["Chamomile Tea", "Lavender Oil", "Warm Milk"],
    "Stress/Anxiety": ["Ashwagandha", "Lavender Oil", "Meditation"],
    "Dizziness": ["Ginger Tea", "Hydration", "Lemon Juice"],
    "Eye Strain": ["Cold Compress", "Rose Water", "Cucumber Slices"],
    "Dark Circles": ["Cucumber Slices", "Almond Oil", "Cold Tea Bags"],
    
    // **COMMON INFECTIOUS DISEASES**
    "Malaria": ["Cinnamon Water", "Fenugreek Seeds", "Papaya Leaf Juice", "Neem Leaves"],
    "Dengue": ["Papaya Leaf Juice", "Coconut Water", "Pomegranate Juice", "Giloy Juice", "Hydration"],
    "Typhoid": ["Banana & Yogurt", "Homemade ORS", "Garlic", "Pomegranate Juice"],
    "Cholera": ["Homemade ORS", "Rock Salt & Buttermilk", "Coconut Water"],
    "Tuberculosis": ["Drumstick Soup", "Amla Juice", "Garlic", "Turmeric Milk", "Tulsi Leaves"],
    "Pneumonia": ["Eucalyptus Oil", "Steam Inhalation", "Garlic"],
    "Bronchitis": ["Eucalyptus Oil", "Honey & Lemon", "Steam Inhalation"],
    "Sinusitis": ["Steam Inhalation", "Eucalyptus Oil", "Tulsi Leaves"],
    "Mumps": ["Clove Oil", "Basil Tea"],
    "Measles": ["Turmeric Milk", "Lemon Juice"],
    "Polio": ["Healthy Diet & Physical Therapy"],
    "Rabies": ["Garlic", "Coconut Oil"],
    
    // **DEADLY & SERIOUS DISEASES**
    "Hepatitis A": ["Sugarcane Juice", "Amla Juice", "Lemon Water"],
    "Hepatitis B": ["Beetroot Juice", "Neem Water", "Lemon Water"],
    "Hepatitis C": ["Lemon Water"],
    "Zika Virus": ["Guava Juice", "Coconut Water", "Hydration"],
    "Black Fungus (Mucormycosis)": ["Neem Water", "Turmeric Paste", "Clove Oil"],
    "Anthrax": ["Garlic", "Turmeric Milk", "Honey"],
    "Plague": ["Garlic", "Tulsi Leaves", "Clove Oil"],
    "Smallpox": ["Neem Leaves", "Turmeric Paste", "Aloe Vera", "Honey"],
    "Lassa Fever": ["Neem Water", "Coconut Water", "Giloy Juice"],
    "Ebola": ["Hydration", "Ginger Tea", "Coconut Water", "Neem Water"],
    "Marburg Virus": ["Neem Water", "Hydration", "Turmeric Milk"],
    
    // **SKIN CONDITIONS**
    "Eczema": ["Aloe Vera", "Coconut Oil", "Oatmeal Bath", "Turmeric Paste"],
    "Psoriasis": ["Aloe Vera", "Coconut Oil", "Apple Cider Vinegar"],
    "Acne": ["Tea Tree Oil", "Aloe Vera", "Turmeric Paste", "Honey & Lemon"],
    "Hyperpigmentation": ["Lemon Juice", "Aloe Vera", "Turmeric Paste"],
    "Sunburn": ["Aloe Vera", "Cold Compress", "Coconut Oil"],
    "Dandruff": ["Coconut Oil", "Apple Cider Vinegar", "Neem Water"],
    "Vitiligo": ["Turmeric & Mustard Oil", "Neem Leaves", "Coconut Oil"],
    "Hives": ["Cold Compress", "Oatmeal Bath", "Aloe Vera"],
    "Fungal Infection": ["Apple Cider Vinegar", "Garlic", "Neem Paste"],
    "Rosacea": ["Green Tea Extract", "Aloe Vera", "Oatmeal Mask"],
    
    // **CHRONIC CONDITIONS**
    "Diabetes": ["Fenugreek Seeds", "Cinnamon Water", "Bitter Gourd Juice", "Amla Juice"],
    "Hypertension (High Blood Pressure)": ["Flax Seeds"],
    "Heart Disease": ["Garlic", "Olive Oil", "Flax Seeds"],
    "Chronic Kidney Disease": ["Coconut Water"],
    "Osteoarthritis": ["Stretching Exercises", "Turmeric Milk"],
    "Gastritis": ["Apple Cider Vinegar", "Probiotics"],
    "Gallstones": ["Lemon Water", "Apple Cider Vinegar"],
    "Chronic Fatigue Syndrome": ["Turmeric Milk", "Ashwagandha"],
    "Sickle Cell Anemia": ["Flax Seeds", "Beetroot Juice", "Lemon Water"]
    };
function generateRemedies() {
    const ailmentInput = document.getElementById("ailment").value.trim();
    const ailment = ailmentInput.charAt(0).toUpperCase() + ailmentInput.slice(1).toLowerCase(); // Capitalize first letter
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = ""; // Clear previous results

    if (remedies.hasOwnProperty(ailment)) {
        const remediesList = remedies[ailment]
            .map(remedy => `<li>${remedy}</li>`)
            .join("");
        resultsDiv.innerHTML = `<h3>Home Remedies for ${ailment}:</h3><ul>${remediesList}</ul>`;
    } else {
        resultsDiv.innerHTML = "<p>No remedies found. Try another ailment.</p>";
    }
}
