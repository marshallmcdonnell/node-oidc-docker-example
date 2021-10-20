const express = require('express');
const { Provider } = require('oidc-provider');
const path = require('path');

const app = express();

//Middleware
app.use(express.static(__dirname + '/public'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const configuration = {
    clients: [{
        client_id: "oidcCLIENT",
        client_secret: "client_super_secret",
        grant_types: ["authorization_code"],
        redirect_uris: ["http://localhost:8081/login/callback","https://oidcdebugger.com/debug"],
        response_type: ["code,"],
    }],
    pkce: {
        required: () => false,
    },
};

const oidc = new Provider('http://localhost:8080', configuration);

app.use("/oidc", oidc.callback());

oidc.listen(8080, () => {
    console.log('oidc-provider listening on port 8080, check http://localhost:8080/.well-known/openid-configuration')
});

