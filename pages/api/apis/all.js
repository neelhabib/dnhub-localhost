import { connectToMongoDB } from "db";
export default async function handler(req, res) {
  try {
    const { db } = await connectToMongoDB();

    switch (req.method) {
      case "GET": {
        const [dynadot, namecheap, namesilo, godaddy] = await Promise.all([
          db.collection("dynadot-api").findOne({}, { projection: { id: 0 } }),
          db.collection("namecheap-api").findOne({}, { projection: { id: 0 } }),
          db.collection("namesilo-api").findOne({}, { projection: { id: 0 } }),
          db.collection("godaddy-api").findOne({}, { projection: { id: 0 } }),
        ]);

        res.json({
          dynadot,
          namecheap,
          namesilo,
          godaddy,
        });
        break;
      }
    }
  } catch (err) {
    res.json("Error, Please try again.");
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
