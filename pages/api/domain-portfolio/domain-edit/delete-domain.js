import soap from "soap";
const sedoUrl = "https://api.sedo.com/api/v1/?wsdl";

export default async function DeleteDomain(req, res) {
  const domains = req.body;

  const args = {
    partnerid: "327338",
    signkey: "f1200c40a7d8c36941d7e262fb6c07",
    username: "neelhabib",
    password: "Chissa@123",
    domains: [domains],
  };
  try {
    soap.createClient(sedoUrl, function (err, clients) {
      clients?.DomainDelete(
        { args },
        async function (err, result) {
          err && console.log(err);
          const sedoDomains = result?.return?.item;
          res.json(sedoDomains);
          // console.log(result);
        },
      );
    });
  } catch (error) {
    console.log(error);
  }
}
