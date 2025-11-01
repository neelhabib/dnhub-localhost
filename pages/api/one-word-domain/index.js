const axios = require("axios");
import WhoisLight from "lib";
import { ccTld } from "./tlds2";
export default async function OneWordDomain(req, respond) {
  const { word } = req.body;
  const ccTlds = ccTld?.map((tld) => `${word}.${tld}`);
  const params = {
    name: word?.split(".")?.[0],
    tlds: "@checked",
    "include-registered": true,
    "max-results": 2000,
  };

  let arr = [];
  let promises = [];

  for (let who of ccTlds) {
    const promise = WhoisLight.lookup({ format: true }, who)
      .then((resp) => {
        const availability = resp?.["Creation Date"]
          ? "registered"
          : resp?.registered
            ? "registered"
            : resp?.created
              ? "registered"
              : resp?.registrant
                ? "registered"
                : resp?.["Registered on"]
                  ? "registered"
                  : resp?.["Created on"]
                    ? "registered"
                    : ["connect", "ok", "active"].includes(
                          resp?.Status,
                        )
                      ? "registered"
                      : resp?.Registrant
                        ? "registered"
                        : resp?.Domain
                          ? "registered"
                          : resp?.["registration status"] ==
                              "available"
                            ? "available"
                            : resp?.["created............"]
                              ? "registered"
                              : "available";

        const domain = {
          name: who,
          availability,
          token: who?.split(".")?.[1],
        };
        arr.push(domain);
      })
      .catch((error) => {
        // console.error(`Error fetching WHOIS for ${who}:`, error);
        arr.push({
          name: who,
          availability: "available",
          token: who?.split(".")?.[1],
        });
      });
    promises.push(promise);
  }

  // Wait for all promises to resolve or reject
  Promise.allSettled(promises).then(() => {
    axios
      .get(
        "https://sugapi.verisign-grs.com/ns-api/2.0/rank-tlds?",

        { params },
      )
      .then((res) => {
        const gTLD = res.data?.results;

        respond.json({ ccTLD: arr, gTLD });
      })
      .catch((err) => console.log("err"));
  });
  // respond.json([]);
}

export const config = {
  api: {
    externalResolver: true,
  },
};
