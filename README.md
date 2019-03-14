# React PWA with Firebase, IndexedDb and Material UI

Example "TODO App" - for someone who is trying to figure out how things work together using any of the above in React. Works Offline.

## Getting Started

Create Realtime Database from Firebase. Get app [credentials](https://firebase.google.com/docs/web/setup) and put them into `.env.local` file which looks like this:

### .env.local

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_DB_URL=your-db-url
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_STORAGE_BUCKET=your-storage-bucket-url
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
```

## Installation:

I'm using [yarn](https://yarnpkg.com/lang/en/). Give it a try if you haven't yet.

```
$ yarn
```

Once dependancies are installed just execute Create React App starting command:

```
$ yarn start
```

## Coding style is looked after by:

- [ESLint](https://eslint.org/)
- [Airbnb](https://github.com/airbnb/javascript)
- [Prettier](https://prettier.io/)
- [Husky](https://github.com/typicode/husky)

####

## License

This project is licensed under the [MIT License](LICENSE.md)
