import { connectToMongoDB } from "db";
export default async function handler(req, res) {
  const {
    api,
    secret,
    customerId,
    firstName,
    lastName,
    middleName,
    address1,
    address2,
    city,
    country,
    postalCode,
    state,
    email,
    org,
    phone,
    ns1,
    ns2,
  } = req.body;
  try {
    const { db } = await connectToMongoDB();
    switch (req.method) {
      case "POST":
        const result = await db.collection("godaddy-api").replaceOne(
          {},
          {
            api,
            secret,
            customerId,
            firstName,
            lastName,
            middleName,
            address1,
            address2,
            city,
            country,
            postalCode,
            state,
            email,
            org,
            phone,
            ns1,
            ns2,
          },
          { upsert: true }
        );

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          res.json({
            status: true,
            message: "Updated successfully",
          });
        } else {
          res.json({
            status: false,
            message:
              "Update was not successful. Data remains same. Please change some input.",
          });
        }

        break;

      case "GET":
        const doc = await db.collection("godaddy-api").findOne();

        res.json(doc);
        break;
    }
  } catch (err) {
    console.log(err);
    res.json("Error, Please try again.");
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
