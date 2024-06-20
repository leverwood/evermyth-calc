import { Button, Form } from "react-bootstrap";
import { useShopContext } from "../contexts/ShopContext";
import { ShopCategory } from "../types/shop-types";
import { useCallback } from "react";

function ShopCategoryCheckboxes({
  checkedCategories,
  setChecked,
}: {
  checkedCategories: ShopCategory["slug"][];
  setChecked: React.Dispatch<React.SetStateAction<ShopCategory["slug"][]>>;
}) {
  const { shopCategories } = useShopContext();

  const handleClear = useCallback(() => {
    setChecked([]);
  }, [setChecked]);

  return (
    <Form>
      <p className="mb-2">
        <strong>Shop Category</strong>
        <Button
          size="sm"
          variant="light"
          onClick={handleClear}
          style={{ float: "right" }}
        >
          Clear
        </Button>
      </p>
      {shopCategories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => (
          <Form.Check
            key={category.slug}
            type="checkbox"
            label={category.name}
            checked={checkedCategories.includes(category.slug)}
            onChange={(e) => {
              if (e.target.checked) {
                setChecked([...checkedCategories, category.slug]);
              } else {
                setChecked(
                  checkedCategories.filter((c) => c !== category.slug)
                );
              }
            }}
          />
        ))}
    </Form>
  );
}

export default ShopCategoryCheckboxes;
