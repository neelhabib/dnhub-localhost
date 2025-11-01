import soap from "soap";
const sedoUrl = "https://api.sedo.com/api/v1/?wsdl";

export default async function PricingEdit(req, res) {
  const { value, original } = req.body;
  console.log(value, original);
  const args = {
    partnerid: "327338",
    signkey: "f1200c40a7d8c36941d7e262fb6c07",
    username: "neelhabib",
    password: "Chissa@123",
    domainentry: [
      [
        {
          domain: original?.domain,
          category: [1],
          forsale: original?.forSale,
          price: value,
          minprice: original?.minPrice,
          fixedprice: 1,
          currency: 1,
          domainlanguage: "en",
        },
      ],
    ],
  };
  try {
    soap.createClient(sedoUrl, function (err, clients) {
      clients?.DomainEdit(
        { args },
        async function (err, result) {
          err && console.log(err);
          const sedoDomains = result?.return?.item;
          res.json(sedoDomains);
        },
      );
    });
  } catch (error) {
    console.log(error);
  }
}
