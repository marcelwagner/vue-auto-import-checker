export const userConfig: UserConfig = {
  ...({} as InternalConfig),
  set(config: InternalConfig): void {
    Object.assign(this, config);
  }
};
