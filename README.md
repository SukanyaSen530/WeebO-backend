#### (WeebO-backend)

Backend for WeebO action figure Ecommerce Application

## Features -

- Authentication using JWT token
- User Wishlist management
- User Cart management
- User Address management
- User Order managament
- Stripe payment integration using webhooks
- Get Products and single Product

## Stack Used

- Node JS
- Express JS
- Mongoose
- Javascript

## Steps To Run locally

- Clone or fork the project
- `npm install`
- `npm start` or
- `npm server` for development mode - using nodemon

## Env variables

- PORT - 8000
- MONGO_URL - (Mongo configuration of the cluster)
- JWT_SECRET
- CLIENT_URL - `weebofigurines.vercel.app` or `http://localhost:3000`
- STRIPE_KEY
- STRIPE_WEBHOOK_KEY

## Base URL

- Production - `weeb-o-backend.vercel.app`
- Local - `http://localhost:8000`

## Endpoints

- All responses are made with Content-Type: application/json

      (Public Routes)

</br>

> ### Products

1. #### `/products` [GET]

- Description - get all products
- Requires - NA
- Returns - array of products on success, error message on failure.

2. #### `/products/:productId` [GET]

- Description - get single product
- Requires - NA
- Returns - product object on success, error message on failure.

</br>

> ### Authentication

1. #### `/auth/login` [POST]

- Description - logs in a user to the system
- Requires - `[email: <string>, password: <string>]`
- Returns - access token and user info on success, error message on failure.

2. #### `/auth/signup` [POST]

- Description - registers a new user
- Requires - `[fullName: <string>, userName: <string>, email: <string> password: <string>]`
- Returns - access token and user info on success, error message on failure.

        (Protected Routes)

### All protected routes require token in header -
```javascript
headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyN2JkZTU1N2Y4ZWRiNzM3MjQ4ZGM0YiIsImlhdCI6MTY1MjI4NTAxNCwiZXhwIjoxNjU0ODc3MDE0fQ.yIfgTISVW6c3yMPsRijLrSwXuM0vFhhW5jxY6VgyyYw'
}
```
<br/>

> ### User

1. #### `/auth/user` [GET]

- Description - get user details
- Requires - NA
- Returns - user info on success, error message on failure.

<br/>

> ### Wishlist

1. #### `/wishlist` [GET]

- Description - get user wishlist
- Requires - NA
- Returns - array of products on success, error message on failure.

1. #### `/wishlist/add` [POST]

- Description - add product to user wishlist
- Requires - `[id: <string>]` `(productId)` - body
- Returns - updated wishlist on success, error message on failure.

1. #### `/wishlist/remove` [POST]

- Description - remove product from user wishlist
- Requires - `[id: <string>]` `(productId)` - body
- Returns - updated wishlist on success, error message on failure.

<br/>

> ### Cart

1. #### `/cart` [GET]

- Description - get user cart
- Requires - NA
- Returns - cart details on success, error message on failure.

2. #### `/cart/add` [POST]

- Description - add item and quanity to cart
- Requires - `[action: <string>, quantity: <number>]`  `(productId, quantity of product)` - body
- Returns - updated cart on success, error message on failure.

3. #### `/cart/remove` [POST]

- Description - remove item from cart
- Requires - `[id: <string>]` `(productId)` - body
- Returns - updated cart on success, error message on failure.

4. #### `/cart/quantity/:productId` [PATCH]

- Description - increment/decrement product quantity in cart
- Requires - `[action: <string>]` `(action = "increment/decrement")` - body
- Returns - updated cart on success, error message on failure.

<br/>

> ### Address

1. #### `/address` [GET]

- Description - get all user address
- Requires - NA
- Returns - array of address object on success, error message on failure.

2. #### `/address` [POST]

- Description - add address
- Requires - `[name: <string>, area: <string>, city: <string>, state: <string>, pinCode: <string>, mobile: <string>, addressType: <string>]`
- Returns - newly added address object info on success, error message on failure.

3. #### `/address/:addressId` [PUT]

- Description - update address
- Requires - `[name: <string>, area: <string>, city: <string>, state: <string>, pinCode: <string>, mobile: <string>, addressType: <string>]`
- Returns - updated address object on success, error message on failure.

4. #### `/address/:addressId` [DELETE]

- Description - delete address
- Requires - NA
- Returns - delete address id on success, error message on failure.

<br/>

> ### Payment

1. #### `/pay` [GET]

- Description - get stripe checkout session url
- Requires - `[order: <Array> , userEmail : <string> }]`
- Returns - user info on success, error message on failure.

-- Note - order - array of products with quantity, price, image

2. #### `/webhook` [POST]

- Description - stripe calls this api after checkout session is completed - cart is cleared and order saved in DB if payment successful.

<br/>

> ### Order

1. #### `/order` [GET]

- Description - get user orders
- Requires - NA
- Returns - array of order objects on success, error message on failure.

