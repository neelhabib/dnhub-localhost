const axios = require("axios");
export default async function handler(req, res) {
  const { domains, ext } = req.body;

  try {
    switch (req.method) {
      case "POST":
        const results = await axios
          .get(
            `https://sugapi.verisign-grs.com/ns-api/2.0/bulk-check?names=${domains?.toString()}&tlds=${ext}&include-registered=true`
          )
          .then((res) =>
            res.data?.results?.map((x) => ({
              domain: x?.name,
              availability: x?.availability,
            }))
          );

        return res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching domains", error);
    res.status(200).json("error");
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
