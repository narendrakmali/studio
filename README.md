User: give me technical document for each page

GitHub Copilot: Enable Claude Haiku 4.5 for all clients
[object Object]

User: @GitHubCopilot Enable: "Enable Claude Haiku 4.5 for all clients"

GitHub Copilot: I'll analyze the pages in your Next.js application and create technical documentation for each one. Let me start by exploring the page structure and their implementations. 

Read [](file:///workspaces/studio/src/app/page.tsx)

Read [](file:///workspaces/studio/src/app/admin/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/dashboard/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/dispatch/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/fleet/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/fleet/register/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/login/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/handover/page.tsx#1-1), lines 1 to 100

Now let me read the remaining pages: 

Read [](file:///workspaces/studio/src/app/indoor-request/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/outdoor-request/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/reception/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/requests/page.tsx#1-1), lines 1 to 100

Read [](file:///workspaces/studio/src/app/requests/new/page.tsx#1-1), lines 1 to 100

Now let me get more information about the types and structure to complete the documentation: 

Read [](file:///workspaces/studio/src/lib/types.ts)

Read [](file:///workspaces/studio/package.json#1-1), lines 1 to 50

Now I have all the information I need. Let me create comprehensive technical documentation for each page. I'll present this information in a clear, organized format.

## Technical Documentation - Page-by-Page Overview

### 1. **Home Page** (`/`)
**File:** page.tsx

**Purpose:** Landing page for the Transport Coordination Portal - entry point for the application.

**Key Features:**
- **Client-side rendered** with no authentication required
- Logo and branding header with "Transport Coordination Portal" title
- Team Login button in header navigation
- Two main call-to-action cards:
  - **Indoor Vehicle Request:** For internal department use
  - **Outdoor Vehicle Request:** For Branch/Zone vehicles

**Technologies:** Next.js, React, Lucide Icons, Tailwind CSS

**Dependencies:** Logo component, Card UI components, Link navigation

**User Flow:** Unauthenticated users → Select request type → Navigate to respective form

---

### 2. **Login Page** (`/login`)
**File:** page.tsx

**Purpose:** Team authentication and access control.

**Key Features:**
- Form validation using `react-hook-form` with Zod schema
- Email and password/OTP validation
- Hardcoded allowed users list (6 authorized emails)
- Default credentials: password = "password"
- Loading state with spinner during authentication
- Toast notifications for success/failure

**Validation Rules:**
- Email: Valid email format required
- Password: Minimum 1 character required
- Allowed emails: admin@samagam.com, narendrakmali@gmail.com, samagamtransport@gmail.com, prasadshivajimore@gmail.com, akashmore1848@gmail.com, rajendranandikurle32@gmail.com

**Post-Login Navigation:** Redirects to `/dashboard`

**Technologies:** Next.js, react-hook-form, Zod, React Router, Toast notifications

---

### 3. **Dashboard Page** (`/dashboard`)
**File:** page.tsx

**Purpose:** Main administrative overview and monitoring hub for authorized users.

**Key Metrics Displayed (Real-time):**
- **Available Vehicles:** Count of vehicles with 'available' status
- **Pending Requests:** Count of unprocessed transport requests
- **Dispatches Today:** Dispatches created on the current date
- **Total Passengers:** Sum of passenger counts for all pending requests

**Layout:**
- 4-column responsive stats grid (4 cols on lg, 2 cols on md, 1 col on sm)
- Two tables showing recent requests:
  - Indoor Requests (latest 5)
  - Outdoor Requests (latest 5)

**Real-time Updates:**
- Polls request data every 500ms to detect new additions
- Auto-updates tables without page refresh

**Table Columns:**
- Department/Branch name
- Requested by (hidden on sm)
- Vehicle/Mode type (hidden on md)
- Request status badge

**Technologies:** React hooks (useState, useEffect), date-fns, UI components

---

### 4. **Indoor Request Form** (`/indoor-request`)
**File:** page.tsx

**Purpose:** Form for internal department transport requests within Samagam site.

**Form Fields (with Zod validation):**
| Field | Type | Validation |
|-------|------|-----------|
| User Name | Text | Min 2 chars |
| Contact Number | Phone | Min 10 digits |
| Department Name | Text | Min 2 chars |
| Vehicle Type | Enum | two-wheeler, four-wheeler, tempo, eicher, bus |
| Passenger Count | Number | Min 1 |
| Destination | Text | Required |
| Duration From | Date | Required |
| Duration To | Date | Must be ≥ Duration From |

**Features:**
- Date picker with calendar UI
- Real-time validation feedback
- Success modal on submission
- Auto-adds to requests list via `addRequest()` function
- Sets `source: 'indoor'` and `requestType: 'private'`

**Technologies:** react-hook-form, Zod, date-fns, UI components

---

### 5. **Outdoor Request Form** (`/outdoor-request`)
**File:** page.tsx

**Purpose:** Complex multi-tab form for external branch/zone vehicle registrations (private, bus, or train).

**Discriminated Union Schema:** Uses Zod discriminated union with three request types:

**Tab 1: Private Vehicle**
| Field | Type | Validation |
|-------|------|-----------|
| Sanyojak/In-charge Name | Text | Min 2 chars |
| Contact Number | Phone | Min 10 digits |
| Branch/Zone Name | Text | Min 2 chars |
| Vehicle Type | Enum | two-wheeler, car, suv, winger, innova |
| Registration Number | Text | Required |
| Occupancy | Number | Min 1 |
| Driver Name | Text | Required |
| Driver Contact | Text | Required |
| Arrival Date | Date | Required |
| Departure Date | Date | Must be ≥ Arrival Date |

**Tab 2: Bus**
| Field | Type | Validation |
|-------|------|-----------|
| Bus Type | Enum | private, msrtc |
| Bus Quantity | Number | Min 1 |
| Route | Text | Required |
| Coordinator Name | Text | Required |
| Coordinator Contact | Text | Required |
| Booking Receipt | File | Required if MSRTC |
| Arrival/Departure Dates | Dates | Departure ≥ Arrival |

**Tab 3: Train**
| Field | Type | Validation |
|-------|------|-----------|
| Team Leader Name | Text | Required |
| Team Leader Contact | Text | Required |
| Train Number | Text | Required |
| Arrival Date | Date | Required |
| Devotee Count | Number | Min 1 |
| Pickup Required | Checkbox | Optional |
| Return Train Number | Text | Optional |
| Return Departure Date | Date | Optional |

**Features:**
- Tabs for selecting request type
- Conditional field visibility based on selected type
- MSRTC-specific booking receipt validation
- Date range validation
- Toast notifications

**Technologies:** react-hook-form, Zod, Tabs UI, Select components, date-fns

---

### 6. **Fleet Management** (`/fleet`)
**File:** page.tsx

**Purpose:** View and manage all registered vehicles in the fleet.

**Table Display:**
| Column | Mobile Hidden | Details |
|--------|---------------|---------| 
| Image | Hidden on sm | Vehicle front photo |
| License Plate | Visible | Registration number |
| Make & Model | Visible | Vehicle details |
| Capacity | Visible | Passenger capacity |
| Status | Visible | available/in-use/maintenance |
| Actions | Visible | Dropdown menu |

**Status Variants:**
- `available` → secondary badge
- `in-use` → default badge
- `maintenance` → destructive badge

**Action Menu:**
- Edit
- Mark for Maintenance
- Delete

**Header Features:**
- "Register Vehicle" button linking to `/fleet/register`

**Technologies:** Next.js, Table UI components, Dropdown menu, Image component

---

### 7. **Vehicle Registration** (`/fleet/register`)
**File:** page.tsx

**Purpose:** Register new vehicles into the fleet system.

**Form Fields (with Zod validation):**
| Field | Type | Validation |
|-------|------|-----------|
| License Plate | Text | Required |
| Make & Model | Text | Required |
| Capacity | Number | Min 1 |
| Owner Name | Text | Required |
| Owner Contact | Text | Required |
| Owner Address | Text | Required |
| Contract Start Date | Date | Optional |
| Contract End Date | Date | Must be ≥ Start Date |

**Features:**
- 2-column grid layout on md+ screens
- Form validation with error messages
- Date picker for contract dates
- Back to Fleet button
- Card-based layout

**Technologies:** react-hook-form, Zod, date-fns, Calendar UI

---

### 8. **Dispatch Management** (`/dispatch`)
**File:** page.tsx

**Purpose:** Allocate vehicles to pending indoor requests with AI-assisted recommendations.

**Key Features:**
- **Request List:** Sidebar showing all pending indoor requests
- **Request Details:** Displays selected request information
- **Vehicle Selection:** Dropdown to manually select from available vehicles
- **AI Suggestion Button:** Uses Genkit AI flow to recommend optimal vehicle

**AI Optimization Input:**
```typescript
{
  requestDetails: {
    destination,
    passengerCount,
    departmentName
  },
  vehicleAvailability: [
    { vehicleId, location, capacity, lastTripDestination }
  ],
  tripHistory: []
}
```

**Editable Dispatch Fields:**
- Department
- Vehicle Model
- Vehicle Type
- Allocation Date
- Return Date

**Response Handling:**
- Displays suggested vehicle ID
- Shows reason for recommendation
- Toast notifications for success/failure

**Technologies:** React hooks, Genkit AI, date-fns, Select/Popover UI

---

### 9. **Reception/Vehicle Check-in** (`/reception`)
**File:** page.tsx

**Purpose:** Record vehicle arrival with photographic evidence and odometer readings.

**Form Fields (with Zod validation):**
| Field | Type | Validation |
|-------|------|-----------|
| Registration Number | Text | Required |
| Vehicle Type | Text | Required |
| Odometer Reading | Number | Min 1 |
| Front Image | File | Exactly 1 file required |
| Side Image | File | Exactly 1 file required |
| Odometer Image | File | Exactly 1 file required |

**Features:**
- **Camera Integration:**
  - Real-time video stream via `getUserMedia()`
  - Capture images directly to canvas
  - Fallback for unsupported devices
  - Camera permission checks and error handling
  
- **Image Capture Flow:**
  1. Request camera access
  2. Display video feed
  3. Capture three vehicle images (front, side, odometer)
  4. Preview captured images
  5. Form submission with images

- **Backend Integration:**
  - Firebase Storage for image uploads
  - Firestore for metadata storage
  - Automatic image URL resolution

**Technologies:** React hooks, useRef for camera access, Canvas API, Firebase Storage, Firestore, Zod

---

### 10. **Requests Overview** (`/requests`)
**File:** page.tsx

**Purpose:** View all submitted transport requests (indoor and outdoor) with approval documents.

**Layout:**
- Two sections: Indoor Requests & Outdoor Requests
- Responsive card grid (1 col sm, 2 cols md, 3-4 cols lg-xl)

**Card Details (Per Request):**
- Request ID
- Status badge (pending/allocated/dispatched/completed)
- Requested by (user name)
- Contact number
- Mode/Vehicle type
- Passenger count
- Date range
- Approval image modal (if available)

**Features:**
- Real-time polling (500ms intervals) for new requests
- Dialog modal for viewing HOD approval images
- Status-based badge styling
- Icon indicators for request type

**Technologies:** React hooks, Dialog UI, Image component, date-fns formatting

---

### 11. **New Request Form** (`/requests/new`)
**File:** page.tsx

**Purpose:** Alternative form for creating new department vehicle requests.

**Form Fields:**
| Field | Type | Validation |
|-------|------|-----------|
| User Name | Text | Min 2 chars |
| Contact Number | Phone | Min 10 digits |
| Department Name | Text | Min 2 chars |
| Vehicle Type | Enum | two-wheeler, four-wheeler, tempo, eicher, bus |
| Passenger Count | Number | Min 1 |
| Destination | Text | Required |
| Duration From | Date | Required |
| Duration To | Date | Must be ≥ Duration From |
| HOD Approval Image | File | Optional |

**Features:**
- Date picker with calendar
- File upload for approval documents
- Toast notifications
- Form reset after successful submission
- Adds request to global requests list

**Technologies:** react-hook-form, Zod, date-fns, File uploads

---

### 12. **Handover/Vehicle Drop-off** (`/handover`)
**File:** page.tsx

**Purpose:** Record vehicle handover completion with receiver details.

**Form Fields (with Zod validation):**
| Field | Type | Validation |
|-------|------|-----------|
| Dispatch ID | Select | Required (dropd down) |
| Receiver Name | Text | Min 2 chars |
| Receiver Signature | Text | Min 2 chars |
| Remarks | Text | Optional |

**Features:**
- Dropdown selection from available dispatches
- Success modal with success icon
- Form reset after submission
- "Log Another Handover" button for multiple entries

**Post-Submission UX:**
- Success screen displays with checkmark
- Message: "Vehicle Received!"
- Button to log another handover or return

**Technologies:** react-hook-form, Zod, UI components, State management

---

### 13. **Admin Panel** (`/admin`)
**File:** page.tsx

**Purpose:** Administrative operations for bulk data import and system management.

**Key Features:**

**Vehicle Import Section:**
1. CSV file upload input
2. AI-powered mapping via Genkit flow
3. Review mapped data
4. Confirm and import

**Dispatch Import Section:**
1. CSV file upload input
2. AI-powered dispatch data mapping
3. Preview mapped data
4. Confirm and import

**Dashboard Tables:**
- **Indoor Requests:** Displays all indoor requests with pagination
- **Outdoor Requests:** Displays all outdoor requests
- **Vehicles:** Shows all fleet vehicles

**AI Flows Integration:**
- `importVehicleDataFromCsv`: Processes CSV → Vehicle objects
- `importDispatchDataFromCsv`: Processes CSV → Dispatch objects

**Features:**
- Real-time data polling (500ms)
- Tab-based navigation
- File input validation
- Loading states with spinners
- Toast notifications for feedback
- Scrollable result preview areas

**Technologies:** Genkit AI, FileReader API, React hooks, Table UI, Tabs UI

---

## **Cross-Page Features & Architecture**

### **Authentication & Authorization**
- Login required for all pages except `/`, `/login`, `/indoor-request`, `/outdoor-request`
- `AuthLayout` wrapper component for protected pages
- Hardcoded allowed user list (demo implementation)

### **UI/UX Components**
- Custom UI component library in ui
- Radix UI primitives with Tailwind CSS styling
- Responsive design: mobile-first approach
- Dark mode support via Tailwind

### **Forms & Validation**
- `react-hook-form` for form state management
- Zod for schema validation
- Error messages automatically displayed
- Toast notifications for user feedback

### **Data Management**
- In-memory data store in data.ts
- Real-time polling for data synchronization
- No persistent database in current implementation

### **AI Integration (Genkit)**
- Two AI flows: vehicle optimization, CSV parsing
- Used in dispatch page and admin panel
- Genkit framework with Google GenAI backend

### **Firebase Integration**
- Authentication (configured but not fully implemented)
- Firestore for reception data storage
- Cloud Storage for vehicle images

### **Icons & Imagery**
- Lucide React for all icons
- Next.js Image component for vehicles
- Camera API for live photo capture

---

This documentation provides a complete technical overview of all pages in the Transport Coordination Portal application.# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.
