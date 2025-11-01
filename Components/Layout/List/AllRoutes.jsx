import { useRouter } from "next/router";

import DynadotApi from "Components/Dynadot";
import HomePage from "Components/HomePage";
import GodaddyApi from "Components/Godaddy";
import NameCheapApi from "Components/NameCheap";
import NameSiloApi from "Components/NameSilo";

export default function AllRoutes() {
  const router = useRouter();
  const route = router.query?.route;

  return (
    <>
      {router?.route === "/" ? (
        <HomePage />
      ) : route === "dynadot-api" ? (
        <DynadotApi />
      ) : route === "godaddy-api" ? (
        <GodaddyApi />
      ) : route === "namecheap-api" ? (
        <NameCheapApi />
      ) : route === "namesilo-api" ? (
        <NameSiloApi />
      ) : (
        ""
      )}
    </>
  );
}
