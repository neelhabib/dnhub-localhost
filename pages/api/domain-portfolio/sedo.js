import { connectToMongoDb } from "db";
import soap from "soap";
const sedoUrl = "https://api.sedo.com/api/v1/?wsdl";
const args = {
  partnerid: "327338", // "327338", // doc.sedoPartnerId,
  signkey: "f1200c40a7d8c36941d7e262fb6c07", // "f1200c40a7d8c36941d7e262fb6c07", //doc.sedoSignKey,
  username: "neelhabib",
  password: "Chissa@123",
  results: 100,
};

async function SedoDomainList(req, res) {
  const { db } = await connectToMongoDb();
  try {
    soap.createClient(sedoUrl, function (err, clients) {
      clients?.DomainList({ args }, async function (err, result) {
        err && console.log("err");
        const sedoDomains = result?.return?.item?.map((x) => ({
          marketPlace: "sedo",
          domain: x?.domain?.$value,
          price: x?.price?.$value,
          minPrice: x?.minprice?.$value,
          fixedPrice: x?.fixedprice?.$value,
          currency:
            x?.currency?.$value === 1
              ? "USD"
              : x?.currency?.$value === 2
              ? "GBP"
              : "EUR",
          forSale: x?.forsale?.$value,
        }));
        res.json(sedoDomains);
        const bulkOps = sedoDomains.map((item) => ({
          updateOne: {
            filter: { domain: item.domain },
            update: { $set: item },
            upsert: true,
          },
        }));
        await db.collection("sedo-domains").bulkWrite(bulkOps);
      });
    });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}
module.exports = SedoDomainList;
