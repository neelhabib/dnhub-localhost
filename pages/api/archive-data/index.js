const axios = require("axios");
export default async function handler(req, res) {
  const domain = req.body?.domain?.toLowerCase();

  try {
    switch (req.method) {
      case "POST":
        const captures = await axios.get(
          `http://web.archive.org/cdx/search/cdx`,
          {
            params: {
              url: domain,
              output: "json",
              limit: 1, //remove limit to get all captures
              sort: "asc",
            },
          }
        );

        res.json(captures?.data);
    }
  } catch (error) {
    console.error(
      "Error in getting Archive Data:",
      error?.response?.data || error.request?.data || error?.response || error
    );
    res.json("error");
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
