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
* [PrimeFlex](https://www.primefaces.org/primeflex/)
* [PrimeIcons](https://primereact.org/icons/)
* [PrimeReact](https://primereact.org/installation/)
```
npm i primeflex primeicons primereact
```


### Prisma Command
[Prisma migration](https://fig.io/manual/prisma/migrate)
````

# ローカルにマイグレーション作成のみ
npx prisma migrate dev --create-only --name {migration_name}

# DBへの適応のみ (migrations -> DB)
npx prisma migrate deploy --preview-feature

```