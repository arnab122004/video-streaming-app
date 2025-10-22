import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

export const createSessionMiddleware = () => {
  if (!mongoose.connection.readyState) {
    throw new Error("MongoDB is not connected yet!");
  }

  return session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(), //  now it's guaranteed
      collectionName: "sessions"
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true
    }
  });
};

export const userMiddleware = (req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
};
