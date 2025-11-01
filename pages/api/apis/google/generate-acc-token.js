import axios from "axios";
import { connectToMongoDB } from "db";

export default async function handler(req, res) {
  try {
    const { db } = await connectToMongoDB();
    const doc = await db.collection("google-api").findOne();
    console.log(doc);
    if (req.method === "POST") {
      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            client_id: doc?.clientId,
            client_secret: doc?.clientSecret,
            grant_type: "refresh_token",
            refresh_token: doc?.refreshToken,
          }
        );

        const result = await db.collection("google-api").updateOne(
          {},
          {
            $set: {
              accessToken: response?.data?.access_token,
            },
          },
          { upsert: true }
        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          return res.json({
            status: true,
            message: "Updated successfully",
          });
        } else {
          return res.json({
            status: false,
            message:
              "Update was not successful. Data remains same. Please change some input.",
          });
        }
      } catch (err) {
        // console.error(err);
        return res.status(500).json({
          status: false,
          message:
            err?.response?.data?.error_description ||
            "Failed to update access token.",
        });
      }
    } else {
      res.status(405).json({ status: false, message: "Method not allowed" });
    }
  } catch (err) {
    // console.error(err);
    res.status(500).json({
      status: false,
      message: "Server error. Please try again.",
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
