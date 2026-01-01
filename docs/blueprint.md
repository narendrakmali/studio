# **App Name**: Samagam FleetConnect

## Core Features:

- Fleet Reception: Authenticated transport team logs vehicle details, including images (front, side, odometer).
- Request Submission: Public users submit transport requests with department name, passenger count, destination and HOD approval image capture.
- Allocation and Dispatch: Authenticated transport managers match requests to available vehicles, capturing driver and license details, along with a vehicle condition photo.
- Offline Data Persistence: Utilize WatermelonDB for local data storage to ensure functionality in areas with limited or no connectivity.
- Image Handling and Sync: Manage image uploads to Firebase Storage; automatically sync local image paths with Firebase Storage URLs when internet connectivity is restored.
- Admin Data Handling: Admin panel to import pre-registered vehicle CSV and export dispatch sheets. OTP Verification tool for staff without managed emails
- AI-Powered Route Optimization: Leverage AI to suggest optimal vehicle allocation based on request details and vehicle availability tool, minimizing idle time and resource waste. Uses offline information if needed.

## Style Guidelines:

- Primary color: Deep purple (#673AB7) to reflect trust and organization, complementing the seriousness and scale of the Samagam event.
- Background color: Light gray (#F0F0F3), very low saturation, to ensure focus on the content.
- Accent color: Light indigo (#3F51B5), a darker analogous color to the primary color, to give contrast for user interaction elements.
- Font pairing: 'Space Grotesk' for headlines and 'Inter' for body text. 'Space Grotesk' is a proportional sans-serif for a computerized, techy feel, while 'Inter' is a grotesque-style sans-serif with a neutral look.
- Consistent iconography style, using filled icons for primary actions and outlined icons for secondary actions.
- Use clear and consistent layout patterns across all screens, following a grid system for alignment and spacing. Prioritize information based on user roles (public vs. transport team).
- Subtle transitions and animations to provide feedback and enhance the user experience (e.g., loading animations, form validation feedback).