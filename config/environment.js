

const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: 'CJ99vRY5DpvYOIN0uHDjMbnCqvHX8ZwH',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'codeial498@gmail.com',
            pass: 'wgpy nqpr bxuk numv'
        }
    },
    google_client_id: "276251860270-4bscv6dngkrsefock6dd6calusbc4683.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'qk9Jo2uiSakQsKsQUXjxB0IB9b7mbzX6',

}

const production = {
    name: process.env.CODEIAL_ENVIRONMENT,
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_callback_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.CODEIAL_JWT_SECRET,

}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);