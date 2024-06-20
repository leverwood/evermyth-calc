import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Service } from "../types/service-types";

interface ServiceContextProps {
  services: Service[];
  addService: (service: Omit<Service, "id">) => string;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  getServiceById: (id: string) => Service | undefined;
}

const ServiceContext = createContext<ServiceContextProps | undefined>(
  undefined
);

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};

const SERVICES_STORAGE_KEY = "services";
const SERVICES_BACKUP_KEY = "services_backup";

export const ServiceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [services, setServices] = useState<Service[]>(() => {
    const storedServices = localStorage.getItem(SERVICES_STORAGE_KEY);
    return storedServices ? JSON.parse(storedServices) : [];
  });

  const handleWindowUnload = useCallback(() => {
    localStorage.setItem(
      SERVICES_BACKUP_KEY + new Date().toISOString(),
      JSON.stringify(services)
    );
  }, [services]);

  useEffect(() => {
    localStorage.setItem(SERVICES_STORAGE_KEY, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowUnload);
    return () => {
      window.removeEventListener("beforeunload", handleWindowUnload);
    };
  }, [handleWindowUnload, services]);

  const addService = (service: Omit<Service, "id">): string => {
    const id = crypto.randomUUID();
    const newService: Service = { ...service, id };
    setServices((prevServices) => [...prevServices, newService]);
    return id;
  };

  const updateService = (updatedService: Service) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices((prevServices) =>
      prevServices.filter((service) => service.id !== id)
    );
  };

  const getServiceById = (id: string) => {
    return services.find((service) => service.id === id);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        getServiceById,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
