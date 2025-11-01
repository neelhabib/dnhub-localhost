import soap from "soap";

const sedoUrl = "https://api.sedo.com/api/v1/?wsdl";

export default async function sedo(domain) {
  const args = {
    partnerid: "327338",
    signkey: "f1200c40a7d8c36941d7e262fb6c07",
    username: "neelhabib",
    password: "Chissa@123",
    domainentry: [
      [
        {
          domain: domain.domain,
          category: [1],
          forsale: 1,
          price: domain?.price,
          minprice: domain?.minOffer,
          fixedprice: 1,
          currency: 1,
          domainlanguage: "en",
        },
      ],
    ],
  };

  try {
    // Promisify the soap.createClient call
    const client = await new Promise((resolve, reject) => {
      soap.createClient(sedoUrl, function (err, client) {
        if (err) {
          return reject(err);
        }
        resolve(client);
      });
    });

    // Promisify the DomainInsert call
    const result = await new Promise((resolve, reject) => {
      client.DomainInsert(
        {
          args,
        },
        function (err, result) {
          if (err) {
            return reject(err);
          }
          resolve(result?.return?.item);
        },
      );
    });

    return result;
  } catch (error) {
    console.log("Error:", error);
    // throw error; // Re-throw the error if you want to handle it where the function is called
  }
}
