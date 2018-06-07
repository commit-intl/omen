import ControlComponent from './control.component';
import AbstractComponent from './abstract.component';
import BasicComponent from './basic.component';
import { Renderer } from './renderer';

module.exports = {
  omega: Renderer,
  _o: '_o',
  DataStore: require('./data'),
  AbstractComponent,
  BasicComponent,
  ControlComponent,
};