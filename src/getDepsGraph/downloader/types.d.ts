import Downloader = require('./Downloader');

export interface IDownloaderOptions<T = any[]> {
  asyncLimit?: number;
  debug?: boolean;
  httpClient: IHttpClient;
  initialResults?: T;
  items: IDownloadItem[];
  stopOnError?: boolean;
  transformer?: ITransformer<T>;
}

export interface IDownloadItem extends Object {
  url: string;
}

export type IHttpClient = (url: string) => Promise<Buffer>;
export type ITransformer<T> = (
  content: Buffer,
  results: T,
  downloader: typeof Downloader,
  item: IDownloadItem,
) => Promise<T>
