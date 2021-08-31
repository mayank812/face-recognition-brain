import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div>
            <p className='f3'>
                {'This App will detect face in your pictures. Give it a try.'}
            </p>
            <div className= 'center'>
            <div className= 'form center pa4 br3 shadow-5'>
                <input className='pa2 f4 w-70 center' placeholder= 'Enter Image Link' type= 'text' onChange= {onInputChange} />
                <button className= 'w-30 grow f4 link ph3 pv2 dib white bg-light-purple' onClick= {onButtonSubmit}>DETECT</button>
            </div>
            </div>
        </div>
    )
}

export default ImageLinkForm;