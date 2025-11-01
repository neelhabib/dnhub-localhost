import { connectToMongoDB } from "db";

export default async function handler(req, res) {
  try {
    const { db } = await connectToMongoDB();
    switch (req.method) {
      case "POST": {
        await db
          .collection("domain-auction")
          .updateOne(
            { fqdn: req?.body?.data?.fqdn },
            { $set: req?.body?.data },
            { upsert: true }
          )
          .then((doc) => res.json(doc))
          .catch((err) => {
            // console.log(err);
            res.json("error");
          });

        break;
      }
      case "GET": {
        await db
          .collection("domain-auction")
          .find()
          .toArray()
          .then((doc) => res.json(doc));

        break;
      }
      case "DELETE": {
        await db
          .collection("domain-auction")
          .deleteMany({})
          .then((doc) => {
            if (doc?.deletedCount > 0) {
              res.json({
                status: true,
                message: `Deleted all ${doc?.deletedCount} domains. You need to add domains again.`,
              });
            } else {
              res.json({
                status: false,
                message: "No Domains were added. Please add some domains.",
              });
            }
          })
          .catch((err) =>
            res.json({ status: false, message: "Some error occurred." })
          );
      }
    }
  } catch (err) {
    // console.log(err);
    res.json("Error, Please try again.");
  } finally {
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
