import { connectToMongoDB } from "db";

export default async function handler(req, res) {
  try {
    const {
      account: {
        access_token,
        expires_at,
        refresh_token,
        refresh_token_expires_in,
      },
    } = req.body;
    const { db } = await connectToMongoDB();

    if (req.method === "POST") {
      try {
        const result = await db.collection("google-api").updateOne(
          {},
          {
            $set: {
              accessToken: access_token,
              refreshToken: refresh_token,
              accessTokenExpiresAt: expires_at,
              refreshTokenExpiresIn: refresh_token_expires_in,
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
        console.error(err);
        return res.status(500).json({
          status: false,
          message: "Failed to update auth code",
        });
      }
    } else {
      res.status(405).json({ status: false, message: "Method not allowed" });
    }
  } catch (err) {
    console.error(err);
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
