import { Button } from "react-bootstrap";

import styles from "./AddRemoveButton.module.scss";

export default function AddRemoveButton({
  adding = true,
  overrideText = "",
  ...props
}: { adding?: boolean; overrideText?: string } & React.ComponentProps<
  typeof Button
>) {
  return (
    <Button
      size="sm"
      className={`me-2 ${styles.root}`}
      variant={`${adding ? "outline-primary" : "outline-danger"}`}
      {...props}
    >
      {overrideText ? overrideText : adding ? "➕" : "❌"}
    </Button>
  );
}
