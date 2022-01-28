const db = require("../../data/dbConfig");

function findBy(filter) {
  return db("users").where(filter);
}

function findById(id) {
  return db("users").where('id',id).first();
}

async function add(data) {
    const [newUser] = await db('users').insert(data)
    return findById(newUser)
}

module.exports = {
  findBy,
  findById,
  add,
};
