import { useEffect } from "react";

const KeypressHook = (callback: () => void, targetKey: string) => {
  useEffect(() => {
    const keyPressHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        callback();
      }
    };
    window.addEventListener("keydown", keyPressHandler);
    return () => {
      window.removeEventListener("keydown", keyPressHandler);
    };
  }, [callback, targetKey]);
};

export default KeypressHook;
