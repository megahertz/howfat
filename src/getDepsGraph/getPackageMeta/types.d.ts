import { Result } from 'npm-package-arg';
import { IOptions } from '../../index';
import getPackageMeta = require('./index');
import Meta = require('./Meta');

export interface IMetaData {
  npaResult: INpaResult;
  options: IMetaOptions;
}

export interface IMetaOptions extends IOptions {
  getPackageMeta?: typeof getPackageMeta;
}

export type INpaResult = Result;

export interface IDependencies {
  [ name: string]: typeof Meta;
}

export interface IStats {
  depCount: number;
  fileCount: number;
  unpackedSize: number;
}
