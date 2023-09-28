import manifest from './manifest.json';

const apiSettings = {
  credentials: 'include',
  headers: {
    'X-Key-Inflection': 'camel',

    // Pull app name directly from manifest since this config is defined
    // before startApp, and using window.appName here would result in
    // undefined for all requests that use this config.
    'Source-App-Name': manifest.entryName,
  },
};

const railsEngineApi = {
  // baseUrl: `${environment.API_URL}/facilities_api/v1`,
  // url: `${environment.API_URL}/facilities_api/v1/va`,
  // ccUrl: `${environment.API_URL}/facilities_api/v1/ccp`,
  settings: apiSettings,
};

export const getAPI = () => railsEngineApi;
