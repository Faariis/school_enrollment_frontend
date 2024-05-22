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
        console.log("Poslao: " + email + " pass: " + password);

        try {
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

          if (!res.ok) {
            throw new Error('Authentication failed.');
          }

          const response = await res.json();
          const jwt = response.access;
          console.log("Dobio: " + jwt);
          const { user_id } = parseJwt(jwt);

          let user = {};
          
          try {
            const userResp = await fetch(`${Url}api/teachers/teacher/` + user_id + `/`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${jwt}`
              }
            });
            
            if (!userResp.ok) {
              throw new Error('Fetching user data failed.');
            }

            user = await userResp.json();
          } catch (e) {
            console.error(e);
          }

          if (!user.is_verified) {
            throw new Error('Korisnik nije verifikovan.');
          }
          
          user.token = jwt;
          user.role = user.is_superuser ? "admin" : "user";
          
          return user;
        } catch (error) {
          console.error(error);
          return null;
        }
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
