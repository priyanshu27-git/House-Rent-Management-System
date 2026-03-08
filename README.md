🏠 HouseHunt: Modern Property Rental Platform
HouseHunt is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to bridge the gap between property owners and tenants. Specifically optimized for the Jabalpur region, it offers a high-performance interface for listing, discovering, and managing rental properties.
✨ Key Features👤 User Roles & DashboardsTenants: Can search for properties, save favorites, and send inquiries to owners.Owners: Can list properties, manage their current listings, and respond to tenant inquiries.Admins: Responsible for property verification and platform-wide user management.🔍 Search & DiscoveryAdvanced Filtering: Filter by location (regex search), property type, and price range.Animated UI: Smooth hero-section transitions using Framer Motion.💾 FunctionalityFavorite System: Persistent property "liking" stored directly in the user account.Inquiry Tracking: Real-time status updates for property inquiries (Pending/Responded).Image Hosting: Integrated with Supabase Storage for high-performance cloud image management.🛠️ Tech StackLayerTechnologyFrontendReact, Tailwind CSS, Framer Motion, Lucide IconsBackendNode.js, Express.jsDatabaseMongoDB (Mongoose ODM)StorageSupabase StorageAuthJSON Web Tokens (JWT) & bcrypt.js🚀 Getting Started1. PrerequisitesNode.js installed locally.A MongoDB Atlas cluster or local instance.A Supabase project for image storage.
# Install Backend dependencies
cd server
npm install

# Install Frontend dependencies
cd ../client
npm install
3. Environment SetupCreate a .env file in the server directory:Code snippetMONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
4. Run the AppBash# In server directory
npm run dev

# In client directory
npm start
📂 Project StructurePlaintext├── client/                # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI (PropertyCard, etc.)
│   │   ├── pages/         # Dashboard, Explore, Home
│   │   └── Context/       # AuthContext
└── server/                # Node.js Backend
    ├── controllers/       # Property, User logic
    ├── models/            # Mongoose Schemas
    └── routes/            # API Endpoints
🔒 Authentication & SecurityJWT Authentication: Secure login and session management.Protected Routes: Role-based access control (RBAC) ensures tenants cannot access owner/admin actions.Input Validation: Strict backend validation for property creation and inquiries.🔮 Future RoadmapReal-time Chat: Direct messaging between owners and tenants.AI Safety Integration: Safety-powered navigation for visiting properties.Map View: Interactive Jabalpur city map integration for property locations.
