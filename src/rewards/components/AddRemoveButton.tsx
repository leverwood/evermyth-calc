import { Button } from "react-bootstrap";

export default function AddRemoveButton({
  adding = true,
  ...props
}: { adding?: boolean } & React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="sm"
      className={`me-2`}
      variant={`${adding ? "secondary" : "outline-danger"}`}
      {...props}
    >
      {adding ? "+" : "x"}
    </Button>
  );
}
