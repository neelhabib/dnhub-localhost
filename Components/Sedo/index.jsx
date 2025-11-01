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

export default function SedoApi() {
  const [signKey, setSignKey] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const token = JSON.parse(localStorage.getItem("lg_tk"));

  // this function will send the ads settings to the server
  const handleSave = (e) => {
    setLoading(true);
    axios
      .post("/api/apis/sedo", {
        signKey,
        partnerId,
        userName,
        password,
      })
      .then((res) => {
        setLoading(false);
        toast(res.data?.message, { position: "bottom-right" });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error("Some Error Occurred", {
          position: "bottom-right",
        });
      });
  };

  // this is to get the ads settings from the server
  useEffect(() => {
    axios.get("/api/apis/sedo").then((res) => {
      if (res.data) {
        setSignKey(res.data?.signKey);
        setPartnerId(res.data?.partnerId);
        setUserName(res.data?.userName);
        setPassword(res.data?.password);
      }
    });
  }, []);

  return (
    <div>
      <Toaster />
      <h4 className="text-xl font-semibold text-violet-700 mb-2">
        Sedo API
      </h4>

      <Divider />
      <Spacer y={2} />
      <Chip variant="flat" radius="sm" color={"secondary"}>
        If you are not obtaining Sedo API, premium domains and
        Domain Price Monitoring will not work. Please refer to
        the documentation on how to get Sedo API for free.
      </Chip>
      <div>
        <Spacer y={2} />
        <Input
          value={signKey}
          onChange={(e) => setSignKey(e.target.value)}
          type="text"
          label="API Sign Key"
          placeholder="q1333c40a7d8c36941sd4262fb63rt"
        />
        <Spacer y={2} />
        <Input
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          type="text"
          label="Partner ID | CampaignID"
          placeholder="321234"
        />
        <Spacer y={2} />
        <Input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          label="Sedo Account User Name"
          placeholder="johndohe"
        />
        <Spacer y={2} />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="text"
          label="Sedo Account Password"
          placeholder="321234"
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
      {/* </CardBody> */}
    </div>
  );
}
