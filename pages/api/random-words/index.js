import { connectToMongoDB } from "db";
import axios from "axios";

export default async function handler(req, res) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("google-api").findOne();
  const apiUrl = `https://googleads.googleapis.com/v21/customers/${api?.customerId}:generateKeywordHistoricalMetrics`;
  const words = req?.body?.words || [];

  try {
    const response = await axios
      .post(
        apiUrl,
        {
          keywords: [...words],
          keywordPlanNetwork: "GOOGLE_SEARCH",
          historicalMetricsOptions: {
            includeAverageCpc: true,
          },
        },

        {
          headers: {
            Authorization: `Bearer ${api?.accessToken}`,
            "developer-token": api?.devToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => res?.data);

    const data = response?.results?.map((x) => ({
      domain: x.text
        ?.split(" ")
        ?.map((z) => z.slice(0, 1).toUpperCase().concat(z.slice(1)))
        ?.join(""),
      keyword: x?.text,
      keywordMetrics: x?.keywordMetrics || {
        avgMonthlySearches: 0,
        competition: "LOW",
        competitionIndex: "0",
      },
    }));
    return res.status(200).json(data);
  } catch (error) {
    console.error(
      "Error fetching keyword ideas:",
      JSON.stringify(error?.response?.data)
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
    } else {
      return res.status(401).json({
        error: "Some error occurred.",
        details: "Some error occurred. Please try again after few minutes.",
      });
    }
  }
}
export const config = {
  api: {
    externalResolver: true,
  },
};
