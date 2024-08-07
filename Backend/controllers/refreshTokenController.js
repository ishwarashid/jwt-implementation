const User = require('../model/User');
const jwt = require('jsonwebtoken');


const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403);
          const hackedUser = await User.findOne({ username: decoded.username });
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      );

      return res.sendStatus(403);
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log("Refresh token expired!");
          foundUser.refreshToken = [...newRefreshTokenArray];
          await foundUser.save();
        }
        if (err || decoded.username !== foundUser.username) return res.sendStatus(403);

        const roles = Object.values(foundUser.roles).filter(Boolean);
        const accessToken = jwt.sign(
          {
            userInfo: {
              username: foundUser.username,
              roles: roles
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15s' }
        );

        const newRefreshToken = jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );

        console.log("old")
        console.log(foundUser)
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        console.log("new")
        console.log(foundUser)
        const result = await foundUser.save();
        console.log("after")
        console.log(result)

        res.cookie("jwt", newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: true });

        res.json({ roles, accessToken });
      }
    );
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

module.exports = { handleRefreshToken };

// const User = require('../model/User');
// const jwt = require('jsonwebtoken');


// const handleRefreshToken = async (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.sendStatus(401);

//   const refreshToken = cookies.jwt;
//   res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

//   try {
//     const foundUser = await User.findOne({ refreshToken }).exec();
//     if (!foundUser) {
//       jwt.verify(
//         refreshToken,
//         process.env.REFRESH_TOKEN_SECRET,
//         async (err, decoded) => {
//           if (err) return res.sendStatus(403);
//           const hackedUser = await User.findOne({ username: decoded.username });
//           updatedRefreshToken = [];
//           await hackedUser.updateOne({$set: {refreshToken: updatedRefreshToken}});
//         }
//       );

//       return res.sendStatus(403);
//     }

//     const newRefreshTokenArray = foundUser.refreshToken.filter(token => token !== refreshToken);

//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       async (err, decoded) => {
//         if (err) {
//           console.log("Refresh token expired!");
//           updatedRefreshToken = [...newRefreshTokenArray];
//           await foundUser.updateOne({$set: {refreshToken: updatedRefreshToken}});
//         }
//         if (err || decoded.username !== foundUser.username) return res.sendStatus(403);

//         const roles = Object.values(foundUser.roles).filter(Boolean);
//         const accessToken = jwt.sign(
//           {
//             userInfo: {
//               username: foundUser.username,
//               roles: roles
//             }
//           },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: '15s' }
//         );

//         const newRefreshToken = jwt.sign(
//           { username: foundUser.username },
//           process.env.REFRESH_TOKEN_SECRET,
//           { expiresIn: '1d' }
//         );

//         console.log("old")
//         console.log(foundUser)
//         updatedRefreshToken = [...newRefreshTokenArray, newRefreshToken];
//         const result = await foundUser.updateOne({$set: {refreshToken: updatedRefreshToken}});
//         console.log("after")
//         console.log(foundUser)

//         res.cookie("jwt", newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'None', secure: true });

//         res.json({ roles, accessToken });
//       }
//     );
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// };

// module.exports = { handleRefreshToken };