module.exports.get = (connection, { id }, done) => {
  connection.query(`SELECT * FROM ${process.env.DB_NAME}.${process.env.DB_AUTH_TABLE_NAME} WHERE id = ?`, [id], done);
};

module.exports.insert = (connection, authData, done) => {
  connection.query(`INSERT INTO ${process.env.DB_NAME}.${process.env.DB_AUTH_TABLE_NAME} SET ?`, authData, done);
};

module.exports.update = (connection, authData, done) => {
  connection.query(`UPDATE ${process.env.DB_NAME}.${process.env.DB_AUTH_TABLE_NAME} SET ? WHERE id = ?`, [authData, authData.id], done);
};
