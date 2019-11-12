import Dependency = require('./dependency/Dependency');
import HttpClient = require('./utils/http/HttpClient');
import { TarballStat } from './utils/tarball';

export type DependencyType = 'dev' | 'normal' | 'optional' | 'peer';

export type DependencyTypeFilter = {
  [P in DependencyType]?: boolean;
}

export type DependencySpec = {
  name: string;
  versionSpec: string;
  escapedName: string;
  source: 'npm' | 'directory' | 'github' | 'http';
}

export type GetTarballStats = (
  url: string,
  httpClient: HttpClient,
) => Promise<TarballStat>;

export type HttpProgressEvent = {
  finishedCount: number;
  queuedCount: number;
}

export type MapDependencyCallback = (
  dependency: Dependency,
  index?: number,
  parent?: Dependency,
) => Promise<Dependency>;

export type ProgressIndicatorType = 'url' | 'stat'

export interface ReporterOptions {
  name?: string;
  shortSize?: boolean;
  useColors?: boolean;
  printer?(...args: string[]);
}

export interface Stats {
  dependencyCount?: number;
  fileCount: number;
  unpackedSize: number;
}

