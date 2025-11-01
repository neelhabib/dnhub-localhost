import axios from "axios";
import { connectToMongoDB } from "db.js";
import { apiVersion } from "./apiVersion";
import dayjs from "dayjs";

const currentDate = dayjs();
const startYear = currentDate.year() - 5 + 1; // last five years including current year
const endYear = currentDate.year();
const endMonth = currentDate.format("MMMM").toUpperCase();

export default async function historicalMetrics({
  words = ["google"],
  keywordPlanNetwork = "GOOGLE_SEARCH",
  historicalMetricsOptions = {
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
  geoTargetConstants,
}) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("google-api").findOne();
  const apiUrl = `https://googleads.googleapis.com/${apiVersion}/customers/${api?.customerId}:generateKeywordHistoricalMetrics`;

  try {
    switch (req.method) {
      case "POST":
        const requestBody = {
          keywords: words,
          keywordPlanNetwork: keywordPlanNetwork,
          historicalMetricsOptions: {
            includeAverageCpc: true,
          },
        };
        if (geoTargetConstants) {
          requestBody.geoTargetConstants = `geoTargetConstants/${geoTargetConstants}`;
        }

        const response = await axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${api?.accessToken}`,
            "developer-token": api?.devToken,
            "Content-Type": "application/json",
          },
        });

        const data = response?.data?.results?.map((x) => ({
          domain: domains.find(
            (y) =>
              x?.text?.split(" ").join("") ===
              y?.split("-").join("")?.split(".")[0].toLowerCase()
          ),
          keyword: x?.text,
          keywordMetrics: x?.keywordMetrics || {
            avgMonthlySearches: 0,
            competition: "LOW",
            competitionIndex: "0",
          },
          closeVariants: x?.closeVariants || [],
        }));
        return res.status(200).json(data);
    }
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
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
