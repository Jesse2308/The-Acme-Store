const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_store2_db');

const uuid = require('uuid');
const bcrypt = require('bcrypt');

const createTable = async () => {
    const SQL = `
    DROP TABLE IF EXISTS user_favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) Not Null UNIQUE,
        password VARCHAR(100) Not Null UNIQUE
    );

    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(100) Not Null UNIQUE
    );

    CREATE TABLE user_favorites(
        id UUID PRIMARY KEY,
        "userId" UUID REFERENCES users(id),
        "productId" UUID REFERENCES products(id)
    );
    `;
    await client.query(SQL);
};

const createUser = async ({ username, password }) => {
    const SQL = 'INSERT INTO users(id, username, password) values($1, $2, $3) returning *';
    const response = await client.query(SQL, [uuid.v4(), username,await bcrypt.hash(password, 10)]);
    return response.rows[0];
}

const createProduct = async ({ name }) => {
    const SQL = 'INSERT INTO products(id, name) values($1, $2) returning *';
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
}

const fetchUsers = async () => {
    const SQL = 'SELECT * FROM users';
    const response = await client.query(SQL);
    return response.rows;
}

const fetchProducts = async () => {
    const SQL = 'SELECT * FROM products';
    const response = await client.query(SQL);
    return response.rows;
}

const createUserFavorite = async ({ userId, productId }) => {
    const SQL = 'INSERT INTO user_favorites(id, "userId", "productId") values($1, $2, $3) returning *';
    const response = await client.query(SQL, [uuid.v4(), userId, productId]);
    return response.rows[0];
}

const fetchUserFavorites = async (userId) => {
    const SQL = 'SELECT * FROM user_favorites WHERE "userId" = $1';
    const response = await client.query(SQL, [userId]);
    return response.rows;
}

const deleteUserFavorite = async (id) => {
    const SQL = 'DELETE FROM user_favorites WHERE id = $1';
    await client.query(SQL, [id]);
}

module.exports = {
    client,
    createTable,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    createUserFavorite,
    fetchUserFavorites,
    deleteUserFavorite,
    createUser
};
