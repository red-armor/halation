import { FC } from 'react';
import Module from '../Module';

export { Module };

export interface GetComponent {
  (): FC<any>;
}

export interface ModuleProps {
  name: string;
  getModel?: Function;
  getComponent: GetComponent;
}
