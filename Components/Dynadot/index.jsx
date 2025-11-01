import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Spacer,
} from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function DynadotApi() {
  const [api, setApi] = useState("");
  // const [partnerId, setPartnerId] = useState("");
  const [loading, setLoading] = useState(false);
  // const token = JSON.parse(localStorage.getItem("lg_tk"));

  // this function will send the ads settings to the server
  const handleSave = (e) => {
    setLoading(true);
    axios
      .post("/api/apis/dynadot", {
        api,
      })
      .then((res) => {
        setLoading(false);
        addToast({
          title: "Success",
          description: res?.data?.message,
          color: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        addToast({
          title: "Error",
          description: err?.response?.data?.message,
          color: "danger",
        });
      });
  };

  // this is to get the ads settings from the server
  useEffect(() => {
    axios.get("/api/apis/dynadot").then((res) => {
      if (res.data) {
        setApi(res.data?.api);
        // setPartnerId(res.data?.partnerId);
      }
    });
  }, []);

  return (
    <Card className="m-2">
      <CardHeader className="text-xl font-semibold text-violet-700 mb-2">
        Dynadot API Settings
      </CardHeader>

      <Divider />
      <Spacer y={2} />
      <CardBody>
        <div className="sm:w-[50%]">
          <Input
            value={api}
            onChange={(e) => setApi(e.target.value)}
            type="text"
            label="Dynadot API Key"
            placeholder="9F8y639W7M6P832chFy8sLy6y7f7CE9G8AY9kj8"
          />

          <Spacer y={4} />
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
        </div>
      </CardBody>
    </Card>
  );
}
