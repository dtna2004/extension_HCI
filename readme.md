## Project Objectives

- Improve **reading accessibility** on the web
- Reduce **cognitive load** when reading long or complex texts
- Eliminate **visual distractions** on web pages
- Enable **personalized reading experiences**
- Apply **HCI and UX design principles** in a real-world system

---

## Target Users

- Individuals with **Dyslexia**
- Users with **ADHD or attention-related difficulties**
- Elderly users or users with visual impairments
- General users who prefer a cleaner and more readable web interface

---

## Key Features

### 1. Text Personalization (Font & Text Styling)
- Customize font type (OpenDyslexic, Verdana, Georgia, Monospace, etc.)
- Adjust:
  - Font size
  - Line height
  - Letter and word spacing
- Multiple color themes with **WCAG-compliant contrast ratios**

---

### 2. Reading Ruler
- A movable horizontal highlight that follows the current reading line
- Helps users:
  - Maintain reading focus
  - Avoid losing their position
  - Reduce eye strain

---

### 3. Distraction Remover
- Automatically hides:
  - Advertisements
  - Irrelevant images
  - Sidebars and cluttered elements
- Restructures content into a **clean and minimal layout**

---

### 4. Text-to-Speech (TTS)
- Converts text into speech using **Edge Text-to-Speech**
- Automatic language detection
- Multiple voice options
- Playback controls: play, pause, resume, replay

---

### 5. Text Summarization
- Two summarization modes:
  - **Extractive summarization** using TextRank (offline, fast)
  - **Abstractive summarization** using AI (Cohere API)
- Helps users quickly grasp the main ideas of long articles

---

## Technologies Used

### Frontend – Browser Extension
- TypeScript
- React
- Tailwind CSS
- Edge-TTS API
- Mozilla Readability

### Backend
- Python
- FastAPI
- PyTextRank
- Gemini-2.5-flash

---
---

## Installation & Deployment

### 1. Install the Browser Extension (Developer Mode)

- Clone the repository:
```git clone https://github.com/dtna2004/extension_HCI```
- Open a Chromium-based browser (Chrome, Edge, Brave)
- Navigate to: `chrome://extensions/`
- Enable Developer Mode
- Click `Load unpacked` and select the extension directory
### 2. Backend Setup
- Run
```
cd backend
python -m venv venv
source venv/bin/activate   # macOS / Linux
venv\Scripts\activate      # Windows
pip install -r requirements.txt
## Applied HCI Principles
- Effectiveness – Improves comprehension and reading efficiency
- Efficiency – Minimal steps to perform core actions
- Learnability & Memorability – Easy to learn and remember
- Feedback – Immediate visual and functional feedback
- Consistency – Unified layout and interaction patterns
- Accessibility – Designed for users with special needs

## Future Improvements
- Advanced personalization based on user behavior analysis
- Multilingual support (Vietnamese, French, etc.)
- More natural and expressive TTS voices
- Support for PDFs and learning materials
- Mobile-friendly version for students

## Contribution
- Dong Tu Nguyen A 
- Nguyen Ho Bac 
- Nguyen Quang Canh 
- Dinh Xuan Hoa 
- Nguyen Van Thuan
