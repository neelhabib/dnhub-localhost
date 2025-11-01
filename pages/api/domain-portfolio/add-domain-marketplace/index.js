import { connectToMongoDb } from "db";
import sedo from "./sedo";
export default async function AddDomainMarketPlace(req, res) {
  const { domain, price, cost, minOffer, floorPrice, register } = req.body;
  const { db } = await connectToMongoDb();
  try {
    switch (req.method) {
      case "POST":
        const results = await db.collection("all-domains").updateOne(
          { domain },
          {
            $set: {
              domain,
              price,
              cost,
              minPrice: minOffer,
              floorPrice,
              register,
            },
          },
          { upsert: true }
        );
        if (results?.matchedCount === 0 && results?.upsertedCount > 0) {
          console.log("domain inserted");
        } else if (results?.matchedCount > 0 && results?.modifiedCount > 0) {
          console.log("domain modified");
        } else if (
          results?.matchedCount > 0 &&
          results?.modifiedCount === 0 &&
          results?.upsertedCount === 0
        ) {
          console.log("domain exist and no change");
        }
        await sedo(req.body).then((res) => console.log(res));
        // Add domain to sedo market place

        res.json(results);
    }
  } catch (error) {
    console.log(error);
  }
}
