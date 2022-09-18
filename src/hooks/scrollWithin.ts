import { useCallback, useRef } from "react";

export const useScrollWithin = (callback: () => void, deps: any[] = []) => {
  const observer = useRef<IntersectionObserver>(null);

  const ref = useCallback(
    (node: any) => {
      if (observer.current) observer.current.disconnect();
      // @ts-ignore
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      });
      if (node) observer.current.observe(node as Element);
    },
    // eslint-disable-next-line
    [callback, ...deps]
  );

  return { ref };
};
