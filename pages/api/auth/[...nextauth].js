
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import parseJwt from '../../../src/lib/parseJwt';
import Url from "../../../constants";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const res = await fetch(`${Url}api/teachers/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const response = await res.json();
        const jwt = response.access;
        const { user_id } = parseJwt(jwt)
        let user = {};

        try {
          const userResp = await fetch(`${Url}api/teachers/teacher/` + user_id + `/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          })
          user = await userResp.json();
        } catch (e) {
          console.log(e)
        }
        // Here we are checking if the user is verified;
        if(!user.is_verified) {
          throw new Error('Korisnik nije verifikovan.');
        }
        user.token = jwt;
        if(user.is_superuser){
          user.role = "admin"
        } else {
          user.role = "user"
        }
        if (res.ok && user) {
          return user;
        } else return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
