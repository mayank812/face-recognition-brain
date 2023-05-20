import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

/* const app = new Clarifai.App({
apiKey: ''
}); */

const returnClarifaiRequestOptions = (imageUrl) => {
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '5378cf10d78946528b8323ee456505e1';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'ta57g66dxf5k';       
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
 
const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};

return requestOptions;
}

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

    
class App extends Component {
    constructor() {
      super();
      this.state = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'home',
        isSignedIn: true
      }
    }

    calculateFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - (clarifaiFace.right_col * width),
          bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }
    
    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      // app.models.predict('face-detection', this.state.input)
      const MODEL_ID = 'face-detection';
      fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnClarifaiRequestOptions(this.state.input))
          .then(response => response.json())
          .then(result => console.log(result))
          .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
          .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
      if (route === 'SignOut') {
        this.setState({isSignedIn: false})
      } else if (route === 'home') {
        this.setState({isSignedIn: true})
      }
      this.setState({route: route});
    }

    render() {
      const { isSignedIn, imageUrl, route, box } = this.state;
      return (
          <div className="App">
            <ParticlesBg color="#ffffff" num={100} type="cobweb" bg={true} />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
            {route === 'home'
                ? <div>
                      <Rank />
                      <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit} />
                      <FaceRecognition box= {box} imageUrl= {imageUrl}/>
                  </div>
                :(route === 'SignIn'
                  ? <SignIn onRouteChange={this.onRouteChange} />
                  : <Register onRouteChange={this.onRouteChange} />
                 )
            }
          </div>
      );
    }
}

export default App;
