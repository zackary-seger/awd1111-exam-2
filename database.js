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

async function findAllUsers() {
  //throw new Error('Test Error');
  const db = await connect();
  const users = await db.collection('Users').find({}).toArray();
  return users;
}

async function findUserById(userId) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ _id: { $eq: userId } });
  return user;
}

async function findUserByEmail(email) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ email:{ $eq: email } });
  if (user) {
    return true;
  } else {
    return false;
  }
}

async function readUserByEmail(email) {
  const db = await connect();
  const user = await db.collection('Users').findOne({ email:{ $eq: email } });
  if (user) {
    return user;
  } else {
    return false;
  }
}

async function insertOneUser(user) {
  const db = await connect();
  await db.collection('Users').insertOne({
    ...user,
  });
}

async function updateOneUser(userId, update) {
  const db = await connect();
  await db.collection('Users').updateOne(
    { _id: { $eq: userId } },
    {
      $set: {
        ...update,
        lastUpdated: new Date(),
      },
    }
  );
}

async function deleteOneUser(userId) {
    const db = await connect();
    await db.collection('Users').deleteOne({ _id: { $eq: userId } });
}

// sortBy() Function:
// COMPLETE: NEEDS TESTING..

let results = [];

async function sortBy(specifier) {

  try {
    
    const db = await connect();

    if (specifier == 'firstName') {

      results[0] = `Sort By: ${specifier} ascending..`;
      results[1] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray() };
      results[2] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray() };
      results[3] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray() };

      return results;

    } else if (specifier == 'lastName') {

      results[0] = `Sort By: ${specifier} ascending..`;
      results[1] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray()};
      results[2] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray()};
      results[3] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};

      return results;
      
    } else if (specifier == 'role') {

      results[0] = `Sort By: ${specifier} ascending..`;
      results[1] = { roleSort: await db.collection('Users').find().sort({ role: 1}).toArray()};
      results[2] = { firstNameSort: await db.collection('Users').find().sort({ firstName: 1}).toArray()};
      results[3] = { lastNameSort: await db.collection('Users').find().sort({ lastName: 1}).toArray()};
      results[4] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};

      return results;
      
    } else if (specifier == 'newest') {
      
      results[0] = `Sort By: ${specifier} descending..`;
      results[1] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: -1}).toArray()};

      return results;

    } else if (specifier == 'oldest') {
      
      results[0] = `Sort By: ${specifier}`;
      results[1] = { dateTimeSort: await db.collection('Users').find().sort({ createdDateTime: 1}).toArray()};

      return results;

    } else {

      // res.status(400).json({ error: `We're sorry, your sortBy specifier was invalid, please enter a valid specifier..`})

    }

  } catch (err) {
    next(err)
  }

}

async function newDbConn() {
  const db = await connect();
  return db;
}

ping();

export { newId, connect, ping, findAllProducts, findProductById, findProductByProductName,
         insertOneProduct, updateOneProduct, deleteOneProduct, findAllUsers,
         findUserById, findUserByEmail, readUserByEmail, insertOneUser, updateOneUser,
         deleteOneUser, sortBy, newDbConn };
