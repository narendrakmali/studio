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
  capacity: z.coerce.number().describe("The passenger capacity of the vehicle (number)."),
  make: z.string().describe("The make of the vehicle (e.g., Toyota)."),
  model: z.string().describe("The model of the vehicle (e.g. Camry)."),
  ownerName: z.string().describe("The name of the vehicle's owner."),
  ownerContact: z.string().describe("The contact number of the owner."),
  ownerAddress: z.string().describe("The address of the owner."),
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
  The user will provide CSV data, and your task is to map the columns in the CSV to the following vehicle fields:

  - licensePlate: The license plate number of the vehicle.
  - capacity: The passenger capacity of the vehicle (number).
  - make: The make of the vehicle (e.g., Toyota).
  - model: The model of the vehicle (e.g. Camry).
  - ownerName: The name of the vehicle's owner.
  - ownerContact: The contact number of the owner.
  - ownerAddress: The address of the owner.


  Return a JSON array where each object represents a row in the CSV, and the keys are the vehicle fields listed above.
  Include a "mappingConfidence" score between 0 and 100 indicating the accuracy of the mapping.
  \n  CSV Data: {{{csvData}}}
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
