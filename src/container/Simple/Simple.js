import React from 'react';
import {ToastContainer, ToastStore} from 'react-toasts';
const Simple = props => (
    <div>
      {props.children}     
      <ToastContainer store={ToastStore} position={ToastContainer.POSITION.BOTTOM_RIGHT} lightBackground />
    </div>
  );
  
export default Simple;