import { config } from 'dotenv';
config();

import '@/ai/flows/optimize-vehicle-allocation.ts';
import '@/ai/flows/import-vehicle-data-from-csv.ts';
import '@/ai/flows/import-dispatch-data-from-csv.ts';
