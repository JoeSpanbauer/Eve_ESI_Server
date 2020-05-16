const axios = require('axios');
const AuthData = require('../api/auth');

const addToDB = async (authData) => {
  const result = await AuthData.get(authData);
  if (result.length > 0) {
    await AuthData.put(authData);
  } else {
    await AuthData.post(authData);
  }
};

const authorize = (req, res) => {
  const urlParameters = [
    `${process.env.EVE_LOGIN}/oauth/authorize?response_type=code`,
    `redirect_uri=${process.env.CALLBACK_URL}`,
    `client_id=${process.env.CLIENT_ID}`,
    `scope=${process.env.SCOPE}`
  ];

  const url = urlParameters.join('&');

  res.json({url});
};

const authenticate = async (req, res) => {
  const { code } = req.query;

  // Token
  const tokenData = await axios.post(`${process.env.EVE_LOGIN}/oauth/token`, {
    grant_type: "authorization_code",
    code
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.SECRET_KEY}`).toString('base64')}`
    }
  });
  const { access_token, refresh_token } = tokenData.data;
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  // Character Data
  const characterData = await axios.get(`${process.env.EVE_API}/verify`, { headers });
  const { CharacterID, CharacterName } = characterData.data;

  const authData = {
    id: CharacterID,
    name: CharacterName,
    accessToken: access_token,
    refreshToken: refresh_token,
  };

  await addToDB(authData);

  res.set('Authorization', `Bearer ${access_token}`);
  
  res.end();
};

const refreshToken = async (authData) => {
  const tokenData = await axios.post(`${process.env.EVE_LOGIN}/oauth/token`, {
    grant_type: 'refresh_token',
    refresh_token: authData.refreshToken,
    scope: process.env.SCOPE
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.SECRET_KEY}`).toString('base64')}`
    }
  });
  const { access_token, refresh_token } = tokenData.data;
  const updatedAuthData = Object.assign({...authData}, { accessToken: access_token, refreshToken: refresh_token});
  addToDB(updatedAuthData);
};

module.exports = {
  authorize,
  authenticate,
  addToDB,
  refreshToken,
};
