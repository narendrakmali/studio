'use server';

/**
 * @fileOverview AI-powered vehicle allocation optimization flow.
 *
 * - optimizeVehicleAllocation - A function that suggests optimal vehicle allocations based on request details and vehicle availability.
 * - OptimizeVehicleAllocationInput - The input type for the optimizeVehicleAllocation function.
 * - OptimizeVehicleAllocationOutput - The return type for the optimizeVehicleAllocation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeVehicleAllocationInputSchema = z.object({
  requestDetails: z.object({
    destination: z.string().describe('The destination of the transport request.'),
    passengerCount: z.number().describe('The number of passengers for the request.'),
    departmentName: z.string().describe('The name of the department making the request.'),
    hodApprovalImage: z.string().optional().describe("HOD approval image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  }).describe('Details of the transport request.'),
  vehicleAvailability: z.array(z.object({
    vehicleId: z.string().describe('The ID of the vehicle.'),
    location: z.string().describe('The current location of the vehicle.'),
    capacity: z.number().describe('The passenger capacity of the vehicle.'),
    lastTripDestination: z.string().optional().describe('The last destination the vehicle went to.'),
  })).describe('A list of available vehicles with their details.'),
  tripHistory: z.array(z.object({
    vehicleId: z.string().describe('The ID of the vehicle used for the trip.'),
    destination: z.string().describe('The destination of the trip.'),
    passengerCount: z.number().describe('The number of passengers on the trip.'),
  })).optional().describe('Historical data of past trips, including vehicle ID, destination, and passenger count.'),
});
export type OptimizeVehicleAllocationInput = z.infer<typeof OptimizeVehicleAllocationInputSchema>;

const OptimizeVehicleAllocationOutputSchema = z.object({
  vehicleId: z.string().describe('The ID of the vehicle recommended for allocation.'),
  reason: z.string().describe('The reasoning behind the vehicle allocation suggestion.'),
});
export type OptimizeVehicleAllocationOutput = z.infer<typeof OptimizeVehicleAllocationOutputSchema>;

export async function optimizeVehicleAllocation(input: OptimizeVehicleAllocationInput): Promise<OptimizeVehicleAllocationOutput> {
  return optimizeVehicleAllocationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeVehicleAllocationPrompt',
  input: {schema: OptimizeVehicleAllocationInputSchema},
  output: {schema: OptimizeVehicleAllocationOutputSchema},
  prompt: `You are an AI transport manager assistant tasked with suggesting the optimal vehicle allocation for transport requests.

  Consider the following transport request details:
  Destination: {{{requestDetails.destination}}}
  Passenger Count: {{{requestDetails.passengerCount}}}
  Department Name: {{{requestDetails.departmentName}}}

  Available Vehicles:
  {{#each vehicleAvailability}}
  - Vehicle ID: {{{vehicleId}}}, Location: {{{location}}}, Capacity: {{{capacity}}}, Last Trip Destination: {{{lastTripDestination}}}
  {{/each}}

  {{#if tripHistory}}
  Trip History (Consider this to optimize vehicle use and reduce redundancy):
  {{#each tripHistory}}
  - Vehicle ID: {{{vehicleId}}}, Destination: {{{destination}}}, Passenger Count: {{{passengerCount}}}
  {{/each}}
  {{else}}
  No trip history available.
  {{/if}}

  Based on the above information, suggest the most suitable vehicle ID from the available vehicles and provide a brief reason for your suggestion.
  The selected vehicle should efficiently meet the request requirements while minimizing resource waste and idle time.
`,
});

const optimizeVehicleAllocationFlow = ai.defineFlow(
  {
    name: 'optimizeVehicleAllocationFlow',
    inputSchema: OptimizeVehicleAllocationInputSchema,
    outputSchema: OptimizeVehicleAllocationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
