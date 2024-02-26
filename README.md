# Kids Pokemon app

Experimenting with go by building a web app to allow the kiddos to track & trade their pokemon card collection.

Maybe they'll learn something along the way too 🤷‍♂️

This application uses the [Pokemon TCG API](https://docs.pokemontcg.io/) for card data.

### Authentication

I didn't feel like wiring up a real authentication API. So, I'm gonna use a json file to store authentication credentials.

#### Setup
- Copy the authentication template.

  ```
  cp frontend/src/auth.example.json > frontend/src/auth.json
  ```

- Create your own name/password combination