import axios from "axios";
import WordsNinjaPack from "utils/wordsNinja";
import { connectToMongoDB } from "db.js";

export default async function bulkDomainVolume(req, res) {
  const { db } = await connectToMongoDB();
  const api = await db.collection("google-api").findOne();
  const apiUrl = `https://googleads.googleapis.com/v21/customers/${api?.customerId}:generateKeywordHistoricalMetrics`;

  const domains = req?.body?.domains;

  const allWords = [];
  const WordsNinja = new WordsNinjaPack();
  try {
    switch (req.method) {
      case "POST":
        await WordsNinja.loadDictionary();
        for (const x of domains || []) {
          const words = WordsNinja.splitSentence(x?.split(".")[0], {
            joinWords: true,
            capitalizeFirstLetter: true,
          });
          allWords.push(words);
        }

        const response = await axios.post(
          apiUrl,
          {
            keywords: allWords,
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
