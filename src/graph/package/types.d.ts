import { Result } from 'npm-package-arg';
import { IOptions } from '../../index';
import BasicPackage = require('./BasicPackage');
import packageFactory = require('./index');

export interface IPackageConstructData {
  npaResult: INpaResult;
  options: IOptions;
}

export type INpaResult = Result;

export interface IDependencies {
  [ name: string]: typeof BasicPackage;
}

export interface IStats {
  depCount: number;
  fileCount: number;
  unpackedSize: number;
}

export type IPackageFactory = typeof packageFactory;
