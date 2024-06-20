import { Button, Form } from "react-bootstrap";
import { useShopContext } from "../contexts/ShopContext";
import { ShopCategory } from "../types/shop-types";
import { useCallback } from "react";

function FilterByShopCategories({
  filteredCategories,
  setFilteredCategories,
}: {
  filteredCategories: ShopCategory[];
  setFilteredCategories: React.Dispatch<React.SetStateAction<ShopCategory[]>>;
}) {
  const { shopCategories } = useShopContext();

  const handleClear = useCallback(() => {
    setFilteredCategories([]);
  }, [setFilteredCategories]);

  return (
    <Form>
      <p>
        <strong>Filter by Category</strong>
        <Button size="sm" onClick={handleClear}>
          Clear
        </Button>
      </p>
      {shopCategories.map((category) => (
        <Form.Check
          key={category.slug}
          type="checkbox"
          label={category.name}
          checked={filteredCategories.includes(category)}
          onChange={(e) => {
            if (e.target.checked) {
              setFilteredCategories([...filteredCategories, category]);
            } else {
              setFilteredCategories(
                filteredCategories.filter((c) => c !== category)
              );
            }
          }}
        />
      ))}
    </Form>
  );
}

export default FilterByShopCategories;
