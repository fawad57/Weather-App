# 🌦️ Weather Dashboard with AI Chatbot

![Weather App Screenshot](/screenshots/dashboard.png) *(Replace with actual screenshot)*

A full-featured weather application with real-time forecasts, interactive charts, and an AI-powered chatbot. Built with modern web technologies for accurate weather data visualization and natural language interactions.

## ✨ Key Features

### 🌍 Weather Dashboard
- Real-time weather data for any city
- 5-day forecast with animated charts
- Temperature unit toggle (°C/°F)
- Geolocation support
- Responsive design for all devices

### 🤖 Smart Chatbot
- Natural language weather queries
- Context-aware responses
- API integration (OpenWeather + Gemini)
- Interactive conversation UI

### 📊 Data Visualization
- Interactive temperature charts (Bar/Line)
- Weather condition distribution (Doughnut)
- Historical data comparison
- Animated transitions

## 🛠 Tech Stack

| Layer        | Technologies Used                     |
|--------------|---------------------------------------|
| **Frontend** | HTML5, CSS3, JavaScript, Chart.js     |
| **APIs**     | OpenWeatherMap, Gemini AI             |
| **Tools**    | VS Code, Git                          |

## 📂 Project Structure

```
weather-app/
├── index.html          # Main dashboard
├── Table.html          # Data table view
├── styles.css          # Shared styles
├── table.css           # Table-specific styles
├── script.js           # Dashboard functionality
├── table.js            # Table interactions
├── chatbot.js          # AI chatbot logic
└── screenshots/        # App screenshots
```

## 🚀 Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/fawad57/weather-app.git
   cd weather-app
   ```

2. **Open in browser**
   - Launch `index.html` for the weather dashboard
   - Launch `Table.html` for the data table view

3. **API Keys (Required)**
   - Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Replace in `script.js`:
     ```javascript
     const apiKey = "YOUR_OPENWEATHER_API_KEY";
     ```
   - For chatbot: Obtain Gemini API key and update `chatbot.js`

## 🌟 Live Demo

[![Demo Video](/screenshots/demo-thumbnail.png)](https://your-demo-link.com)  
*(Click to view demo video)*

## 📸 Screenshots

| Dashboard View | Table View | Mobile View |
|----------------|------------|-------------|
| ![Dashboard](/screenshots/dashboard.png) | ![Table](/screenshots/table.png) | ![Mobile](/screenshots/mobile.png) |

## 🔧 Customization

### Changing Themes
Modify `styles.css`:
```css
/* Light Theme */
:root {
  --primary-bg: linear-gradient(to bottom right, #1c92d2, #f2fcfe);
  --card-bg: rgba(255, 255, 255, 0.9);
}

/* Dark Theme */
.dark-mode {
  --primary-bg: linear-gradient(to bottom right, #0f2027, #203a43);
  --card-bg: rgba(30, 30, 30, 0.9);
}
```

### Adding New Charts
1. Add new canvas element in HTML:
   ```html
   <div class="chart-box">
     <canvas id="newChart"></canvas>
   </div>
   ```
2. Initialize in `script.js`:
   ```javascript
   const newChart = new Chart(ctx, {
     type: 'radar',
     data: {...}
   });
   ```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Your Name - your.email@example.com  
Project Link: [https://github.com/your-username/weather-app](https://github.com/your-username/weather-app)
```

---

### Key Features:
1. **Visual Hierarchy**: Emoji categorization for easy scanning
2. **Tech Stack Clarity**: Clean table format for technologies
3. **Setup Ready**: Includes API key instructions
4. **Visual Assets**: Placeholders for screenshots/demo
5. **Customization Guide**: Helps others modify the project
6. **Mobile Responsive**: Highlighted in features

**To Add**:
1. Replace placeholder image paths with actual screenshots
2. Add your real contact info and repo link
3. Include any additional dependencies in the Tech Stack table

Would you like me to:
- Add specific deployment instructions (e.g., Netlify/Vercel)?
- Include a troubleshooting section for common issues?
- Add API rate limit handling tips?
