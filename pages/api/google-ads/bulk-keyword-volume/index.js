import axios from "axios";
import { connectToMongoDB } from "db";

export default async function bulkDomainVolume(req, respond) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("google-api").findOne();
  const apiUrl = `https://googleads.googleapis.com/v21/customers/${api?.customerId}:generateKeywordHistoricalMetrics`;

  const keywords = req?.body?.keywords;

  try {
    switch (req.method) {
      case "POST":
        const response = await axios.post(
          apiUrl,
          {
            keywords: [...keywords],
            keywordPlanNetwork: "GOOGLE_SEARCH",
          },

          {
            headers: {
              Authorization: `Bearer ${api?.accessToken}`,
              "developer-token": api?.devToken,
              "Content-Type": "application/json",
            },
          }
        );

        const data = response?.data?.results?.map((x) => ({
          keyword: x?.text,
          keywordMetrics: x?.keywordMetrics || {
            avgMonthlySearches: 0,
            competition: "LOW",
            competitionIndex: "0",
          },
        }));

        return respond.json(data);
        break;
    }
  } catch (error) {
    console.log(
      "Error fetching keyword ideas:",
      JSON.stringify(error?.response?.data)
    );
    if (error?.response?.data?.error === "invalid_grant") {
      return respond.status(400).json({
        error:
          error?.response?.data?.error_description || "Refresh token expired",
        details: "Please login again on your https://localhost:5000",
      });
    } else if (error?.response?.data?.error?.status === "UNAUTHENTICATED") {
      return respond.status(401).json({
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
