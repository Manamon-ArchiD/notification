# Manamon - Notification

## Production

### Lancement

```bash
docker compose up -d
``` 

## Développement

### Prérequis

- Node.js 20.x
- Docker

### Installation

```bash
npm install
```

### Lancement

```bash
npm run dev
```

# Configuration

## Variables d'environnement

| Nom | Description | Valeur par défaut
| :- | :- | :- |
| `PORT` | Port du serveur web de l'API | `3000` 
| `POSTGRES_HOST` | Host du serveur postgres | `localhost` 
| `POSTGRES_PORT` | Port du serveur postgres | `5432` 
| `POSTGRES_DB` | Nom de la base | `localhost` 
| `POSTGRES_USER` | Utilisateur de la base | `postgres` 
| `POSTGRES_PASS` | Mot de passe de l'utilisateur | `postgres` 