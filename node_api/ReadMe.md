# README Technique - API Suivi des OF (Ordres de Fabrication)

## Table des Matières
1. **Introduction**
2. **Structure de l'API**
3. **Installation**
4. **Endpoints et Structure des Données**
5. **Tests**
6. **Annexes**

---

## 1. Introduction

Cette API permet de gérer et de suivre les **Ordres de Fabrication (OF)** dans un environnement industriel à l'aide de la technologie **RFID**, tout en proposant une architecture modulaire et extensible basée sur **Node.js** et **Prisma ORM**.

---

## 2. Structure de l'API

La structure des fichiers du projet est organisée pour séparer la logique métier, la gestion des données et les routines périodiques. Voici un aperçu de l'organisation :

```
node_api/
├── prisma/               # Gestion des migrations et modèles de base de données
├── src/
│   ├── functions/        # Logique des endpoints
│   ├── helpers.js        # Fonctions utilitaires
│   ├── routines/         # Scripts périodiques (alertes, stats)
├── index.js              # Point d'entrée principal
├── package.json          # Configuration des dépendances
├── erase.ts              # Script pour vider la base de données
└── README.md             # Documentation du projet
```

---

## 3. Installation

### Prérequis :
- **Node.js** v16+
- **NPM** ou **Yarn**
- **SQLite** (Base de données locale)

### Étapes :
1. Cloner le dépôt :
   ```bash
   git clone <url_du_dépôt>
   cd node_api
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer Prisma :
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. Lancer le serveur :
   ```bash
   npm start
   ```

---

## 4. Endpoints et Structure des Données

### Tableau des Endpoints

| **Méthode** | **Endpoint**                          | **Description**                                       | **Paramètres/Requête**                                                                                                                                               | **Réponse**                                                                                                                                                                     |
|-------------|---------------------------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `GET`       | `/antennas`                          | Liste les antennes RFID connectées.                   | Aucun                                                                                                                                                                | ```json [{ "id": 1, "reference": 101 }, { "id": 2, "reference": 102 }] ```                                                              |
| `GET`       | `/encours`                           | Liste les en-cours et les commandes associées.         | Aucun                                                                                                                                                                | ```json [{ "id": 1, "antennaId": 1, "orders": [...] }, { "id": 2, "antennaId": 2, "orders": [...] }] ```                                |
| `GET`       | `/encours/:id`                       | Détails d'un en-cours spécifique.                    | Aucun                                                                                                                                                                | ```json { "id": 1, "antennaId": 1, "orders": [...] } ```                                                                              |
| `GET`       | `/encours/:id/orders`                | Liste les commandes associées à un en-cours.         | Aucun                                                                                                                                                                | ```json [{ "id": 10, "status": 1, "productId": 5 }] ```                                                                               |
| `GET`       | `/workshops`                         | Liste les ateliers et leur état actuel.               | Aucun                                                                                                                                                                | ```json [{ "id": 1, "name": "Atelier A", "enCoursId": 1 }, { "id": 2, "name": "Atelier B", "enCoursId": 2 }] ```                        |
| `GET`       | `/workshops/:id`                     | Détails d'un atelier spécifique.                     | Aucun                                                                                                                                                                | ```json { "id": 1, "name": "Atelier A", "enCoursId": 1 } ```                                                                       |
| `GET`       | `/workshops/:id/orders`              | Liste les commandes associées à un atelier.           | Aucun                                                                                                                                                                | ```json [{ "id": 12, "status": 1, "productId": 5 }] ```                                                                               |
| `GET`       | `/orders`                            | Liste toutes les commandes.                          | Aucun                                                                                                                                                                | ```json [{ "id": 10, "status": 0, "productId": 1 }] ```                                                                              |
| `GET`       | `/artisans`                          | Liste les artisans et leurs statistiques.            | Aucun                                                                                                                                                                | ```json [{ "id": 1, "name": "John", "totalWorkingHours": 10 }] ```                                                                  |
| `GET`       | `/events`                            | Liste tous les événements.                           | Aucun                                                                                                                                                                | ```json [{ "id": 1, "orderId": 10, "timestamp": "2025-01-01T12:00:00Z" }] ```                                                        |
| `GET`       | `/orders/:id/last-event`             | Dernier événement d'une commande spécifique.         | Aucun                                                                                                                                                                | ```json { "id": 1, "orderId": 10, "timestamp": "2025-01-01T12:00:00Z" } ```                                                          |
| `GET`       | `/rfids`                             | Liste tous les RFIDs.                                | Aucun                                                                                                                                                                | ```json [{ "id": 1, "reference": "RFID123" }] ```                                                                                    |
| `GET`       | `/rfids/trolleys`                    | Liste les RFIDs associés à des chariots.             | Aucun                                                                                                                                                                | ```json [{ "id": 1, "trolley": "Chariot A" }] ```                                                                                    |
| `GET`       | `/supports`                          | Liste tous les supports associés aux commandes.      | Aucun                                                                                                                                                                | ```json [{ "id": 1, "orderId": 10, "artisanId": 1, "type": 1 }] ```                                                                |
| `GET`       | `/alerts`                            | Liste toutes les alertes générées.                   | Aucun                                                                                                                                                                | ```json [{ "id": 1, "orderId": 12, "type": 1, "status": 1, "startDate": "2025-01-10" }] ```                                             |
| `GET`       | `/alerts/active`                     | Liste les alertes actives uniquement.                | Aucun                                                                                                                                                                | ```json [{ "id": 1, "orderId": 12, "type": 1, "status": 1 }] ```                                                                       |
| `GET`       | `/stats`                             | Statistiques globales.                               | Aucun                                                                                                                                                                | ```json [{ "id": 6, "name": "Temps moyen en-cours", "value": 2.5, "unit": "h" }] ```                                                    |
| `GET`       | `/time`                              | Liste des temps enregistrés pour les commandes.      | Aucun                                                                                                                                                                | ```json [{ "id": 1, "orderId": 10, "duration": 120, "unit": "minutes" }] ```                                                       |
| `POST`      | `/workshops`                         | Crée un nouvel atelier.                              | ```json { "name": "Atelier C", "startDate": "2025-01-10", "endDate": "2025-01-15", "enCoursId": 1 } ```                                                | ```json { "id": 3, "name": "Atelier C", "enCoursId": 1 } ```                                                                       |
| `POST`      | `/antennas/:id/rfids`                | Gère les détections RFID pour une antenne donnée.    | ```json { "rfids": ["rfid1", "rfid2"], "timestamp": "2025-01-01T12:00:00Z" } ```                                                                            | ```json { "message": "RFID detection processed successfully", "enteredRfids": [...], "exitedRfids": [...] } ```                        |
| `POST`      | `/orders`                            | Crée une nouvelle commande OF.                       | ```json { "productId": 1 } ```                                                                                                                                     | ```json { "id": 10, "status": 0, "productId": 1 } ```                                                                                  |
| `POST`      | `/orders/assign`                     | Associe un OF à un RFID.                             | ```json { "selectedOrder": 10, "selectedTrolleyId": 1 } ```                                                                                                    | ```json { "id": 10, "rfidOrderId": 5 } ```                                                                                             |
| `POST`      | `/supports`                          | Associe un support (artisan) à une commande.         | ```json { "rfidId": "12345", "type": "Type 1", "artisan": "John" } ```                                                                                   | ```json { "id": 5, "orderId": 1, "artisanId": 1, "type": "Type 1" } ```                                                                |
| `POST`      | `/sample`                            | Crée un exemple d'ordre avec des données par défaut. | Aucun                                                                                                                                                                | ```json { "id": 11, "status": 0, "productId": 2 } ```                                                                                  |

---

### Détails des Structures des Données

#### Antennes (Endpoint `/antennas`)
- **Requête** : Aucun paramètre requis.
- **Structure de réponse** :
```json
[
  {
    "id": 1,
    "reference": 101
  },
  {
    "id": 2,
    "reference": 102
  }
]
```

#### En-cours (Endpoint `/encours`)
- **Requête** : Aucun paramètre requis.
- **Structure de réponse** :
```json
[
  {
    "id": 1,
    "antennaId": 101,
    "orders": [
      {
        "id": 12,
        "status": 1,
        "productId": 5
      }
    ]
  }
]
```

#### Ateliers (Endpoint `/workshops`)
- **Requête** : Aucun paramètre requis.
- **Structure de réponse** :
```json
[
  {
    "id": 1,
    "name": "Atelier A",
    "enCoursId": 1
  }
]
```

#### Commandes (Endpoint `/orders`)
- **Requête** :
```json
{
  "productId": 1
}
```
- **Structure de réponse** :
```json
{
  "id": 10,
  "status": 0,
  "productId": 1
}
```

#### Alertes (Endpoint `/alerts` et `/alerts/active`)
- **Structure de réponse** :
```json
[
  {
    "id": 1,
    "orderId": 12,
    "type": 1,
    "status": 1,
    "startDate": "2025-01-01T12:00:00Z",
    "endDate": null
  }
]
```

---

Pour des détails supplémentaires, veuillez consulter la documentation de l'architecture dans `prisma/schema.prisma`.
