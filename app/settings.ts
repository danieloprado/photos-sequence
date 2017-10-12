export enum AppEnv {
  development = 0,
  production = 1
}

export const ROOT_PATH = __dirname;
export const ENV = (process.env.NODE_ENV || '').trim() === 'development' ? AppEnv.development : AppEnv.production;
export const IS_DEV = ENV === AppEnv.development;
export const SENTRY_KEY = 'https://be1f2fe19bcf4b0b8096c2e5285510dc@sentry.io/229237';
