import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import "dotenv/config";
import { db } from "../db";

export const initPassport = () => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
      "Missing environment variables for authentication providers"
    );
  }
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/auth/google/callback",
        state: true,
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        try {
          //@ts-ignore
          const user = await db.user.upsert({
            create: {
              username: profile.displayName,
              email: profile.emails[0].value!,
              picture: profile.photos[0].value,
              provider: "Google",
            },
            update: {
              email: profile.emails[0].value,
              picture: profile.photos[0].value,
            },
            //@ts-ignore
            where: {
              username: profile.displayName,
            },
          });

          done(null, user);
        } catch (error) {
          console.log(error);
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser(function (user: any, cb) {
    process.nextTick(function () {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture,
      });
    });
  });

  passport.deserializeUser(function (user: any, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });
};
