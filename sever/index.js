const {
  client,
  createTable,
  createProduct,
  createUser,
  fetchUsers,
  fetchProducts,
  createUserFavorite,
  fetchUserFavorites,
  deleteUserFavorite,
} = require("./db");


const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/favorites", async (req, res, next) => {
  try {
    res.send(await fetchUserFavorites());
  } catch (ex) {
    next(ex);
  }
});
app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchUserFavorites(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.status(201);
    res.send(
      await createUserFavorite({
        user_id: req.params.id,
        productId: req.body.productId,
      })
    );
  } catch (ex) {
    next(ex);
  }
});
app.delete("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(
      await deleteUserFavorite({
        user_id: req.params.id,
        productId: req.body.productId,
      })
    );
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await client.connect();
  await createTable();
  console.log("Connected to database");
  console.log("Creating tables");

  const [jesse, sana, madde, pc, phone, tv] = await Promise.all([
    createUser({ name: "Jesse", password: "jesse_pw" }),
    createUser({ name: "Sana", password: "sana_pw" }),
    createUser({ name: "Madde", password: "madde_pw" }),
    createProduct({ name: "PC" }),
    createProduct({ name: "Phone" }),
    createProduct({ name: "TV" }),
  ]);
  console.log(await fetchUsers());
  console.log(await fetchProducts());

  const userFav = await Promise.all([
    createUserFavorite({ user_id: jesse.id, productId: pc.id }),
    createUserFavorite({ user_id: sana.id, productId: phone.id }),
    createUserFavorite({ user_id: madde.id, productId: tv.id }),
  ]);
  console.log(await fetchUserFavorites(jesse.id));
  console.log(await fetchUserFavorites(sana.id));
  await deleteUserFavorite({ user_id: jesse.id, productId: pc.id });

  const PORT = 3000;
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
};

init();
