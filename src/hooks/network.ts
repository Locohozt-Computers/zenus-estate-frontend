import { useState, useEffect } from "react";

function getNetworkConnection() {
  return (
    // @ts-ignore
    navigator.connection ||
    (navigator as any)?.mozConnection ||
    (navigator as any)?.webkitConnection ||
    null
  );
}
function getNetworkConnectionInfo() {
  const connection = getNetworkConnection();
  if (!connection) {
    return {};
  }
  return {
    rtt: connection.rtt,
    type: connection.type,
    saveData: connection.saveData,
    downLink: connection.downLink,
    downLinkMax: connection.downLinkMax,
    effectiveType: connection.effectiveType,
  };
}

export const useNetwork = () => {
  const [state, setState] = useState<any>({
    since: undefined,
    online: navigator.onLine,
    ...getNetworkConnectionInfo(),
  });

  useEffect(() => {
    const handleOnline = () => {
      setState((prev: any) => ({
        ...prev,
        online: true,
        since: new Date().toString(),
      }));
    };
    const handleOffline = () => {
      setState((prev: any) => ({
        ...prev,
        online: false,
        since: new Date().toString(),
      }));
    };
    const handleConnectionChange = () => {
      setState((prev: any) => ({ ...prev, ...getNetworkConnectionInfo() }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    const connection = getNetworkConnection();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    connection?.addEventListener("change", handleConnectionChange);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      connection?.removeEventListener("change", handleConnectionChange);
    };
  }, []);
  return state;
};
