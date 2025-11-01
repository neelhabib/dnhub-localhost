import {
  Button,
  Chip,
  Divider,
  Input,
  Spacer,
} from "@heroui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function OpenAi() {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");

  const [loading, setLoading] = useState(false);
  // const token = JSON.parse(localStorage.getItem("lg_tk"));

  // this function will send the ads settings to the server
  const handleSave = (e) => {
    setLoading(true);
    axios
      .post("/api/apis/open-ai", {
        apiKey,
        model,
      })
      .then((res) => {
        setLoading(false);
        toast(res.data?.message, { position: "bottom-right" });
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Some Error Occurred", {
          position: "bottom-right",
        });
      });
  };

  // this is to get the ads settings from the server
  useEffect(() => {
    axios.get("/api/apis/open-ai").then((res) => {
      if (res.data) {
        setApiKey(res.data?.apiKey);
        setModel(res.data?.model);
      }
    });
  }, []);

  return (
    <div>
      <Toaster />

      <h4 className="text-xl font-semibold text-violet-700 mb-2">
        Open Ai API Settings
      </h4>

      <Divider />

      <Spacer y="4" />
      {/* <Chip variant="flat" radius="sm" color={"secondary"}>
        If you disable, Our inbuilt AI Generator tool will be used. Please refer
        to the documentation on how to get Open Ai API.
      </Chip> */}
      <div className="sm:w-[50%]">
        <Spacer y={2} />
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          type="text"
          label="API Key"
          placeholder="q1333c40a7d8c36941sd4262fb63rt"
        />
        <Spacer y={2} />
        <Input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          type="text"
          label="API Model"
          placeholder="gpt-4o"
        />
        <Spacer y={2} />

        <p className="text-xs text-secondary">
          Please type the model name currectly. We recommend to
          use <span className="font-bold">gpt-4o-mini</span>{" "}
          model. Its cost efficient and sufficient for domain
          name generator. But you can use any model.
        </p>
        <Spacer y={4} />
        <Button
          size="md"
          color="secondary"
          variant="shadow"
          isLoading={loading}
          onPress={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
