import { connectToMongoDB } from "db";
export default async function handler(req, res) {
  const { db } = await connectToMongoDB();
  const { domain } = req.body;
  switch (req.method) {
    case "POST":
      try {
        const response = await db
          .collection("notifications")
          .updateOne({ domain }, { $set: { read: true } });
        return res.json({
          status: true,
          message: "notification status updated successfully",
          data: response,
        });
      } catch (err) {
        return res.json({
          status: false,
          message: "notification didn't updated",
        });
      }
  }
}
