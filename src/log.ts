/* eslint-disable @typescript-eslint/no-explicit-any */
import { isDev } from './config';

const log = (message?: any, ...optionalParams: any[]) => {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.log(message, ...optionalParams);
  }
};

export default log;
