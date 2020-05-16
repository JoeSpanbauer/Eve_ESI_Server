const getConnection = require('./queries/connection');
const {
  get,
  insert,
  update,
} = require('./queries/auth');

module.exports.get = async (authData) => {
  const connection = getConnection();
  connection.connect();

  const result = await new Promise((resolve, reject) => {
    get(connection, authData, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })

  connection.end();

  return result;
}

module.exports.post = async (authData) => {
  const connection = getConnection();
  connection.connect();

  const result = await new Promise((resolve, reject) => {
    insert(connection, authData, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })

  connection.end();

  return result;
}

module.exports.put = async (authData) => {
  const connection = getConnection();
  connection.connect();

  const result = await new Promise((resolve, reject) => {
    update(connection, authData, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  })

  connection.end();

  return result;
}
