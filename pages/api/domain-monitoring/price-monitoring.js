import axios from "axios";
import { connectToMongoDB } from "db";
const soap = require("soap");
const sedoUrl = "https://api.sedo.com/api/v1/?wsdl";

export default async function PriceMonitoring(req, res) {
  const { domain } = req.body;
  const { db } = await connectToMongoDB();
  try {
    switch (req.method) {
      case "POST":
        const api = await db.collection("sedo-api").findOne({});
        if (!api) {
          return res.status(500).json({
            status: false,
            message: "Missing SEDO API configuration",
          });
        }
        const args = {
          partnerid: api?.partnerId,
          signkey: api?.signKey,
          username: api?.userName,
          password: api?.password,
          domainlist: [[domain]],
        };

        // Promisify the soap.createClient call
        const clients = await new Promise((resolve, reject) => {
          soap.createClient(sedoUrl, function (err, item) {
            if (err) {
              return reject(err);
            }
            resolve(item);
          });
        });

        // Promisify the DomainInsert call
        const sedo = await new Promise((resolve, reject) => {
          clients.DomainStatus({ args }, function (err, result) {
            if (err) {
              return reject(err);
            }

            const isForSale = result?.return?.item?.forsale?.$value;
            if (isForSale) {
              resolve({
                domain,
                status: true,
                forSale: isForSale,
                sedoPrice: result?.return?.item?.price?.$value,
                initialPrice: result?.return?.item?.price?.$value,
                currentPrice: result?.return?.item?.price?.$value,
                currency: result?.return?.item?.currency?.$value,
                domainStatus: result?.return?.item?.domainstatus?.$value,
              });
            } else {
              resolve({
                status: false,
              });
            }
          });
        });
        if (sedo?.status) {
          const existing = await db
            .collection("price-monitoring")
            .findOne({ domain });
          if (existing) {
            return res.status(200).json({
              status: false,
              message: "Domain already exist.",
            });
          } else {
            const doc = {
              domain,
              initialPrice: sedo?.initialPrice,
              currentPrice: sedo?.currentPrice,
              sedoPrice: sedo?.sedoPrice,
              forSale: sedo?.forSale,
              currency: sedo?.currency,
              domainStatus: sedo?.domainStatus,
              dateAdded: Date.now(),
              history: [
                {
                  date: Date.now(),
                  price: sedo?.sedoPrice,
                },
              ],
            };
            const results = await db
              .collection("price-monitoring")
              .insertOne(doc);

            doc._id = results.insertedId; // Add the MongoDB ID

            return res.status(200).json({
              status: true,
              message: "Domain added to the pricing monitoring.",
              data: doc,
            });
          }
        } else {
          return res.status(200).json({
            status: false,
            message: "Domain not listed on marketplace.",
          });
        }

      case "GET":
        await db
          .collection("price-monitoring")
          .find()
          .toArray()
          .then((docs) => res.json(docs));
        break;

      case "DELETE":
        const { domains } = req.body;

        const results = await db
          .collection("price-monitoring")
          .deleteMany({ domain: { $in: domains } });

        if (results.deletedCount > 0) {
          return res.status(200).json({
            status: true,
            message: "Domains deleted successfully.",
            data: results,
          });
        } else {
          return res.status(200).json({
            status: false,
            message: "No domains found to delete.",
          });
        }
    }
  } catch (error) {
    console.error(error);
    return res.status(error?.status || 500).json({
      status: false,
      message: "Some error occured. please try again.",
      error: error?.message || error,
    });
  }
}
export const config = { api: { externalResolver: true } };
