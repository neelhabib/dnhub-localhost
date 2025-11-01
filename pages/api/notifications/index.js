import { connectToMongoDB } from "db";
export default async function handler(req, res) {
  const { db } = await connectToMongoDB();

  switch (req.method) {
    case "GET":
      try {
        const unread = await db
          .collection("notifications")
          .find({ read: false })
          .toArray();
        const read = await db
          .collection("notifications")
          .find({ read: true })
          .limit(2)
          .toArray();
        return res.json({ unread, read });
      } catch (err) {
        return res.json([]);
      }
  }
}
