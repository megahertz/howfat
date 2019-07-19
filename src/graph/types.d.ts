export type IGetPkgMeta = (packageJsonUrl: string) => Promise<object>;
export type IGetPkgStat = (tarballUrl: string) => Promise<IPackageStat>;

export interface IPackageStat {
  fileCount: number;
  unpackedSize: number;
}
