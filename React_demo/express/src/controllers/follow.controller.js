const db = require("../database");

module.exports.all = async (req, res) => {
  const users = await db.user.findAll();

  if(users === null)
    return false;

  const result = [];
  for(let i=0; i<users.length; i++) {
    const user = users[i];
    const follows = await db.follow.count({where:{author: user.username}});
    result.push({username: user.username, follows})
  }

  res.json(result);
}