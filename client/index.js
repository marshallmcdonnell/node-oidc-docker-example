const express       = require('express');
const session       = require('express-session');
const cookieParser  = require('cookie-parser');
const helmet        = require('helmet');
const passport      = require('passport');
const http          = require('http');
const path          = require('path');

const { Issuer, Strategy } = require('openid-client');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json({ limit: '15mb' }));
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
    })
);

app.use(helmet());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(
    (user, done) => {
        console.log('---------------------');
        console.log('serialize user');
        console.log(user);
        console.log('---------------------');
        done(null, user);
    }
);

passport.deserializeUser(
    (user, done) => {
        console.log('---------------------');
        console.log('deserialize user');
        console.log(user);
        console.log('---------------------');
        done(null, user);
    }
);

try {
    Issuer.discover('http://localhost:8080').then(
        (oidcIssuer) => {
            console.log('Discovered issuer %s %O', oidcIssuer.issuer, oidcIssuer.metadata);
            var client = new oidcIssuer.Client({
                client_id: 'oidcCLIENT',
                client_secret: 'client_super_secret',
                redirect_uris: ["http://localhost:8081/login/callback"],
                response_types: ['code'],
            });

            passport.use(
                'oidc',
                new Strategy(
                    { client, passReqToCallback: true},
                    (req, tokenSet, userinfo, done) => {
                        console.log("tokenSet", tokenSet);
                        console.log("userinfo", userinfo);
                        req.session.tokenSet = tokenSet;
                        req.session.userinfo = userinfo;
                        return done(null, tokenSet.claims());
                    }
                )
            );
        }
    );
} catch (e) {
    console.log("error", e.message);
}

app.get(
    '/login', (req, res, next) => {
        console.log('---------------------');
        console.log('Login Handler Started');
        next();
    },
    passport.authenticate('oidc',{scope:"openid"})
);

app.get(
    '/login/callback',
    (req, res, next) => {
        console.log('next', next);
        passport.authenticate(
            'oidc',
            { successRedirect: '/user', failureRedirect: '/'}
        )(req, res, next)
    }
);

app.get(
    "/", (req, res) => {
        res.send(" <a href='/login'>Log In with OAuth 2.0 Provider </a>")
    }
);

app.get(
    "/user", (req, res) => {
        res.header("Content-Type", 'application-json');
        res.end(
            JSON.stringify(
                {
                    tokenset: req.session.tokenSet,
                    userinfo: req.session.userinfo
                },
                null,
                2
            )
        )
    }
);

const httpServer = http.createServer(app);
httpServer.listen(8081, () => {
    console.log('Http Server running on port 8081')
});


