import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import MyLayout from "../Components/Layout";
import "../styles/globals.css";

function MyApp({ pageProps }) {
  return (
    <HeroUIProvider>
      <ToastProvider toastProps={{ variant: "solid" }} />
      {/* <Component {...pageProps} /> */}
      <MyLayout {...pageProps} />
    </HeroUIProvider>
  );
}

export default MyApp;
