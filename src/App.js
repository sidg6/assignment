import React, { Component } from 'react';

import Homepage from './components/Homepage/Homepage';
import Auxiliary from './components/Auxiliary/Auxiliary';

import './App.css';

class App extends Component {

 render() {
  return (
   <Auxiliary>
    <main>
     <Homepage/>
    </main>
   </Auxiliary>
  );
 }
}

export default App;
