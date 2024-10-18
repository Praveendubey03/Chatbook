

const development = {
    name: 'development',
    asset_path: 'assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'alchemy.cn18',
            pass: 'codingninjas'
        }
    },
    google_client_id: "276251860270-4bscv6dngkrsefock6dd6calusbc4683.apps.googleusercontent.com",
    google_client_secret: "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",
    google_callback_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'secret',

}

const production = {
    name: 'production'
}

module.exports = development;