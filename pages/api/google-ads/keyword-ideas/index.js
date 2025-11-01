import { connectToMongoDB } from "db";
const axios = require("axios");

export default async function handler(req, res) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("google-api").findOne();
  const keywords = req.body?.keywords;

  if (!api) {
    return res.status(500).json({
      status: false,
      message: "Google API credentials not found.",
    });
  }

  try {
    switch (req.method) {
      case "POST": {
        const apiUrl = `https://googleads.googleapis.com/v21/customers/${api.customerId}:generateKeywordIdeas`;

        const response = await axios.post(
          apiUrl,
          {
            keywordSeed: {
              keywords: [keywords],
            },
            pageSize: 10000,
          },
          {
            headers: {
              Authorization: `Bearer ${api.accessToken}`,
              "developer-token": api.devToken,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response?.data?.results?.map((x) => ({
          keyword: x?.text,
          keywordMetrics: x?.keywordIdeaMetrics || {
            avgMonthlySearches: 0,
            competition: "LOW",
            competitionIndex: "0",
          },
        }));

        return res.status(200).json(data);
      }

      default:
        return res.status(405).json({
          status: false,
          message: "Method not allowed",
        });
    }
  } catch (error) {
    console.error(
      "Error fetching keyword ideas:",
      JSON.stringify(error?.response?.data || error)
    );
    if (error?.response?.data?.error === "invalid_grant") {
      return res.status(400).json({
        error:
          error?.response?.data?.error_description || "Refresh token expired",
        details: "Please login again on your https://localhost:5000",
      });
    } else if (error?.response?.data?.error?.status === "UNAUTHENTICATED") {
      return res.status(401).json({
        error: "Access token expired",
        details:
          "Please re-generate access token on your https://localhost:5000",
      });
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
