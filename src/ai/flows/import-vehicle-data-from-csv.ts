'use server';
/**
 * @fileOverview Implements the Genkit flow for importing vehicle data from a CSV file, using AI to map columns.
 *
 * - importVehicleDataFromCsv - A function that handles the vehicle data import process.
 * - ImportVehicleDataFromCsvInput - The input type for the importVehicleDataFromCsv function.
 * - ImportVehicleDataFromCsvOutput - The return type for the importVehicleDataFromCsv function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImportVehicleDataFromCsvInputSchema = z.object({
  csvData: z
    .string()
    .describe('The CSV data containing vehicle information.'),
});
export type ImportVehicleDataFromCsvInput = z.infer<
  typeof ImportVehicleDataFromCsvInputSchema
>;

const VehicleDataSchema = z.object({
  licensePlate: z.string().describe("The license plate number of the vehicle."),
  capacity: z.coerce.number().optional().describe("The passenger capacity of the vehicle (number)."),
  make: z.string().describe("The make of the vehicle (e.g., Toyota)."),
  model: z.string().describe("The model of the vehicle (e.g. Camry)."),
  ownerName: z.string().describe("The name of the vehicle's owner."),
  ownerContact: z.string().describe("The contact number of the owner."),
  ownerAddress: z.string().optional().describe("The address of the owner."),
  contractStartDate: z.string().optional().describe("The start date of the vehicle's contract (ISO 8601 format)."),
  contractEndDate: z.string().optional().describe("The end date of the vehicle's contract (ISO 8601 format)."),
});

const ImportVehicleDataFromCsvOutputSchema = z.object({
  mappedData: z
    .array(VehicleDataSchema)
    .describe('The vehicle data, with columns mapped to vehicle fields.'),
  mappingConfidence: z
    .number()
    .describe(
      'A score indicating the confidence of the column mapping (0-100).'
    )
    .optional(),
});
export type ImportVehicleDataFromCsvOutput = z.infer<
  typeof ImportVehicleDataFromCsvOutputSchema
>;

export async function importVehicleDataFromCsv(
  input: ImportVehicleDataFromCsvInput
): Promise<ImportVehicleDataFromCsvOutput> {
  return importVehicleDataFromCsvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importVehicleDataFromCsvPrompt',
  input: {schema: ImportVehicleDataFromCsvInputSchema},
  output: {schema: ImportVehicleDataFromCsvOutputSchema},
  prompt: `You are an expert data analyst specializing in extracting vehicle information from CSV data.
  The user will provide CSV data, and your task is to intelligently map the columns in the CSV to the following required vehicle fields:

  - licensePlate: The vehicle's registration number.
  - capacity: The number of passengers the vehicle can carry.
  - make: The manufacturer of the vehicle (e.g., Toyota, Maruti).
  - model: The specific model of the vehicle (e.g., Innova, Ertiga).
  - ownerName: The name of the person or company that owns the vehicle.
  - ownerContact: The phone number for the vehicle owner.
  - ownerAddress: The mailing address of the vehicle owner.
  - contractStartDate: The start date of the vehicle's contract.
  - contractEndDate: The end date of the vehicle's contract.

  The CSV column names may not exactly match these field names. Use your intelligence to find the best match. 
  For example:
  - 'Vehicle No' or 'Vehicle Number' should map to 'licensePlate'.
  - 'Vehicle Compar' or 'Company' should map to 'make'.
  - 'Vehicle M' or 'Vehicle Model' should map to 'model'.
  - 'Owner Name' should map to 'ownerName'.
  - 'Owner Contact' should map to 'ownerContact'.
  - 'Seating Capacity' or 'Cap.' should map to 'capacity'.
  - 'Address' should map to 'ownerAddress'.
  - 'Submitted Dat' or 'Start Date' should map to 'contractStartDate'.
  - 'End Date' should map to 'contractEndDate'.

  Some fields like 'capacity', 'ownerAddress', 'contractStartDate' and 'contractEndDate' may not be present in the CSV. In that case, you can leave them out. Do not hallucinate data.

  Return a JSON array where each object represents a row in the CSV, with the keys being the standardized vehicle fields listed above.
  If a column from the CSV cannot be reasonably mapped to any of the required fields, you can ignore it.
  Also, include a "mappingConfidence" score (0-100) representing how sure you are about the overall column mapping.
  
  Example Input CSV:
  Sr no,Branch Name,Owner Name,Owner Contact,Vehicle No,Vehicle Compar,Vehicle M,Submitted Dat
  1,Savalaj,Sachin Jadhav,9975377604,MH10DN2027,Hero,Splendor,13-Dec
  
  Expected Output for the example row:
  {
    "licensePlate": "MH10DN2027",
    "make": "Hero",
    "model": "Splendor",
    "ownerName": "Sachin Jadhav",
    "ownerContact": "9975377604",
    "contractStartDate": "2023-12-13" 
  }

  Now, process the following CSV data:
  \nCSV Data: {{{csvData}}}
  `,
});

const importVehicleDataFromCsvFlow = ai.defineFlow(
  {
    name: 'importVehicleDataFromCsvFlow',
    inputSchema: ImportVehicleDataFromCsvInputSchema,
    outputSchema: ImportVehicleDataFromCsvOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
