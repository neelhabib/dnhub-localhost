import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
  Textarea,
} from "@heroui/react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
export default function HomePage() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [devToken, setDevToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleSave = (e) => {
    setLoading(true);
    axios
      .post("/api/apis/google", {
        clientId,
        clientSecret,
        customerId,
        devToken,
      })
      .then((res) => {
        setLoading(false);
        addToast({
          title: "Success",
          description: res.data?.message,
          color: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        addToast({
          title: "Error",
          description: err?.response?.data?.message || "Some Error Occurred",
          color: "danger",
        });
      });
  };

  // this is to get the ads settings from the server
  useEffect(() => {
    axios.get("/api/apis/google").then((res) => {
      if (res.data) {
        setClientSecret(res.data?.clientSecret);
        setClientId(res.data?.clientId);
        setCustomerId(res.data?.customerId);
        setDevToken(res.data?.devToken);
        setAccessToken(res.data?.accessToken);
        setRefreshToken(res.data?.refreshToken);
      }
    });
  }, []);

  const generateAccToken = () => {
    setLoading2(true);
    axios
      .post("/api/apis/google/generate-acc-token")
      .then((res) => {
        addToast({
          title: "Success",
          description: res.data?.message,
          color: "success",
        });

        setLoading2(false);
      })
      .catch((err) => {
        console.log(err);
        addToast({
          title: "Error",
          description: err?.response?.data?.message || "Some Error Occurred",
          color: "danger",
        });

        setLoading2(false);
      });
  };
  return (
    <Card className="m-2">
      <CardHeader>
        <p>Google Ads API</p>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <Input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              type="text"
              label="Google Ads Client ID"
              placeholder="6007190274237-415qadu2ib5o0jls9gtnd7b2qofsncbe.apps.googleusercontent.com"
            />

            <Input
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              type="text"
              label="Google Ads Client Secret"
              placeholder="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"
            />

            <Input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              type="text"
              label="Google AdsCustomer ID"
              placeholder="9665271493"
            />

            <Input
              value={devToken}
              onChange={(e) => setDevToken(e.target.value)}
              type="text"
              label="Google Ads Developer Token"
              placeholder="Wvmer7gPaI2ZZaSuidrdevt"
            />
            <div className="flex gap-3 items-center">
              <Button
                // isDisabled
                size="md"
                color="secondary"
                variant="shadow"
                isLoading={loading}
                onPress={handleSave}
              >
                Save
              </Button>
              <Button
                startContent={
                  <svg
                    className="w-4 h-auto"
                    width={46}
                    height={47}
                    viewBox="0 0 46 47"
                    fill="none"
                  >
                    <path
                      d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z"
                      fill="#34A853"
                    />
                    <path
                      d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z"
                      fill="#EB4335"
                    />
                  </svg>
                }
                onPress={() => signIn("google", { callbackUrl: "/google-api" })}
                type="button"
                className="py-3 text-sm font-medium border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                Connect with Google
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Textarea
              isDisabled
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              type="text"
              label="Access Token"
              placeholder="ya29.a0AW4XtxjBXySKvl2puz49SjqGSOp . . ."
            />

            <Textarea
              isDisabled
              value={refreshToken}
              onChange={(e) => setRefreshToken(e.target.value)}
              type="text"
              label="Refresh Token"
              placeholder="1//0gI_WimgvWihyCgYIAR3AGBASNgF- . . ."
            />
            <div className="">
              <Button
                // isDisabled
                size="md"
                color="success"
                variant="shadow"
                isLoading={loading2}
                onPress={generateAccToken}
              >
                Re Generate Access Token
              </Button>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
