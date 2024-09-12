# N2LCTF

The **N2LCTF** project is an _open-source, high-performance, Jeopardy-style's_ CTF platform based on https://github.com/ElaBosak233/cloudsdale. this platform focused ctf training in **INDONESIA**

**WARNING! THIS PROJECT IS STILL IN DEVELOPMENT, DO NOT USE FOR PRODUCTION**

## DEV

run docker-compose-dev to start dummy psql,cache afteru start ( using docker compose -f deploys/docker-compose.dev.yml )

then run the app using (

cargo run . 

) to run the rust backend

and (

```bas
cd app/web && npm run dev
```

 ) to run the vite frontend


to-do:

fixing question bank category relations


| **POST** | **http://**localhost:8888**/api/challenges** |
| -------------- | -------------------------------------------------------- |


also add features connection info and attachment into the question bank/challenges endpoint, also add into game_team

## Contributors

![img](https://contrib.rocks/image?repo=n2l-cysec/n2lctf)

This project is licensed under the [GNU General Public License v3.0](https://github.com/ElaBosak233/Cloudsdale/blob/main/LICENSE).
