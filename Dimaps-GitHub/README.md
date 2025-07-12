# DIMAPS: Accessible Navigation

A React-based accessible navigation application that helps users find accessible routes and facilities using Google Maps integration.

## Features

- **Interactive Map**: Google Maps integration for navigation
- **Accessible Locations**: Find accessible restrooms, ramps, and entrances
- **Voice Navigation**: Voice-guided turn-by-turn directions
- **Voice Input**: Voice commands for setting start and destination points
- **Responsive Design**: Works on both desktop and mobile devices

## Live Demo

🌐 **Live Website**: [https://cxquvdkt.manus.space](https://cxquvdkt.manus.space)

## Technologies Used

- React 18.3.1
- Google Maps API (@react-google-maps/api)
- Leaflet for additional mapping features
- React Speech Recognition for voice input
- Axios for API requests

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dimaps
```

2. Install dependencies:
```bash
npm install
```

3. Configure Google Maps API:
   - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Replace the API key in `src/components/map.js`:
   ```javascript
   const MAP_API_KEY = "YOUR_API_KEY_HERE";
   ```

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

```bash
npm run build
```

This builds the app for production to the `build` folder.

## Usage

1. **Setting Locations**: Click on the map to set start and end points
2. **Voice Commands**: Click "Start Voice Input" and say commands like:
   - "Start at [location]"
   - "End at [destination]" or "Destination [location]"
3. **Get Directions**: Click "Get Directions" to calculate the route
4. **Voice Navigation**: The app will provide voice-guided directions

## Accessibility Features

- Voice-guided navigation for visually impaired users
- Keyboard navigation support
- Screen reader compatible
- High contrast map markers
- Clear audio instructions

## API Configuration

The application requires a Google Maps API key with the following APIs enabled:
- Maps JavaScript API
- Places API
- Directions API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Deployment

The application is deployed using modern web hosting platforms. The build folder contains all necessary static files for deployment.

For deployment:
1. Run `npm run build`
2. Deploy the contents of the `build` folder to your hosting platform
3. Ensure your hosting platform supports single-page applications (SPA)

## Support

For support and questions, please open an issue in the GitHub repository.

