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

const DispatchDataSchema = z.object({
  requestId: z.string().describe("The ID of the transport request."),
  vehicleId: z.string().describe("The ID of the allocated vehicle."),
  driverName: z.string().describe("The name of the driver."),
  driverLicense: z.string().describe("The driver's license number."),
  dispatchedAt: z.string().describe("The date and time the vehicle was dispatched (ISO 8601 format)."),
});

const ImportDispatchDataFromCsvOutputSchema = z.object({
  mappedData: z
    .array(DispatchDataSchema)
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
  The user will provide CSV data, and your task is to intelligently map the columns in the CSV to the following required dispatch fields:

  - requestId: The unique identifier for the transport request.
  - vehicleId: The unique identifier for the allocated vehicle.
  - driverName: The full name of the assigned driver.
  - driverLicense: The driver's official license number.
  - dispatchedAt: The timestamp when the vehicle was dispatched. It should be a valid date format.

  The CSV column names may not exactly match these field names. Use your intelligence to find the best match. For example, 'Request ID' or 'req_id' should map to 'requestId'. 'Vehicle Plate' or 'Car No.' should map to 'vehicleId'.

  Return a JSON array where each object represents a row in the CSV, with the keys being the standardized dispatch fields listed above.
  If a column from the CSV cannot be reasonably mapped to any of the required fields, you can ignore it.
  Also, include a "mappingConfidence" score (0-100) representing how sure you are about the overall column mapping.
  \nCSV Data: {{{csvData}}}
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
