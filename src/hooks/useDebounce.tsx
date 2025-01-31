import { useRef } from "react";

export default function useDebounce(callback: Function, delay: number = 300) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
