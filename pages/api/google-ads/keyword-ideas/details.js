import { connectToMongoDB } from "db";
import axios from "axios";
import dayjs from "dayjs";

export default async function handler(req, res) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("google-api").findOne();
  const { keywords, geoTargetConstants } = req.body;

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

        const currentDate = dayjs();
        const startYear = currentDate.year() - 5 + 1; // last five years including current year
        const endYear = currentDate.year();
        const endMonth = currentDate.format("MMMM").toUpperCase();

        const requestBody = {
          keywordSeed: {
            keywords: [keywords],
          },
          keywordPlanNetwork: "GOOGLE_SEARCH",
          keywordAnnotation: ["KEYWORD_CONCEPT"],
          aggregateMetrics: {
            aggregateMetricTypes: ["DEVICE"],
          },
          historicalMetricsOptions: {
            includeAverageCpc: true,
            yearMonthRange: {
              start: {
                year: startYear,
                month: "JANUARY",
              },
              end: {
                year: endYear,
                month: endMonth,
              },
            },
          },
          pageSize: 10000,
        };

        if (geoTargetConstants) {
          requestBody.geoTargetConstants = `geoTargetConstants/${geoTargetConstants}`;
        }

        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${api.accessToken}`,
            "developer-token": api.devToken,
            "Content-Type": "application/json",
          },
        });

        const results = response?.data?.results || [];
        const data = results.map((item) => ({
          keyword: item?.text || "",
          keywordAnnotations: item?.keywordAnnotations,
          keywordMetrics: item?.keywordIdeaMetrics ?? {
            avgMonthlySearches: 0,
            competition: "LOW",
            competitionIndex: "0",
          },
        }));

        return res.status(200).json({
          totalSize: response?.data?.totalSize ?? results.length,
          aggregateMetricResults: response?.data?.aggregateMetricResults ?? {},
          data,
        });
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
