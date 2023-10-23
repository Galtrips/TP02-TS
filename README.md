[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snAihZAi)
# Bakery-TS-Template

Nous allons apprendre à utiliser MongoDB au sein de Node.js au cours de ce TD. 
Tout les fichiers sont écrits en Typescript.
Nous allons créer une API pour gérer les produits d'une boulangerie.

## 1. Les routes produits

Nous allons avoir besoin de 4 routes pour les produits de notre boulangeries. 

### 1.1 La route de création de produit

PATH: **/api/products/**
METHODE: **POST**.
BODY: 
```json
{
	"name": "Pain au chocolat",
	"description": "Pas une chocolatine",
	"price": 0.15
}
```
REPONSE: 
- Code **200** dans le cas ou le produit a bien été crée.
L'intégralité de l'objet crée sera renvoyé, exemple: 
```json
{
	"product": {
		"_id":"...",
		"name":"",
		"description":"",
		"price":""
	}
}
```
- Code **500** si le serveur rencontre une erreur. Dans ce cas, le body de la réponse sera: 
```json
{
	"error": {
		
	}
}
```

### 1.2 La route de récupération de tous les produits

PATH: **/api/products/**
METHODE: **GET**
BODY: Aucun.
REPONSE:
- Code **200** si tout va bien.
On obtiendra une réponse sous cette forme là: 
```json
{
	"products": [
		{
			"_id":"...",
			"name":"",
			"description":"",
			"price":""
		},
		{
			"_id":"...",
			"name":"",
			"description":"",
			"price":""
		}
	]
}
```
- Code **500** si le serveur rencontre un problème. Même réponse qu'au dessus. 

### 1.3 La route de récupération d'un seul produit

PATH: **/api/products/:id**
METHODE: **GET**
BODY: Aucun.
REPONSE:
- Code **200** si tout va bien.
On obtiendra une réponse sous cette forme là: 
```json
{
	"product": {
		"_id":"...",
		"name":"",
		"description":"",
		"price":""
	}
}
```
- Code **404** si le produit n'existe pas. Avec un objet contenant une clé erreur.
- Code **500** si le serveur rencontre un problème. Même réponse qu'au dessus. 

### 1.4 La route de modification d'un produit

PATH: **/api/products/:id**
METHODE: **PUT**
BODY: Un objet qui doit contenir **au moins** une des clés suivantes. Il peut contenir 2, ou 3 clés en simultané. 
```json
{
	"name":"new name",
	"description":"new desc",
	"price":10
}
```
REPONSE:
- Code **200** si tout va bien.
On obtiendra une réponse sous cette forme là: 
```json
{
	"product": {
		"_id":"...",
		"name":"",
		"description":"",
		"price":""
	}
}
```
- Code **404** si le produit n'existe pas. Avec un objet contenant une clé erreur.
- Code **500** si le serveur rencontre un problème. Même réponse qu'au dessus. 

### 1.5 La route de suppression d'un produit

PATH: **/api/products/:id**
METHODE: **DELETE**
BODY: Aucun
REPONSE:
- Code **200** si tout va bien.
On obtiendra une réponse sous cette forme là: 
```json
{
	"product": {
		"_id":"...",
		"name":"",
		"description":"",
		"price":""
	}
}
```
- Code **404** si le produit n'existe pas. Avec un objet contenant une clé erreur.
- Code **500** si le serveur rencontre un problème. Même réponse qu'au dessus. 

## 2. La validation de format des requêtes. 

Nous allons utiliser le plugin JOI pour valider nos requêtes. 
Pour l'installer, tapez 
```
npm install joi @types/joi
```
Nous allons définir 2 schéma de validations. 

### 2.1 Schéma de création

Le premier sera pour la création de produit, nous voulons que notre body de requête possède absolument les 3 clés de l'objet suivant: 
```json
{
	"name":"new name",
	"description":"new desc",
	"price":10
}
```

Pour forcer une clé à être requise dans le body, nous pouvons utiliser la fonction suivante: 
```ts
const schemaFormater: Joi.ObjectSchema = Joi.object({
	title: Joi.string().required(),
});
```

### 2.2 Schéma de modification

Notre schéma de modification sera identique au schéma de création, a la différence qu'il sera plus laxiste: il sera possible de ne mettre qu'une seule clé sur les 3. 
Pour celà, nous pouvons utiliser les fonctions suivantes: 
```ts
const schemaFormater: Joi.ObjectSchema = Joi.object({
	title: Joi.string()
	price: Joi.number()
}).or("title", "price");
```

L'intégralité de la documentation de joi se trouve [ici](https://joi.dev/api/?v=17.9.1).

## 3. L'authentification

Pour sécuriser notre api, nous allons mettre en place en module d'authentification simple.
Pour celà, nous allons avoir besoin de différents packages, détaillés plus bas.

```
npm install jsonwebtoken bcrypt
```

### 3.1 Ajout d'utilisateur

Nous devons dans un premier temps créer un noveau modèle de données pour les utilisateurs. 
Ce dernier possèdera les attributs suivant: 

```json
{
	"email":"...",
	"password":""
}
```

Le password devra être stocké sous forme de hash.

### 3.2 Route d'utilisateurs

Nous allons avoir besoin de deux routes: une route pour s'enregistrer et une route pour se connecter. 

#### 3.2.1 Route register

PATH: **/users/register**
METHODE: **POST**
BODY: 
```json
{
	"email":"...",
	"password":"..."
}
```
REPONSE: 
- **200** Si l'utilisateur a bien été crée, avec le body suivant:

```json
{
	"user":
	{
		"_id":"...",
		"email":"..."
	}
}
```

- **400** Si l'email est déjà pris. L'objet de retour contiendra une clé erreur comme vu précédemment. 
- **500** En cas d'erreur du serveur. L'objet de retour contiendra une clé erreur comme vu précédemment. 

#### 3.2.2 Route login

PATH: /users/login
METHODE: POST
BODY: 
```json
{
	"email":"...",
	"password":"..."
}
```
REPONSE: 
- **200** Si l'utilisateur a bien été loggé, avec le body suivant:

```json
{
	"user":
	{
		"_id":"...",
		"email":"..."
	},
	"token": "..."
}
```

- **400** Si le password n'est pas correct. L'objet de retour contiendra une clé erreur comme vu précédemment. 
- **500** En cas d'erreur du serveur. L'objet de retour contiendra une clé erreur comme vu précédemment. 

### 3.3 Rappels

Pour le package bcrypt, vous pouvez utiliser le genre de code suivant pour encrypter/décrypter un mot de passe: 

```ts
// Encryptage
const hash: string = await bcrypt.hash(password, 5); // 5 correspond au nombre de fois que le hashage est effectué

// Décryptage
let passwordCorrect: boolean = await bcrypt.compare(givenPassword, storedPassword);
```

Pour générer un nouveau token, et le vérifier, vous pouvez utiliser le code suivant: 

```ts
// Encryptage du token
const token: string = jwt.sign(objectToEncrypt, "<secret_key>", options);
/*
Les options communes sont: 
	- expiresIn: 1h, ou 1d, 1M pour le délai d'expiration du token
*/

// Décryptage du token
const decodedToken = jwt.verify(token, "<secret_key>");
// decodedToken contient l'objet objectToEncrypt
```

## 4. Exercice bonus 

Pour aller un peu plus loin, nous aimerions gérer le **stock** de chaque produit de notre boulangerie.
Par défaut, le **stock** de chaque produit sera de **10**.
Cette valeur ne sera pas modifiable par la route de modification de produit. 

Modifiez le modèle de données en conséquence. 

Nous allons ensuite créer une route pour gérer l'achat. 

PATH: **/api/products/buy/:id**
METHODE: **POST**
BODY: Aucun
REPONSE: 
- **200** si tout s'est bien passé, mais le body diffèrera selon les possibilités
	- Le produit entier avec le stock mis à jour, si le stock était > 0 avant l'achat.
	- Un objet avec une clé erreur, stipulant qu'il n'y a plus de stock, si le stock était = 0. 
- **404** si le produit n'existe pas
- **500** si le serveur produit une erreur


Happy Coding !
