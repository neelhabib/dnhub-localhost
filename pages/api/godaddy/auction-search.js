import axios from "axios";

export default async function handler(req, res) {
  const { value } = req.body;

  // Example way to use `value` as the search query, fallback to 'hello' if not given
  const queryValue = encodeURIComponent(value || "hello");

  try {
    const response = await axios.get(
      `
      https://www.godaddy.com/en-in/domainfind/v1/search/spins?search_guid=48a9494a-80f2-41d6-80b0-d663a71b002b&req_id=1756689179008&isc=inflash258&itc=dpp_absol1&partial_query=domain.in&pagesize=40&pagestart=0&key=dpp_search&q=domain.in`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language":
            "en-GB,en-US;q=0.9,en;q=0.8,bn;q=0.7",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          // Chrome Headless compatible (optional headers for even more realism)
          Origin: "https://www.godaddy.com",
          Referer: "https://www.godaddy.com/",

          "Sec-Ch-Ua":
            '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Linux"',
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-site",

          "Upgrade-Insecure-Requests": "1",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      },
    );
    const data = response?.data;
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res
      .status(error.response?.status || 500)
      .json({ error: error.message || "Request failed" });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
