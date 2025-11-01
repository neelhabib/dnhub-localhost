import { connectToMongoDB } from "db";

export default async function handler(req, res) {
  const { customerId, devToken, clientId, clientSecret } = req.body;

  try {
    const { db } = await connectToMongoDB();

    switch (req.method) {
      case "POST": {
        const result = await db.collection("google-api").replaceOne(
          {},
          {
            customerId,
            devToken,
            clientId,
            clientSecret,
          },
          { upsert: true }
        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          return res.status(200).json({
            status: true,
            message: "Updated successfully",
          });
        } else {
          return res.status(200).json({
            status: false,
            message:
              "Update was not successful. Data remains same. Please change some input.",
          });
        }
      }

      case "GET": {
        const doc = await db.collection("google-api").findOne();

        return res.status(200).json(doc);
      }

      default:
        return res.status(405).json({
          status: false,
          message: "Method not allowed",
        });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      message: "Error, Please try again.",
    });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
