const axios = require("axios");

export default async function handler(req, res) {
  const keyword = req.body?.keyword;
  if (req.method === "POST") {
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8,bn;q=0.7",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Origin: "https://tmsearch.uspto.gov",
      Pragma: "no-cache",
      Referer:
        "https://tmsearch.uspto.gov/search/search-results",
      "Sec-CH-UA":
        '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
      "Sec-CH-UA-Mobile": "?0",
      "Sec-CH-UA-Platform": '"Linux"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    };
    try {
      const response = await axios.post(
        "https://tmsearch.uspto.gov/api-v1-0-0/tmsearch",
        {
          query: {
            bool: {
              must: [
                {
                  bool: {
                    should: [
                      {
                        query_string: {
                          query: `${keyword}*`,
                          default_operator: "AND",
                          fields: [
                            "goodsAndServices",
                            "markDescription",
                            "ownerName",
                            "translate",
                            "wordmark",
                            "wordmarkPseudoText",
                          ],
                        },
                      },
                      {
                        term: {
                          WM: {
                            value: keyword,
                            boost: 6,
                          },
                        },
                      },
                      {
                        match_phrase: {
                          WMP5: {
                            query: keyword,
                          },
                        },
                      },
                      {
                        query_string: {
                          query: keyword,
                          default_operator: "AND",
                          fields: [
                            "goodsAndServices",
                            "markDescription",
                            "ownerName",
                            "translate",
                            "wordmark",
                            "wordmarkPseudoText",
                          ],
                        },
                      },
                      {
                        term: {
                          SN: {
                            value: keyword,
                          },
                        },
                      },
                      {
                        term: {
                          RN: {
                            value: keyword,
                          },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          aggs: {
            alive: {
              terms: {
                field: "alive",
              },
            },
            cancelDate: {
              value_count: {
                field: "cancelDate",
              },
            },
          },
          size: 100,
          from: 0,
          track_total_hits: true,
          highlight: {
            fields: {
              abandonDate: {},
              attorney: {},
              alive: {},
              cancelDate: {},
              coordinatedClass: {},
              currentBasis: {},
              drawingCode: {},
              filedDate: {},
              goodsAndServices: {},
              id: {},
              internationalClass: {},
              markDescription: {},
              markType: {},
              ownerFullText: {},
              ownerName: {},
              ownerType: {},
              priorityDate: {},
              registrationDate: {},
              registrationId: {},
              registrationType: {},
              supplementalRegistrationDate: {},
              translate: {},
              usClass: {},
              wordmarkPseudoText: {},
            },
            pre_tags: ["<strong>"],
            post_tags: ["</strong>"],
            number_of_fragments: 0,
          },
          _source: [
            "abandonDate",
            "alive",
            "attorney",
            "cancelDate",
            "coordinatedClass",
            "currentBasis",
            "drawingCode",
            "filedDate",
            "goodsAndServices",
            "id",
            "internationalClass",
            "markDescription",
            "markType",
            "ownerFullText",
            "ownerName",
            "ownerType",
            "priorityDate",
            "registrationDate",
            "registrationId",
            "registrationType",
            "supplementalRegistrationDate",
            "translate",
            "usClass",
            "wordmark",
            "wordmarkPseudoText",
          ],
          min_score: 8,
        },
        {
          headers,
        },
      );

      return res.status(200).json(response.data); // Send the response
    } catch (error) {
      // console.error("Error ", error);
      return res
        .status(500)
        .json({
          error:
            "An error occurred while processing the request",
        });
    }
  } else {
    // Handle unsupported HTTP methods
    return res
      .status(405)
      .json({ error: "Method not allowed" });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
