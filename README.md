# Supa Stack

[![Open in Dev Containers](https://img.shields.io/static/v1?label=Dev%20Containers&message=Open&color=blue&logo=visualstudiocode)](https://vscode.dev/redirect?url=vscode://ms-vscode-remote.remote-containers/cloneInVolume?url=https://github.com/inovue/supa-stack)

### Prisma 
[prisma-editor](https://prisma-editor.up.railway.app/schema/577)

### References
* [devcontainers/images](https://github.com/devcontainers/images/tree/main/src/typescript-node)
* [Available Dev Container Features](https://containers.dev/features)

### Example
*[PrimeReact + Remix.run](https://github.com/primefaces/primereact-examples/tree/main/remix-run-basic)

### how to start
```
cd remix && npm run setup && cd ../
```


### Create a new project
```
npx create-remix@latest
cd remix && npx prisma init && cd ../
npx supabase init
```


## UI (PrimeFace)
* [PrimeFlex](https://primeflex.org/installation)
* [PrimeIcons](https://primereact.org/icons/)
* [PrimeReact](https://primereact.org/installation/)
```
npm i primeflex primeicons primereact
```


### Prisma Command
[Prisma migration](https://fig.io/manual/prisma/migrate)

```
# ローカルにマイグレーション作成のみ
npx prisma migrate dev --create-only --name {migration_name}

# DBへの適応のみ (migrations -> DB)
npx prisma migrate deploy

```


## Libraries

### auth-helpers/remix
* [Supabase Auth with Remix](https://supabase.com/docs/guides/auth/auth-helpers/remix)
* [repo](https://github.com/supabase/auth-helpers)
* [example](https://github.com/supabase/auth-helpers/tree/589c1083071b3e8715fbfde397dfffa4771b5eef/examples/remix)


### remix-validated-form
* [document](https://www.remix-validated-form.io/)
* [repo](https://github.com/airjp73/remix-validated-form)
* [example](https://github.com/airjp73/remix-validated-form/tree/main/apps/sample-app)


### dnd-kit
* [React で DnD するなら、dnd kit](https://zenn.dev/hamo/articles/725e4189bfc54d)
* [repo](https://github.com/clauderic/dnd-kit)



### upload image (supabase)
* [Remix file upload](https://remix.run/docs/en/main/guides/file-uploads)
* [happy-days](https://github.com/dijonmusters/happy-days)
* [supabase-remix-auth](https://github.com/aaronksaunders/supabase-remix-auth)

* [Remix upload + sharp](https://github.com/Shelf-nu/shelf.nu/blob/e598f4b6ea1778c1e2184d68b114db9abc93c152/app/utils/storage.server.ts#L48)