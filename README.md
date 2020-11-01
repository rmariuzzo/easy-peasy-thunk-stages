<br>
<br>
<br>
<center>
<h1><code>easy-peasy-thunk-stages</code></h1>
<small>Thunk stages in your model is easy-peasy!</small>
</center>
<br>
<br>
<br>

Do you need to **access the stages of your thunks** in easy-peasy? If yes, you are in the right place.

**`easy-peasy-thunk-stages`** allows you to augment your states adding the stage of all your thunks.

## Installation

```sh
npm i easy-peasy-thunk-stages
```

## Example

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

Probably, you app need to known when a given thunk is `idle` or `busy`. Also, it would be useful to know when they `completed` or `failed`.

With **`easy-peasy-thunk-stages`** you can have that information about your thunks' stages by doing 3 simple changes:

```ts
//                           1️⃣Extends the interface.
//                           👇
interface UsersModel extends ThunkStagesModel<UsersModel> {
  fetch: Thunk<UsersModel>
  create: Thunk<UsersModel, User>
  update: Thunk<UsersModel, User>
  remove: Thunk<UsersModel, User>
}

const userModel {
  ...thunkStagesModel({   // 👈2️⃣ Add the implementation.
    fetch: 'idle',
    create: 'idle',       // 👈3️⃣ Initialize each thunk with a stage.
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

### Tradeoff

Adding `thunkStagesModel()` will augment your model with the following properties: `thunkStages`, `setThunkStage` and `setThunkStageOn`.

As a consumer your app will be interacting with `thunkStages`. While the other two props are used by `thunkStagesModel()` to listen to all thunk and updates their stages.
