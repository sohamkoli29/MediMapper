const dataset = {
  "Cold": ["runny nose", "sneezing", "cough", "sore throat", "headache"],
  "Fever": ["high temperature", "chills", "sweating", "body aches", "fatigue"],
  "Malaria": ["high fever", "chills", "sweating", "headache", "nausea", "vomiting"],
  "Dengue": ["high fever", "rash", "joint pain", "headache", "muscle pain"],
  "Typhoid": ["high fever", "stomach pain", "diarrhea", "weakness", "headache"],
  "Cholera": ["watery diarrhea", "vomiting", "severe dehydration", "muscle cramps"],
  "Tuberculosis": ["persistent cough", "weight loss", "night sweats", "fever", "bloody sputum"],
  "Leprosy": ["skin lesions", "numbness", "muscle weakness", "eye problems", "deformities"],
  "Malnutrition": ["severe weight loss", "dry skin", "fatigue", "anemia", "slow growth in children"],
  "Hepatitis A": ["fever", "fatigue", "nausea", "yellowing of the skin and eyes", "abdominal pain"],
  "Hepatitis B": ["dark urine", "yellowing of skin and eyes", "fatigue", "abdominal pain", "loss of appetite"],
  "Hepatitis C": ["fatigue", "joint pain", "muscle pain", "nausea", "yellowing of skin and eyes"],
  "Zika Virus": ["fever", "rash", "joint pain", "conjunctivitis", "headache"],
  "Filariasis": ["swelling of limbs", "fever", "skin thickening", "painful lymph nodes"],
  "Leptospirosis": ["fever", "headache", "muscle aches", "jaundice", "kidney damage"],
  "Ringworm": ["red, itchy, circular rash", "scaly skin", "bald patches in hair"],
  "Scabies": ["intense itching", "red rash", "sores from scratching", "burrow tracks in skin"],
  "Tetanus": ["muscle stiffness", "jaw clenching", "difficulty swallowing", "severe muscle spasms"],
  "Mumps": ["swelling of the salivary glands", "fever", "headache", "painful swallowing"],
  "Measles": ["high fever", "cough", "runny nose", "sore throat", "rash (starting from face and spreading)"],
  "Yellow Fever": ["fever", "yellowing of the skin and eyes", "nausea", "vomiting", "muscle pain"],
  "Polio": ["muscle weakness", "paralysis", "fever", "headache", "vomiting"],
  "Pneumonia": ["chest pain", "difficulty breathing", "cough with phlegm", "fever", "fatigue"],
  "Rabies": ["fever", "headache", "muscle weakness", "paralysis", "fear of water (hydrophobia)"],
  "Anthrax": ["fever", "swelling at infection site", "coughing", "difficulty breathing", "nausea"],
  "Cysticercosis": ["seizures", "headache", "muscle pain", "cystic lesions in the brain", "vision problems"],
  "Typhus": ["high fever", "rash", "headache", "muscle pain", "chills"],
  "Kala-azar (Visceral Leishmaniasis)": ["fever", "weight loss", "splenomegaly (swollen spleen)", "anemia", "fatigue"],
  "Black Fungus (Mucormycosis)": ["facial swelling", "blackened tissue", "fever", "headache", "nosebleeds"],
  "Candidiasis (Oral Thrush)": ["white patches in mouth", "sore throat", "difficulty swallowing", "painful sores"],
  "Chikungunya": ["fever", "joint pain", "swelling", "rash", "headache"],
  "Piles": ["pain during bowel movement", "itching", "swelling around anus"],
  "Back Pain": ["stiffness", "difficulty moving", "sharp pain", "radiating pain down legs"],
  "Asthma": ["shortness of breath", "wheezing", "tight chest", "coughing"],
  "Skin Infection": ["redness", "swelling", "pain", "pus-filled abscess"],
  "Rash": ["redness", "itching", "blisters", "swelling"],
  "Insect Bite": ["redness", "swelling", "pain", "itching"],
  "Sore Throat": ["painful swallowing", "fever", "swollen lymph nodes", "white patches on tonsils"],
  "Hypertension (High Blood Pressure)": ["headache", "dizziness", "shortness of breath", "nausea", "blurred vision"],
  "Diabetes": ["frequent urination", "excessive thirst", "fatigue", "blurred vision", "slow healing of wounds"],
  "Chronic Kidney Disease": ["fatigue", "swelling in legs", "shortness of breath", "frequent urination", "nausea"],
  "Osteoarthritis": ["joint pain", "stiffness", "swelling", "limited range of motion", "creaking sounds in joints"],
  "Gastroenteritis": ["stomach cramps", "diarrhea", "vomiting", "fever", "headache"],
  "Urinary Tract Infection (UTI)": ["painful urination", "frequent urge to urinate", "cloudy urine", "pelvic pain"],
  "Gastritis": ["stomach pain", "nausea", "vomiting", "bloating", "loss of appetite"],
  "Epilepsy": ["seizures", "loss of consciousness", "muscle spasms", "uncontrollable shaking", "confusion after seizure"],
  "Gallstones": ["severe abdominal pain", "nausea", "vomiting", "fever", "jaundice"],
  "Adenovirus Infection": ["sore throat", "fever", "conjunctivitis", "headache", "cough"],
  "Legionnaire's Disease": ["high fever", "chills", "cough", "shortness of breath", "muscle aches"],
  "Croup": ["barking cough", "difficulty breathing", "fever", "stridor (high-pitched breathing sound)"],
  "Bronchitis": ["persistent cough", "shortness of breath", "chest discomfort", "fatigue", "wheezing"],
  "Sinusitis": ["nasal congestion", "headache", "facial pain", "fever", "post-nasal drip"],
  "Toxoplasmosis": ["fever", "headache", "muscle aches", "swollen lymph nodes", "blurred vision"],
  "Meningitis": ["stiff neck", "fever", "headache", "vomiting", "sensitivity to light"],
  "Whipple's Disease": ["weight loss", "diarrhea", "fatigue", "joint pain", "abdominal pain"],
  "Chronic Fatigue Syndrome": ["severe fatigue", "muscle pain", "sleep disturbances", "headache", "memory problems"],
  "Sickle Cell Anemia": ["pain episodes", "fatigue", "shortness of breath", "swelling in hands and feet", "frequent infections"],
  "Diphtheria": ["sore throat", "fever", "difficulty swallowing", "neck swelling", "grayish membrane in throat"]
}




const diseaseMedicines = {
  "Cold": ["Crocin Cold & Flu", "D-Cold", "Sinarest", "Chavanprash", "Tulsi Churna"],
  "Fever": ["Paracetamol", "Crocin", "Dolo 650", "Brufen", "Tata Tea Ginger & Honey"],
  "Malaria": ["Coartem", "Quinine", "Doxycycline", "Sulfadoxine-Pyrimethamine", "Malaria Kit"],
  "Dengue": ["Paracetamol", "Oral Rehydration Salts (ORS)", "Dengue NS1 Kit", "Dolo 650", "Tata Ginger Tea"],
  "Typhoid": ["Typhoid Vaccine", "Azithromycin", "Ceftriaxone", "Paracetamol", "Norflax"],
  "Cholera": ["ORS", "Tetracycline", "Zinc Tablets", "Cholera Vaccine", "Syrup Bismuth Subsalicylate"],
  "Tuberculosis": ["Rifampicin", "Isoniazid", "Pyrazinamide", "Ethambutol", "Vitamin B6 (Pyridoxine)"],
  "Leprosy": ["Dapsone", "Rifampicin", "Clofazimine", "Prednisolone", "Amikacin"],
  "Malnutrition": ["Protein Powder", "Multivitamins", "Iron Supplements", "Calcium Tablets", "Pediatric Nutrition Powder"],
  "Hepatitis A": ["Hepatitis A Vaccine", "Paracetamol", "Vitamin K", "Acyclovir", "Liver Detox Supplements"],
  "Hepatitis B": ["Hepatitis B Vaccine", "Entecavir", "Lamivudine", "Tenofovir", "Liver Detox Supplements"],
  "Hepatitis C": ["Sofosbuvir", "Ledipasvir", "Ribavirin", "Peginterferon", "HCV Genotype Test"],
  "Zika Virus": ["Paracetamol", "Oral Rehydration Solution (ORS)", "Vitamin C", "Acetaminophen", "Hydration Supplements"],
  "Filariasis": ["Diethylcarbamazine", "Albendazole", "Ivermectin", "Benzyl Benzoate", "Hydrocortisone Cream"],
  "Leptospirosis": ["Doxycycline", "Penicillin", "Amoxicillin", "Ceftriaxone", "Chloroquine"],
  "Ringworm": ["Clotrimazole Cream", "Terbinafine", "Ketoconazole Shampoo", "Itraconazole", "Griseofulvin"],
  "Scabies": ["Permethrin Cream", "Lindane Lotion", "Crotamiton", "Ivermectin", "Hydrocortisone Cream"],
  "Tetanus": ["Tetanus Vaccine", "Tetanus Immune Globulin (TIG)", "Metronidazole", "Diazepam", "Benzodiazepines"],
  "Mumps": ["Paracetamol", "Ibuprofen", "Vitamin C", "Fluids", "Pain relievers"],
  "Measles": ["Vitamin A", "Paracetamol", "Hydration", "Diphenhydramine (for itching)", "Antibiotics for secondary infections"],
  "Yellow Fever": ["Yellow Fever Vaccine", "Paracetamol", "Hydration", "Ibuprofen", "Corticosteroids"],
  "Polio": ["Polio Vaccine", "Analgesics", "Muscle Relaxants", "Corticosteroids", "Antibiotics for secondary infections"],
  "Pneumonia": ["Amoxicillin", "Azithromycin", "Ceftriaxone", "Levofloxacin", "Salbutamol"],
  "Rabies": ["Rabies Vaccine", "Rabies Immune Globulin (RIG)", "Tetanus Vaccine", "Antibiotics for secondary infections", "Pain relievers"],
  "Anthrax": ["Ciprofloxacin", "Doxycycline", "Penicillin", "Raxibacumab (for inhalation anthrax)", "Clindamycin"],
  "Cysticercosis": ["Albendazole", "Praziquantel", "Corticosteroids", "Dexamethasone", "Anti-seizure medication"],
  "Typhus": ["Doxycycline", "Chloramphenicol", "Tetracycline", "Ciprofloxacin", "Paracetamol"],
  "Kala-azar (Visceral Leishmaniasis)": ["Amphotericin B", "Miltefosine", "Paromomycin", "Liposomal Amphotericin B", "N-methylglucamine"],
  "Black Fungus (Mucormycosis)": ["Amphotericin B", "Posaconazole", "Isavuconazole", "Surgical Debridement", "Fluconazole"],
  "Candidiasis (Oral Thrush)": ["Clotrimazole", "Fluconazole", "Itraconazole", "Nystatin", "Ketoconazole"],
  "Chikungunya": ["Paracetamol", "Ibuprofen", "Hydration", "Rest", "Corticosteroids (for severe cases)"],
  "Piles": ["Piles Ointment", "Laxatives", "Sitz Bath", "Anusol", "Glycerin Suppositories"],
  "Back Pain": ["Ibuprofen", "Dolo 650", "Hot Packs", "Zandu Balm", "Flexon", "Rheumatol"],
  "Asthma": ["Ventolin Inhaler", "Seroflo Inhaler", "Salbutamol", "Breo Ellipta", "Methylprednisolone"],
  "Skin Infection": ["Betadine Ointment", "Neosporin", "Bacitracin", "Nystatin", "Aloe Vera Gel"],
  "Rash": ["Calamine Lotion", "Hydrocortisone Cream", "Antihistamine Tablets", "Betadine Cream", "Aloe Vera Gel"],
  "Insect Bite": ["Calamine Lotion", "Hydrocortisone Cream", "Aloe Vera Gel", "Antihistamine Tablets", "Ice Pack"],
  "Sore Throat": ["Gargle with Salt Water", "Vicks Lozenges", "Paracetamol", "Honey & Ginger", "Lemon Tea"],
  "Hypertension (High Blood Pressure)": ["Amlodipine", "Losartan", "Hydrochlorothiazide", "Beta Blockers", "Lisinopril"],
  "Diabetes": ["Metformin", "Insulin", "Glyburide", "Glipizide", "Gliclazide"],
  "Chronic Kidney Disease": ["Angiotensin-converting enzyme (ACE) inhibitors", "Diuretics", "Erythropoiesis-stimulating agents", "Phosphate binders", "Iron supplements"],
  "Osteoarthritis": ["Acetaminophen", "Ibuprofen", "Glucosamine Sulfate", "Chondroitin", "Corticosteroid Injections"],
  "Gastroenteritis": ["Oral Rehydration Solution (ORS)", "Loperamide", "Domperidone", "Paracetamol", "Zinc Tablets"],
  "Urinary Tract Infection (UTI)": ["Nitrofurantoin", "Trimethoprim", "Ciprofloxacin", "Amoxicillin", "Hydration"],
  "Gastritis": ["Omeprazole", "Ranitidine", "Pantoprazole", "Antacids", "Probiotics"],
  "Epilepsy": ["Carbamazepine", "Phenytoin", "Valproate", "Topiramate", "Lamotrigine"],
  "Gallstones": ["Ursodiol", "Cholecystectomy (Surgical Removal of Gallbladder)", "Pain relievers", "Antibiotics for infections", "Antacids"],
  "Adenovirus Infection": ["Paracetamol", "Ibuprofen", "Hydration", "Vitamin C", "Cough Syrups"],
  "Legionnaire's Disease": ["Azithromycin", "Levofloxacin", "Doxycycline", "Rifampin", "Hydration Therapy"],
  "Croup": ["Steroids (Dexamethasone)", "Nebulized Epinephrine", "Humidified Air", "Paracetamol", "Fluids"],
  "Bronchitis": ["Amoxicillin", "Doxycycline", "Cough Suppressants", "Salbutamol", "Paracetamol"],
  "Sinusitis": ["Amoxicillin", "Nasal Decongestants", "Steroid Nasal Sprays", "Paracetamol", "Hydration"],
  "Toxoplasmosis": ["Pyrimethamine", "Sulfadiazine", "Leucovorin", "Folinic Acid", "Antibiotics"],
  "Meningitis": ["Ceftriaxone", "Vancomycin", "Ampicillin", "Steroids", "Pain Relievers"],
  "Whipple's Disease": ["Antibiotics (Penicillin, Tetracycline)", "Corticosteroids", "Nutritional Support", "IV Fluids", "Vitamin Supplements"],
  "Chronic Fatigue Syndrome": ["Amantadine", "Fluoxetine", "Cognitive Behavioral Therapy", "Sleep aids", "Pain relievers"],
  "Sickle Cell Anemia": ["Hydroxyurea", "Folic Acid", "Pain Relievers", "Blood Transfusions", "Antibiotics for infections"],
  "Diphtheria": ["Diphtheria Vaccine", "Erythromycin", "Penicillin", "Antitoxin", "Corticosteroids"]
}

  