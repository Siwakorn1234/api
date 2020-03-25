# FumerAPI

## Postman

POST http://localhost:3000/api/Bisection-Method/  
BODY -> RAW -> JSON

```JSON
{
    "eq":"e^(-x/4)*(2-x)-1",
    "xl":"0",
    "xr":"1"
}
```

## Docker

```sh
docker build -t pee-numer-api .
```

```sh
docker run -dit --name FumerAPI -p 3001:3000 -v "${pwd}:/app" pee-numer-api
```
