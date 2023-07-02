import { initScriptManager } from '../core/init.ts';

const sm = await initScriptManager();
console.log(sm.version);
