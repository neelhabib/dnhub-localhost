import { connectToMongoDB } from "db";
export default async function MarketPlace(req, res) {
  try {
    const { client } = await connectToMongoDB();
    switch (req.method) {
      case "POST":
        const sedoDomains = await client
          .db("localhost-server")
          .collection("sedo-domains")
          .find({})
          .toArray();

        res.json([...sedoDomains]);
    }
  } catch (error) {
    console.log(error);
  }
}
export const config = {
  api: { externalResolver: true },
};
