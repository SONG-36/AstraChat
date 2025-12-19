export function createContext({ rawMessage }) {
  return {
    rawMessage,
    text: "",
    normalized: "",
    route: "",
    logs: [],
    output: "",
  };
}
