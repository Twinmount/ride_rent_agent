import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import React, { Suspense } from "react";
import LazyLoader from "../loading-skelton/LazyLoader";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSmallScreen = useIsSmallScreen(1100);

  return (
    <main
      style={{
        marginTop: "4.84rem",
        marginLeft: isSmallScreen ? "" : "14rem",
        padding: "0.2rem",
      }}
      className="h-full bg-gray_bg"
    >
      <Suspense fallback={<LazyLoader />}>{children}</Suspense>
    </main>
  );
}
