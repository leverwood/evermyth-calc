import React from "react";
import { Service } from "../types/service-types";
import styles from "./ViewService.module.scss";

interface ServiceItemProps {
  service: Service;
}

const ViewService: React.FC<ServiceItemProps> = ({ service }) => {
  return (
    <span>
      <strong>{service.name}</strong>.{" "}
      <span className={`${styles.price} me-2`}>
        &nbsp;{service.price} cp&nbsp;
      </span>{" "}
      {service.description}
    </span>
  );
};

export default ViewService;
