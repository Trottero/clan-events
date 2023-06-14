### Clan events

This repo contains both back and front-end for the clan-events website where you can host your bingos, tile-races or Monopoly-style events!

Upon visiting the website you can create an account using Discord and start by adding your clan. You then start creating events, add links to your [wiseoldman](https://wiseoldman.net) page and more!

This site provides tooling for Administrators to manage clan events which include things such as;

- Custom event boards
- Submission review
- Integrated Dice rolling system

Clan members can then in real-time see the position of their team as well as their competitions' in addition to providing a central hub for anything event-related.

## Back-end

In order to run the API with the docker image you need to run the following commands.

Build the image:

```bash
docker build -t clan-events-api .
```

Run the image:

```bash
docker run -p 49160:3000 -d clan-events-api
```
