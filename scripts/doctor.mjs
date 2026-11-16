import os from 'node:os';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
console.log(JSON.stringify({platform:os.platform(),node:process.version,windows:os.platform()==='win32',playwright:(()=>{try{return require('playwright/package.json').version}catch{return 'missing'}})()},null,2));
