const { buildSchema } = require("graphql");
const db = require("../database");

const graphql = { };

// GraphQL.
// Construct a schema, using GraphQL schema language
graphql.schema = buildSchema(`
  type Count {
    date: String,
    num: Int
  }

  type Time {
    date: String,
    username: String,
    time: Int
  }

  type Level {
    username: String,
    level: Int
  }

  type User {
    username: String,
    first_name: String,
    last_name: String,
    blocked: Boolean
  }

  type Comment {
    username: String,
    text: String
  }

  type Post {
    post_id: Int,
    text: String,
    username: String,
    deleted: Boolean,
    likes: Int,
    dislikes: Int,
    reply: Int,
    imgUrl: String,
    comments: [Comment]
  }

  type Follow {
    author: String
  }

  type Like {
    post_id: Int,
    username: String,
    type: Int
  }

  type LikeAndDislike {
    likes: Int,
    dislikes: Int
  }

  input UserInput {
    username: String,
    first_name: String,
    last_name: String
  }

  input FollowInput {
    follower: String,
    author: String
  }

  input LikeInput {
    post_id: Int,
    username: String
  }

  # Queries (read-only operations).
  type Query {
    level(username: String): Int,
    is_follow(follower: String, author: String): Boolean,
    all_follows(username: String): [Follow],
    all_posts: [Post],
    all_comments(reply: Int): [Post],
    all_users: [User],
    count_like_and_dislike(post_id: Int): LikeAndDislike,
    like(post_id: Int, username: String): Int 

    all_times: [Time]
    all_counts: [Count]
  }

  # Mutations (modify data in the underlying data-source, i.e., the database).
  type Mutation {
    block_user(username: String): Boolean,
    update_user(input: UserInput): User,
    delete_post(post_id: Int): Boolean,
    delete_user(username: String): Boolean,

    toggle_follow(input: FollowInput): Boolean,
    toggle_like(input: LikeInput): Like,
    toggle_dislike(input: LikeInput): Like,
    
  }
`);

const count_like_and_dislike = async(args) => {
  const likes = await db.like.count({where:{post_id: args.post_id, type: 1}});
  const dislikes = await db.like.count({where:{post_id: args.post_id, type: -1}});
  const post = await db.post.findByPk(args.post_id);
  post.likes = likes;
  post.dislikes = dislikes;
  await post.save();
}

graphql.root = {
  // Queries.
  all_times: async () => {
    const times = await db.time.findAll();

    if(times.length === 0)
      return [];
    
    return times;
  },

  all_counts: async () => {
    const times = await db.time.findAll();

    if(times.length === 0)
      return [];
    
    let result = {};

    for(let i=0; i<times.length; i++) {
      const time = times[i];
      if(result[time.date]) {
        result[time.date] ++;
      } else {
        result[time.date] = 1;
      }
    }
    
    let res = [];
    for (const [key, value] of Object.entries(result)) {
      res.push({date: key, num: value});
    }

    return res;
  },

  level: async (args) => {
    const user = await db.user.findByPk(args.username);
    if(user === null)
      return false;
    
    return user.level;
  },

  like: async (args) => {
    const like = await db.like.findAll({where:args});
    if(like===null || like.length===0) {
      return 0;
    }
      
    return like[0].type;
  },

  all_posts: async () => {
    const posts = await db.post.findAll({  
      where: {reply: -1, deleted: false},
    });

    if(posts === null)
      return false;
    return posts;
  },

  all_comments: async (args) => {
    const comments = await db.post.findAll({  
      where: {reply: args.reply},
    });

    if(comments === null)
      return false;

    return comments;
  },

  all_follows: async (args) => {
    const users = await db.user.findAll();

    if(users === null)
      return false;
    const result = 
    users.forEach(user => {
      
    });
    const follows = await db.follow.findAll({username: args.username});

    if(follows === null)
      return false;

    return follows;
  },
  all_users: async (args) => {
    const users = await db.user.findAll();

    if(users === null)
      return false;
    
    return users;
  },

  is_follow: async(args) => {
    const follows = await db.follow.findAll({where: args});

    if(!follows || follows.length === 0)
      return false;

    return true;
  },

  count_like_and_dislike: async(args) => {
    const likes = db.like.count({where:{post_id: args.post_id, type: 1}});
    const dislikes = db.like.count({where:{post_id: args.post_id, type: -1}});
    return {likes, dislikes};
  },

  // Mutations.
  block_user: async (args) => {
    const user = await db.user.findByPk(args.username);

    if(user === null)
      return false;

    if(user.blocked === null)
      user.blocked = true;
    else
      user.blocked = !user.blocked;

    await user.save();

    return true;
  },
  update_user: async (args) => {
    const user = await db.user.findByPk(args.username);

    if(user === null)
      return false;
    
    user.first_name = args.input.first_name;
    user.last_name = args.input.last_name;

    await user.save();

    return user;
  },
  delete_post: async (args) => {
    const post = await db.post.findByPk(args.post_id);
    if(post === null) 
      return false;
    
    post.deleted = true;
    await post.save();

    return true;
  },
  delete_user: async (args) => {
    const user = await db.user.findByPk(args.username);
    if(user === null)
      return false;

    await db.post.destroy({ where: { username: user.username } });
    await db.profile.destroy({ where: { username: user.username } });
    await db.time.destroy({ where: { username: user.username } });
    await db.follow.destroy({ where: { follower: user.username } });
    await db.follow.destroy({ where: { author: user.username } });
    await db.like.destroy({ where: { username: user.username } });
    await user.destroy();
    
    return true;
  },

  toggle_follow: async (args) => {
    const follows = await db.follow.findAll({ where: args.input });
    let follow = null;
    if(!follows || follows.length === 0) {
      follow = await db.follow.create(args.input);
      return true;
    }
    else {
      follow = follows[0];
      await follow.destroy();
      return false;
    }
  },

  toggle_like: async (args) => {
    const likes = await db.like.findAll({ where: args.input });
    let like = null;
    if(!likes || likes.length === 0) {
      args.input.type = 1;
      like = await db.like.create(args.input);
    }
    else {
      like = likes[0];
      if(like.type === 1) {
        like.type = 0;
      } else {
        like.type = 1;
      } 
      await like.save();
    }
    await count_like_and_dislike({post_id: parseInt(args.input.post_id)});
    return like;
  },
  toggle_dislike: async (args) => {
    const dislikes = await db.like.findAll({ where: args.input });
    let dislike = null;
    if(!dislikes || dislikes.length === 0) {
      args.input.type = -1;
      dislike = await db.like.create(args.input);
    }
    else {
      dislike = dislikes[0];
      if(dislike.type === -1) {
        dislike.type = 0;
      } else {
        dislike.type = -1;
      } 
      await dislike.save();
    }
    await count_like_and_dislike({post_id: args.input.post_id});
    return dislike;
  }

};

module.exports = graphql;
