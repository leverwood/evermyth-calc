export interface Shop {
  id: string;
  name: string;
  image: string;
  proprietor: string;
  proprietorImage: string;
  description: string;
  discount: number;
  forSale: {
    id: string;
    type: "reward" | "service";
  }[];
}

export interface ShopCategory {
  slug: string;
  name: string;
}
