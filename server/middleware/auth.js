import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "househunt_secret_key";

/**
 * Middleware to verify the JWT token from the headers.
 * Matches the logic in your AuthContext.jsx useEffect and login functions.
 */
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user data to request object
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Middleware to restrict access based on user role.
 * Works with your ProtectedRoute logic in App.jsx.
 */
export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    next();
  };
};