import axios from "axios";
import { connectToMongoDB } from "../../db.js";

async function refreshToken() {
  const { db } = await connectToMongoDB();
  const doc = await db.collection("google-api").findOne();

  if (!doc) {
    console.error("No Google API credentials found in DB.");
    return;
  }

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: doc.clientId,
      client_secret: doc.clientSecret,
      grant_type: "refresh_token",
      refresh_token: doc.refreshToken,
    });

    const result = await db
      .collection("google-api")
      .updateOne(
        {},
        { $set: { accessToken: response?.data?.access_token } },
        { upsert: true }
      );

    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      console.log({
        status: true,
        message: "Google Ads Access Token updated successfully",
      });
    } else {
      console.log({
        status: false,
        message:
          "Update was not successful. Data remains same. Please change some input.",
      });
    }
  } catch (err) {
    // console.error(err?.response?.data);
    console.log({
      status: false,
      message: "Failed to update access token.",
      reason: err?.response?.data?.error,
      description: err?.response?.data?.error_description,
      action:
        err?.response?.data?.error_description?.toLowerCase() ===
        "token has been expired or revoked."
          ? "Refresh Token Expired. Please connect google ads account again to generate Refresh Token."
          : "Some error occured. Please try again",
    });
  }
}

export default function GenerateToken() {
  // Run immediately
  refreshToken();
  // Then every 45 minutes
  setInterval(refreshToken, 2700000);
}

// module.exports = GenerateToken;
