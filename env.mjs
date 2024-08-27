import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

const myEnv = config({ path: '.env.local' });
expand(myEnv);

export {};