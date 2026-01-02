'use server';
/**
 * @fileOverview Implements the Genkit flow for importing dispatch data from a CSV file.
 *
 * - importDispatchDataFromCsv - A function that handles the dispatch data import process.
 * - ImportDispatchDataFromCsvInput - The input type for the importDispatchDataFromCsv function.
 * - ImportDispatchDataFromCsvOutput - The return type for the importDispatchDataFromCsv function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImportDispatchDataFromCsvInputSchema = z.object({
  csvData: z
    .string()
    .describe('The CSV data containing dispatch information.'),
});
export type ImportDispatchDataFromCsvInput = z.infer<
  typeof ImportDispatchDataFromCsvInputSchema
>;

const ImportDispatchDataFromCsvOutputSchema = z.object({
  mappedData: z
    .array(z.record(z.string()))
    .describe('The dispatch data, with columns mapped to dispatch fields.'),
  mappingConfidence: z
    .number()
    .describe(
      'A score indicating the confidence of the column mapping (0-100).'
    )
    .optional(),
});
export type ImportDispatchDataFromCsvOutput = z.infer<
  typeof ImportDispatchDataFromCsvOutputSchema
>;

export async function importDispatchDataFromCsv(
  input: ImportDispatchDataFromCsvInput
): Promise<ImportDispatchDataFromCsvOutput> {
  return importDispatchDataFromCsvFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importDispatchDataFromCsvPrompt',
  input: {schema: ImportDispatchDataFromCsvInputSchema},
  output: {schema: ImportDispatchDataFromCsvOutputSchema},
  prompt: `You are an expert data analyst specializing in extracting vehicle dispatch information from CSV data.
  The user will provide CSV data, and your task is to map the columns in the CSV to the following dispatch fields:

  - requestId: The ID of the transport request.
  - vehicleId: The ID of the allocated vehicle.
  - driverName: The name of the driver.
  - driverLicense: The driver's license number.
  - dispatchedAt: The date and time the vehicle was dispatched (ISO 8601 format).

  Return a JSON array where each object represents a row in the CSV, and the keys are the dispatch fields listed above.
  Include a "mappingConfidence" score between 0 and 100 indicating the accuracy of the mapping.
  \n  CSV Data: {{{csvData}}}
  `,
});

const importDispatchDataFromCsvFlow = ai.defineFlow(
  {
    name: 'importDispatchDataFromCsvFlow',
    inputSchema: ImportDispatchDataFromCsvInputSchema,
    outputSchema: ImportDispatchDataFromCsvOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
