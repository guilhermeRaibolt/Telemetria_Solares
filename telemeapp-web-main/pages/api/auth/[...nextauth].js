import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const valid_emails = [
    "estevaons.gt@gmail.com",
    "guigoes8@gmail.com",
    "giselle18sp@gmail.com",
    "andreoliveiracunha20@gmail.com",
    "projetosolaresufes@gmail.com",
    "joaoagriciolopes@gmail.com",
    "fernandorr1108@gmail.com"
]

const options = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn(user, account, profile) {
          if (account.provider === 'google' 
            && profile.verified_email === true &&
            valid_emails.includes(profile.email)) {
            return true;
          } else {
            return false
          }
        },
    }


}


export default (req, res) => NextAuth(req, res, options)