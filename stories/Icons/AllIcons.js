import React from 'react';
import * as Icons from '../../src/Icons';


export default () => {
  return <ul className="style-list">
    <li><Icons.ArrowLeft/> Left arrow</li>
    <li><Icons.Clone/> Clone</li>
    <li><Icons.Edit/> Edit</li>
    <li><Icons.Pause/> Pause</li>
    <li><Icons.Stop/> Stop</li>
    <li><Icons.Trash/> Trash</li>
    <li><Icons.View/> View</li>
  </ul>;
}
