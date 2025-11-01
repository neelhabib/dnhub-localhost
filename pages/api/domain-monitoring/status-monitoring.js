import WhoisLight from "lib";
import { connectToMongoDB } from "db";
import dns2 from "dns2";
const dns = new dns2();

const FIELD_KEYS = {
  CREATION_DATE: ["Creation Date", "Registered on"],
  UPDATED_DATE: ["Updated Date", "Last updated"],
  EXPIRY_DATE: ["Registry Expiry Date", "Expiry date"],
  REGISTRAR: "Registrar",
  DOMAIN_STATUS: "Domain Status",
};

const getWhoisField = (whois, keys) => {
  if (!whois) return "n/a";
  for (const key of Array.isArray(keys) ? keys : [keys]) {
    if (whois[key]) return whois[key];
  }
  return "n/a";
};

const createHistory = (date, value) => [{ date, status: value }];

export default async function AvailableMonitoring(req, res) {
  const { method, body } = req;
  const { domain, domains } = body || {};

  // Input validation
  if (["POST", "DELETE"].includes(method) && !domain && !domains) {
    return res.status(400).json({
      status: false,
      message: "Domain(s) are required.",
    });
  }

  const { db } = await connectToMongoDB();

  try {
    switch (method) {
      case "POST": {
        const existing = await db
          .collection("status-monitoring")
          .findOne({ domain });

        if (existing) {
          return res.status(200).json({
            status: false,
            message: "Domain already exists.",
          });
        }

        const [A, NS, whois] = await Promise.all([
          dns.resolve(domain, "A").then((x) => x?.answers),
          dns.resolve(domain, "NS").then((x) => x?.answers),
          WhoisLight.lookup({ format: true }, domain).catch(() => ({})),
        ]);
        const now = Date.now();

        const isAvailable = !getWhoisField(whois, FIELD_KEYS.CREATION_DATE)
          ? "Available"
          : "Registered";

        const updateDoc = {
          domain,
          isAvailable: {
            value: isAvailable,
            history: createHistory(now, isAvailable),
          },
          creationDate: {
            value: getWhoisField(whois, FIELD_KEYS.CREATION_DATE),
            history: createHistory(
              now,
              getWhoisField(whois, FIELD_KEYS.CREATION_DATE)
            ),
          },
          updatedDate: {
            value: getWhoisField(whois, FIELD_KEYS.UPDATED_DATE),
            history: createHistory(
              now,
              getWhoisField(whois, FIELD_KEYS.UPDATED_DATE)
            ),
          },
          expiryDate: {
            value: getWhoisField(whois, FIELD_KEYS.EXPIRY_DATE),
            history: createHistory(
              now,
              getWhoisField(whois, FIELD_KEYS.EXPIRY_DATE)
            ),
          },
          registrar: {
            value: getWhoisField(whois, FIELD_KEYS.REGISTRAR),
            history: createHistory(
              now,
              getWhoisField(whois, FIELD_KEYS.REGISTRAR)
            ),
          },
          domainStatus: {
            value:
              getWhoisField(whois, FIELD_KEYS.DOMAIN_STATUS)?.split(" ")?.[0] ||
              "n/a",
            history: createHistory(
              now,
              getWhoisField(whois, FIELD_KEYS.DOMAIN_STATUS)?.split(" ")?.[0] ||
                "n/a"
            ),
          },
          nameServer: {
            value: Array.isArray(NS) ? NS?.map((x) => x?.ns) : "n/a",
            history: createHistory(
              now,
              Array.isArray(NS) ? NS?.map((x) => x?.ns) : "n/a"
            ),
          },
          ip: {
            value: Array.isArray(A) ? A?.map((x) => x?.address) : "n/a",
            history: createHistory(
              now,
              Array.isArray(A) ? A?.map((x) => x?.address) : "n/a"
            ),
          },
        };

        await db
          .collection("status-monitoring")
          .updateOne({ domain }, { $set: updateDoc }, { upsert: true });

        return res.status(200).json({
          status: true,
          message: "Domain added to the status monitoring.",
          data: updateDoc,
        });
      }

      case "GET": {
        const docs = await db.collection("status-monitoring").find().toArray();
        return res.json(docs);
      }

      case "DELETE": {
        if (!Array.isArray(domains)) {
          return res.status(400).json({
            status: false,
            message: "Domains array is required.",
          });
        }
        const results = await db
          .collection("status-monitoring")
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

      default:
        return res.status(405).json({
          status: false,
          message: "Method not allowed.",
        });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
      message: "Some error occurred. Please try again later.",
    });
  }
}
