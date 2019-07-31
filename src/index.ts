import 'reflect-metadata';
import express from 'express';
import { createConnection, getRepository } from 'typeorm';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from 'dotenv';
import { Posts } from './entity/Posts';

const main = async () => {
  config();
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // setup typeorm
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.HOST,
    port: 5432,
    username: process.env.USR,
    password: process.env.PASSWORD,
    database: process.env.DB,
    ssl: true,
    logging: true,
    synchronize: true,
    entities: [Posts]
  });

  app.get('/api/posts', async (req, res) => {
    const postRepository = getRepository(Posts);
    const posts = await postRepository.find();
    res.json({
      data: posts
    });
  });

  app.get('/api/posts/:id', async (req, res) => {
    const postId = req.params.id;
    console.log(postId);
    const postRepository = getRepository(Posts);
    const post = await postRepository.findOne({
      where: {
        id: postId
      }
    });
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'post id is not valid'
        }
      });
    }
    res.status(200).json({
      data: post
    });
  });

  app.post('/api/post', async (req, res) => {
    const { title, author, body, isPublished } = req.body;
    if (!title || !author || !body) {
      return res.status(422).json({
        error: {
          message: 'please provide all field title,author,body'
        }
      });
    }

    const post = new Posts();
    post.author = author;
    post.body = body;
    post.title = title;
    const postRepository = getRepository(Posts);
    await postRepository.save(post);

    res.status(200).json({
      data: post
    });
  });

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
};

main();
