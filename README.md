# MediMapper

## Overview
MediMapper is a web-based healthcare platform that enables patients to identify possible diseases based on their symptoms and access home remedies. It also offers real-time doctor-patient communication via chat and video calls, making remote healthcare more accessible and efficient.

## Tech Stack & Tools Used
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** PHP (for handling form submissions and user authentication)  
- **Database:** MySQL (for user and chat data storage)  
- **Communication:** WebRTC (for video calls)  
- **Version Control:** Git & GitHub  

## Installation & Setup Instructions

1. **Clone the repository**  
```bash
git clone https://github.com/sohamkoli29/MediMapperOg.git
cd MediMapper
```

2. **Set up the database:**  
- Import the `healthcare.sql` file into MySQL.  
- Update database credentials in the `config.php` file.

3. **Run the application:**  
- Ensure a local server (e.g., XAMPP or WampServer) is running.  
- Move the project folder to the server's `htdocs` directory.  
- Access the platform at:  
  ```
  http://localhost/MediMapperOg
  ```

## Features
- **Symptom-to-Disease Mapping:** Identify diseases based on patient symptoms.  
- **Home Remedies Suggestions:** Provide simple home remedies for minor health issues.  
- **Doctor-Patient Communication:** Secure chat and video calls using WebRTC.  
- **User Profiles:** Personalized profiles for both patients and doctors.  
- **Real-Time Messaging:** Enable instant chat with stored conversation history.  

## Technical Workflow

1. **User Authentication:** Patients and doctors log in securely.  
2. **Symptom Analysis:** Patients input symptoms; the system suggests potential diseases.  
3. **Remedies Suggestions:** Display home remedies based on the identified disease.  
4. **Doctor-Patient Interaction:** Enable real-time chat and video communication.  
5. **Database Storage:** Store user profiles, symptom logs, and chat history in MySQL.  



