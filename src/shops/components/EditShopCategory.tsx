import { Button, Container, Form } from "react-bootstrap";
import { ShopProvider, useShopContext } from "../contexts/ShopContext";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import Layout from "../../Layout";

function EditShopCategoryPage() {
  const { slug } = useParams<{ slug?: string }>();

  return (
    <Layout>
      <ShopProvider>
        <EditShopCategory slug={slug} />
      </ShopProvider>
    </Layout>
  );
}

function EditShopCategory({ slug }: { slug?: string }) {
  const {
    getShopCategoryBySlug,
    addShopCategory,
    updateShopCategory,
    deleteShopCategory,
  } = useShopContext();
  const navigate = useNavigate();
  const [nameValue, setNameValue] = useState<string>(
    slug ? getShopCategoryBySlug(slug)?.name || "" : ""
  );

  const handleAddCategory = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      // we are already on a page with a slug, exit
      if (slug) {
        return;
      }
      const newSlug = nameValue.toLocaleLowerCase().replace(" ", "-");
      addShopCategory({
        slug: newSlug,
        name: nameValue,
      });
      navigate(`/shop-categories/${newSlug}/edit`);
    },
    [addShopCategory, nameValue, navigate, slug]
  );

  const handleChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNameValue(e.target.value);
      if (slug) {
        updateShopCategory({
          slug: slug,
          name: e.target.value,
        });
      }
    },
    [slug, updateShopCategory]
  );

  const handleDeleteCategory = useCallback(() => {
    if (slug) {
      deleteShopCategory(slug);
      navigate(`/shop`);
    }
  }, [deleteShopCategory, navigate, slug]);

  const handleAddAnother = useCallback(() => {
    setNameValue("");
    navigate("/shop-categories/add");
  }, [navigate]);

  return (
    <Container>
      <h1>{slug ? `Edit Shop Category: ${nameValue}` : "Add Shop Category"}</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={nameValue}
            onChange={handleChangeName}
          />
        </Form.Group>
        {!slug ? (
          <Button type="submit" onClick={handleAddCategory}>
            Add Shop Category
          </Button>
        ) : (
          <>
            <Button variant="danger" onClick={handleDeleteCategory}>
              {" "}
              Delete
            </Button>
            <Button variant="primary" onClick={handleAddAnother}>
              Add Another
            </Button>
          </>
        )}
      </Form>
    </Container>
  );
}

export default EditShopCategoryPage;
