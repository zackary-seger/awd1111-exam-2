import Debug from 'debug';
const debug = Debug('app:database');
import { MongoClient, ObjectId, Db } from 'mongodb';
import config from 'config';

const newId = (str) => new ObjectId(str);

let _db = null;

/**
 * Connect to the database
 * @returns Promise<Db>
 */

async function connect() {
  if (!_db) {
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const client = await MongoClient.connect(dbUrl);
    _db = client.db(dbName);
    debug('Connected to database');
  }
  return _db;
}

async function ping() {
  const db = await connect();
  await db.command({
    ping: 1,
  });
  debug('Ping successful');
}

async function findAllProducts() {
  const db = await connect();
  const products = await db.collection('Products').find({}).toArray();
  return products;
}

async function findProductById(productId) {
  const db = await connect();
  const product = await db.collection('Products').findOne({ _id: { $eq: productId } });
  return product;
}


async function findProductByProductName(name) {
  const db = await connect();
  const product = await db.collection('Products').findOne({ name:{ $eq: name } });
  if (name) {
    return product;
  }
}

async function insertOneProduct(product) {
  const db = await connect();
  await db.collection('Products').insertOne({
    ...product,
    createdDate: new Date(),
  });
}

async function updateOneProduct(productId, updatedProduct) {
  const db = await connect();
  await db.collection('Products').updateOne(
    { _id: { $eq: productId } },
    {
      $set: {
        ...updatedProduct,
        lastUpdated: new Date(),
      },
    }
  );
}

async function deleteOneProduct(productId) {
    const db = await connect();
    await db.collection('Products').deleteOne({ _id: { $eq: productId } });
}

ping();

export { newId, connect, ping, findAllProducts, findProductById, findProductByProductName,
         insertOneProduct, updateOneProduct, deleteOneProduct  };
