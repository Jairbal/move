# move-mqtt

## `agent/connected`

``` js
{
    agent: {
        uuid, // auto generar
        username, // difinir por configuracion
        name, // definir por configuracion
        hostname, // obtener del sistema operativo
        pid // obtener el proceso
    }
}
```

## `agent/disconnected`

``` js
{
    agent: {
        uuid
    }
}
```

## `agent/messages`

``` js
{
    agent,
    metrics: [
        {
            type,
            value
        }
    ],
    timestamp // generar cuando creamos el mensaje
}
```