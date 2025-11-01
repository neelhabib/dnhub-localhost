import axios from "axios";

export default async function ComparableSold(req, res) {
  const domain = req.body?.domain;
  const headers = {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "en-US,en;q=0.5",
    Connection: "keep-alive",
    Host: "in.godaddy.com",
    Priority: "u=0, i",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
  };
  try {
    switch (req.method) {
      case "POST":
        axios
          .get(
            `https://in.godaddy.com/domain-auctions/api/valuation/comparables/${domain}`,
            { headers },
          )
          .then((dom) => {
            const domains = dom.data?.map((x) => ({
              domain: x?.domainName,
              price: x?.price,
            }));
            res.json(domains);
          })
          .catch((err) => {
            console.log(err);
            res.json([{ domain: "error", price: 0 }]);
            console.log(err?.response?.data);
          });
        break;
    }
  } catch (error) {
    res.json([{ domain: "error", price: 0 }]);
    console.log(error?.response?.data);
  }
}
export const config = {
  api: {
    externalResolver: true,
  },
};
