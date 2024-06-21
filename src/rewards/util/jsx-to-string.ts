import ReactDOMServer from "react-dom/server";

export function jsxToString(element: JSX.Element) {
  return ReactDOMServer.renderToString(element);
}
