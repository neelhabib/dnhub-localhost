import { connectToMongoDB } from "db";
const soap = require("soap");
const sedoUrl = "https://api.sedo.com/api/v1/?wsdl";

export default async function SedoPremium(req, res) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("sedo-api").findOne();

  const args = {
    partnerid: api?.partnerId,
    signkey: api?.signKey,
    keyword: req.body?.domain,
    tld: "com",
    kwtype: "C",
    resultsize: 100,
  };

  try {
    switch (req.method) {
      case "POST":
        soap.createClient(sedoUrl, function (err, clients) {
          clients?.DomainSearch({ args }, async function (err, result) {
            err && console.log(err);
            const domains = result?.return?.item?.map((x) => ({
              domain: x?.domain?.$value,
              price: x?.price?.$value,
              currency: x?.currency?.$value,
              url: x?.url?.$value,
            }));

            return res.json(domains);
          });
        });
        break;
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json([{ domain: "error", price: 0 }]);
  }
}
export const config = {
  api: {
    externalResolver: true,
  },
};
