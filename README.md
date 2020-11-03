<center>
<h1><code>easy-peasy-thunk-stages</code></h1>
<small>Thunk stages in your model is easy-peasy!</small>
</center>
<br>
<br>
<br>
<br>

Do you need to **access the stages of your thunks** in easy-peasy? If yes, you are in the right place.

**`easy-peasy-thunk-stages`** allows you to augment your states adding the stage of all your thunks.

**There are 2 ways of using this library:**

1.  [Using **the model** `thunkStagesModel`](#example-using-the-model). If you need to store stages for all thunk in a model.
2.  [Using **the hook** `useThunkStage`](#example-using-the-hook). If you want to wrap an existing thunk using a hook that will give you the correspondin stage. **Note:** the hook doesn't persist the stage in the store.

## Installation

```sh
npm i easy-peasy-thunk-stages
```

## Example using the model

Given the following `UsersModel` containing 4 thunks.

```ts
interface UsersModel {
  fetch: Thunk<UsersModel>
  createUser: Thunk<UsersModel, User>
  updateUser: Thunk<UsersModel, User>
  removeUser: Thunk<UsersModel, User>
}

const userModel {
  fetch: thunk(...),
  createUser: thunk(...),
  updateUser: thunk(...),
  removeUser: thunk(...),
}
```

And your app need to known when any thunk is `idle`, `busy`, `completed` or `failed`.

With **`easy-peasy-thunk-stages`** you can have that information about your thunks' stages by doing 3 simple changes:

```ts
//                           1️⃣ Extends the interface.
//                           👇
interface UsersModel extends ThunkStagesModel<UsersModel> {
  fetch: Thunk<UsersModel>
  create: Thunk<UsersModel, User>
  update: Thunk<UsersModel, User>
  remove: Thunk<UsersModel, User>
}

const userModel {
  ...thunkStagesModel({   // 👈 2️⃣ Add the implementation.
    fetch: 'idle',
    create: 'idle',       // 👈 3️⃣ Initialize each thunk with a stage.
    update: 'idle',
    remove: 'idle',
  }),
  fetch: thunk(...),
  create: thunk(...),
  update: thunk(...),
  remove: thunk(...),
}
```

That's it! Now, you can access your thunk stages as follows:

```ts
const UsersPage = () => {
  const thunkStages = useStoreState($ => $.users.thunkStages)

  useEffect(() => {
    if (thunkStages.fetch === 'idle') {
      fetch()
    }
  }, [])

  if (thunkStages.fetch === 'busy') {
    return 'Loading...'
  }

  if (thunkStages.fetch === 'failed') {
    return 'Could not load users...'
  }

  return <UsersList users={users}>
}
```

## Example using the hook

```ts
import { useThunkStage } from 'easy-peasy-thunk-stages'

const UsersPage = () => {
  const fetchUsers = useStoreState($ => $.users.fetchUsers)
  const [fetch, fetchStage] = useThunkStage(fetchUsers)

    useEffect(() => {
    if (fetchStage === 'idle') {
      fetch()
    }
  }, [])

  if (fetchStage === 'busy') {
    return 'Loading...'
  }

  if (fetchStage === 'failed') {
    return 'Could not load users...'
  }

  return <UsersList users={users}>
}
```

### Tradeoff

Adding `thunkStagesModel()` will augment your model with the following properties: `thunkStages`, `setThunkStage` and `setThunkStageOn`.

As a consumer your app will be interacting with `thunkStages`. While the other two props are used by `thunkStagesModel()` to listen to all thunk and updates their stages.

## Development

1.  Clone this repository.
2.  Install dependencies: `npm i`.
3.  Run it locally: `npm start` or `./src/bin.js`

### Tests

```sh
npm run test
```

### Releases

Releases are triggered by `npm version` and handled by [GitHub Actions](https://github.com/rmariuzzo/shorted-theme/actions?query=workflow%3Apublish).

<br>
<br>
<br>
<center>
Made with ♥ by <a href="https://github.com/rmariuzzo" target="_blank">@rmariuzzo</a>
</center>
