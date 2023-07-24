import { useEffect } from "react";

interface Props {
  callback: () => null;
  targetKey: string;
}

const keypressHook = ({ callback, targetKey }: Props) => {
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

export default keypressHook;
