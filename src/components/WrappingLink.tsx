import { Link, LinkProps } from "react-router-dom";

import styles from "./WrappingLink.module.scss";

function WrappingLink({ to, className, ...props }: LinkProps) {
  return <Link className={`${styles.root} ${className}`} to={to} {...props} />;
}

export default WrappingLink;
