const axios = require("axios");
const WhoisLight = require("../../lib");
const { parse } = require("tldts");

const placeholderPatterns = [
  "This Domain is For Sale",
  "Make an Offer",
  "Contact Us to Buy",
  "Purchase This Domain",
  "Inquire About This Domain",
  "Acquire This Domain",
  "Buy This Domain Now",
  "Domain Available for Purchase",
  "Submit Your Offer",
  "Bid on This Domain",
  "Domain Auction",
  "Contact for Pricing",
  "Available for Sale",
  "Own This Domain",
  "Take Ownership",
  "Get This Domain",
  "Request a Quote",
  "Interested in Buying?",
  "Secure This Domain",
  "Reach Out to Purchase",
  "domain for sale",
  "available for purchase",
  "buy this domain",
  "make an offer",
  "is available to purchase",
  "this domain name is currently for sale",
  "this domain is for sale",
  "this domain name is for sale",
  "is for sale",
  "This Auction is public", // dropcatch
  "dropcatch.com", //dropcatch
  "dropcatch", //dropcatch
  "bdstatic.com", //parking
  "zhanzhang.baidu.com", //parking
  "push.zhanzhang", //parking
  "premium domain",
  "buy domain",
  "This Page Is Under Construction",
  "under Construction",
  "sedoparking.com", // sedo parking
  'window.location.href="/lander"', // afternic redirect
  "html data-adblockkey=", // parking sites network solitions
  "register.com",
  "nginx",
];
function getRootDomain(url) {
  return parse(url).domain || "";
}

async function DevelopedSiteChecker(socket, domain) {
  const whois = await WhoisLight.lookup(
    { format: true },
    domain,
  ).then((res) => {
    if (
      domain.toLowerCase().includes(".uk") ||
      domain.toLowerCase()?.includes(".co.uk")
    ) {
      const raw = res._raw
        .split("\r\n")
        .map((x) => x.split("\n"))
        .join(":")
        .split(":")
        .map((x) => x.trim())
        .filter((x) => x);
      const chunkSize = 2;
      let obj = {};
      let arr = [];
      for (let i = 0; i < raw.length; i += chunkSize) {
        const chunk = raw.slice(i, i + chunkSize);
        arr.push(chunk);
      }
      arr.map((x) => (obj[x[0]] = x[1]));
      return obj;
    } else {
      return res;
    }
  });

  try {
    const response = await axios.get(`https://${domain}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        Referer: `https://${domain}/`,
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
      },
      maxRedirects: 10,
      timeout: 12000,
      validateStatus: null,
      decompress: true,
    });
    const finalUrl =
      response?.request?.res?.responseUrl ||
      `https://${domain}`;
    const originalDomainRoot = getRootDomain(domain);
    const redirectedDomainRoot = getRootDomain(finalUrl);

    const isExternalRedirect =
      redirectedDomainRoot &&
      originalDomainRoot &&
      redirectedDomainRoot !== originalDomainRoot;

    if (response.status >= 200 && response.status < 400) {
      const content = response.data?.toLowerCase();

      const isPlaceHolder = placeholderPatterns.some((x) =>
        content.includes(x?.toLowerCase()),
      );
      if (isExternalRedirect || isPlaceHolder) {
        // Domain Not Developed
        socket.emit("developed-site-checker", {
          domain,
          age:
            whois?.["Creation Date"]?.slice(0, 10) ||
            whois?.["Registered on"],
          registrar: whois?.Registrar || "-",
          registeredOn:
            whois?.["Creation Date"]?.slice(0, 10) ||
            whois?.["Registered on"] ||
            "-",
          expiry:
            whois?.["Registry Expiry Date"]?.slice(0, 10) ||
            whois?.["Expiry date"] ||
            "-",
          isDeveloped: false,
          status: response?.status,
          statusText: response?.statusText,
          response: response?.data,
          redirected: isExternalRedirect,
          redirectedTo: isExternalRedirect
            ? redirectedDomainRoot
            : "",
        });
      } else {
        // Domain Developed
        socket.emit("developed-site-checker", {
          domain,
          age:
            whois?.["Creation Date"]?.slice(0, 10) ||
            whois?.["Registered on"],
          registrar: whois?.Registrar || "-",
          registeredOn:
            whois?.["Creation Date"]?.slice(0, 10) ||
            whois?.["Registered on"] ||
            "-",
          expiry:
            whois?.["Registry Expiry Date"]?.slice(0, 10) ||
            whois?.["Expiry date"] ||
            "-",
          isDeveloped: true,
          status: response?.status,
          statusText: response?.statusText,
          response: response?.data,
          redirected: isExternalRedirect,
          redirectedTo: isExternalRedirect
            ? redirectedDomainRoot
            : "",
        });
      }
    } else {
      // Domain Not Developed
      socket.emit("developed-site-checker", {
        domain,
        age:
          whois?.["Creation Date"]?.slice(0, 10) ||
          whois?.["Registered on"],
        registrar: whois?.Registrar || "-",
        registeredOn:
          whois?.["Creation Date"]?.slice(0, 10) ||
          whois?.["Registered on"] ||
          "-",
        expiry:
          whois?.["Registry Expiry Date"]?.slice(0, 10) ||
          whois?.["Expiry date"] ||
          "-",
        isDeveloped: false,
        status: response?.status || err?.code,
        statusText: response?.statusText || "Domain Error",
        response: response?.data,
        redirected: isExternalRedirect,
        redirectedTo: isExternalRedirect
          ? redirectedDomainRoot
          : "",
      });
    }
  } catch (err) {
    console.log(err);
    // Domain Error or not Found
    socket.emit("developed-site-checker", {
      domain,
      age:
        whois?.["Creation Date"]?.slice(0, 10) ||
        whois?.["Registered on"],
      registrar: whois?.Registrar || "-",
      registeredOn:
        whois?.["Creation Date"]?.slice(0, 10) ||
        whois?.["Registered on"] ||
        "-",
      expiry:
        whois?.["Registry Expiry Date"]?.slice(0, 10) ||
        whois?.["Expiry date"] ||
        "-",
      isDeveloped: false,
      status: err?.response?.status || err?.code,
      statusText:
        err?.response?.statusText || "Domain Not Found",
      // response: response?.data,
    });
  }
}

module.exports = DevelopedSiteChecker;
