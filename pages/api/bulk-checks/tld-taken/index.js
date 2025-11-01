import { ccTld } from "pages/api/one-word-domain/tlds2";
import axios from "axios";
import WhoisLight from "lib";

export default async function handler(req, res) {
  const { domain } = req.body;
  const ccTlds = ccTld?.map(
    (tld) => `${domain?.split(".")?.[0]}.${tld}`,
  );
  const params = {
    name: domain?.split(".")?.[0],
    tlds: "@checked",
    "include-registered": true,
    "max-results": 2000,
  };
  try {
    switch (req.method) {
      case "POST":
        let arr = [];
        let promises = [];

        for (let who of ccTlds) {
          const promise = WhoisLight.lookup(
            { format: true },
            who,
          )
            .then((resp) => {
              const registeredChecks = [
                "Creation Date",
                "registered",
                "created",
                "registrant",
                "Registered on",
                "Created on",
                "Registrant",
                "Domain",
                "created............",
              ];

              let availability = "available";

              for (const key of registeredChecks) {
                if (resp?.[key] || resp?.[key] === true) {
                  availability = "registered";
                  break;
                }
              }

              if (
                ["connect", "ok", "active"].includes(
                  resp?.Status,
                )
              ) {
                availability = "registered";
              } else if (
                resp?.["registration status"] === "available"
              ) {
                availability = "available";
              }

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
                availability: "error",
                token: who?.split(".")?.[1],
              });
            });
          promises.push(promise);
        }

        await Promise.allSettled(promises);
        const results = await axios
          .get(
            `https://sugapi.verisign-grs.com/ns-api/2.0/rank-tlds?`,
            {
              params,
            },
          )
          .then((res) =>
            res.data?.results?.map((x) => ({
              ...x,
              token: x?.token,
              domain: x?.name,
              availability: x?.availability,
            })),
          );
        return res.status(200).json([...arr, ...results]);
    }
  } catch (error) {
    console.error("Error fetching domains", error);
    res.status(500).json("error");
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
