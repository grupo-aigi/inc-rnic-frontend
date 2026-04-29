# inc-rnic-frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## CI Automático + CD Manual

The Deployment to production follows an automatic CI + manual CD model, since Kubernetes cluster is located on a private network and does not expose the API server to public.

GitHub actions is used exclusively for:

- Continuous integration (build)
- Generation of versioned Docker images
- Artifacts publishing

Deployment to kubernetes is performed manually from an authorized enviroment (Lens or shell with kubectl), maintaining security.

### Workflow

Developer
 ├─ GitHub Repository
 │   └─ GitHub Actions (CI)
 │       ├─ npm install
 │       ├─ ng build
 │       ├─ docker build
 │       ├─ docker push
 │       └─ Pausa (Environment approval)
 │
 └─ Operador Autorizado
     └─ Kubernetes (CD Manual)
         └─ kubectl / Lens

#### Step by step

1. Develop

```bash
git checkout develop
# realizar cambios en el frontend
git commit -m "feat: cambio funcional"
git push origin develop
```

2. Release

```bash
git checkout develop
git checkout -b release/2.1.4
# ajustes finales (si aplican)
git commit -m "chore: prepare release 2.1.4"
```

Create PR from GitHub website from **release/2.1.4** → **main**

3. Create a release and trigger automated CI

```bash
git checkout main
git pull origin main
git tag v2.1.4
git push origin v2.1.4
```

## Production deployment (manual CD)

The RNIC frontend is deployed to production manually and in a controlled manner once the continuous integration (CI) process has completed successfully and the versioned Docker image is avalaible on Docker Hub.

### Prerequisites

Before deploying to production, the following requirements must be met:

- The Docker image corresponding to the version to be deployed has already been built and published by GitHub Actions.
- There is a version tag on GitHub (e.g. v2.1.4).
- The user has authorized access to the Kubernetes cluster, either via lens or Shell with kubectl configured.

#### Option A: Deployment using Lens

1. Open Lens
2. Select the production cluster
3. Switch to the production namespace
4. Go to Workloads -> Deployments -> **rnic-frontend**
5. Edit the Deploument
6. Update the image field with the new version:

```bash
cancerologiadevteam/rnic-frontend:v2.1.4
```

**Save the changes**

Kubernetes will perform an automatic rolling updated and no downtime is generated

#### Option B: Deployment using Shell (kubectl)

From a computer with access to the cluster:

```bash
kubectl set image deployment/rnic-frontend rnic-frontend=cancerologiadevteam/rnic-frontend:v2.1.4 -n production
```

Check the deployment status:

```bash
kubectl rollout status deployment/rnic-frontend -n production
```

## Rollback (in case of an issue)

If a problem comes up after deployment, you can immediately revert to the previous version.

```bash
kubectl rollout undo deployment/rnic-frontend -n production
```

Or explicitly specify a previous version:

```bash
cancerologiadevteam/rnic-frontend:v2.1.3
```
