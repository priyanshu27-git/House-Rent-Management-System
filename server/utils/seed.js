import { User, Property } from "../models/index.js";
import bcrypt from "bcryptjs";

/**
 * seedDB populates the HouseHunt database with initial roles and listings.
 * This matches the filters and roles used in your React frontend.
 */
export async function seedDB() {
  try {
    const userCount = await User.countDocuments();
    
    // Check if DB is already seeded to prevent duplicates
    if (userCount === 0) {
      console.log("🚀 Starting database seeding...");
      
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      // 1. Create Admin
      const admin = new User({
        name: "Admin User",
        email: "admin@househunt.com",
        password: hashedPassword,
        role: "admin",
        phone: "1234567890"
      });
      await admin.save();
      
      // 2. Create Owner
      const owner = new User({
        name: "John Owner",
        email: "owner@househunt.com",
        password: hashedPassword,
        role: "owner",
        phone: "9876543210"
      });
      await owner.save();
      
      // 3. Create Tenant
      const tenant = new User({
        name: "Jane Tenant",
        email: "tenant@househunt.com",
        password: hashedPassword,
        role: "tenant",
        phone: "5556667777"
      });
      await tenant.save();
      
      // 4. Create Initial Properties
      const properties = [
        {
          title: "Modern Downtown Apartment",
          description: "A beautiful 2-bedroom apartment in the heart of the city. Close to subway and parks.",
          price: 2500,
          location: "Udaipur, Rajasthan",
          propertyType: "Apartment",
          images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80"],
          ownerId: owner._id,
          isApproved: true, // Auto-approve first listing for testing
          availabilityStatus: "available"
        },
        {
          title: "Cozy Suburban House",
          description: "Spacious family home with a large backyard and modern kitchen.",
          price: 3200,
          location: "Lonavala, Maharashtra",
          propertyType: "House",
          images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80"],
          ownerId: owner._id,
          isApproved: false, // Leave one pending for Admin Dashboard testing
          availabilityStatus: "available"
        },
        {
          title: "Luxury Beachfront Villa",
          description: "Stunning villa with private pool and direct access to the beach.",
          price: 5000,
          location: "Mumbai,Maharashtra",
          propertyType: "Villa",
          images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"],
          ownerId: owner._id,
          isApproved: true,
          availabilityStatus: "available"
        }
      ];
      
      await Property.insertMany(properties);
      
      console.log("✅ Seeding complete. You can now login with:");
      console.log("- Admin: admin@househunt.com / password123");
      console.log("- Owner: owner@househunt.com / password123");
      console.log("- Tenant: tenant@househunt.com / password123");
    } else {
      console.log("ℹ️ Database already contains data. Skipping seed.");
    }
  } catch (error) {
    console.error("❌ Seeding error:", error);
  }
}