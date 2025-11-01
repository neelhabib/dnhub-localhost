import { connectToMongoDB } from "db";
export default async function handler(req, res) {
  try {
    // Create a new client for this request
    const { db } = await connectToMongoDB();
    switch (req.method) {
      case "POST": {
        const {
          domains,
          enable,
          enableGodaddy,
          enableNameCheap,
          enableDynadot,
          enableNameSilo,
        } = req.body;

        await db
          .collection("auto-catch-domains")
          .updateOne(
            {},
            {
              $set: {
                domains,
                enable,
                enableGodaddy,
                enableNameCheap,
                enableDynadot,
                enableNameSilo,
              },
            },
            { upsert: true }
          )
          .then(() =>
            res.json({
              status: true,
              message: "Domains and Services Updated.",
            })
          )
          .catch((err) => {
            res.json({
              status: false,
              message: "Some Error Occurred. Please try again",
            });
          });

        break;
      }

      case "GET": {
        await db
          .collection("auto-catch-domains")
          .findOne()
          .then((docs) => res.json(docs));

        break;
      }
    }
  } catch (err) {
    // console.log(err);
    res.json({ status: false, message: "Error, Please try again." });
  } finally {
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
