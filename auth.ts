import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';
import {
    betterAuth
} from 'better-auth';
import { classicNameResolver } from 'typescript';




const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require'});

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User[]>`Select * from users where email = ${email}`;
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user');
    }
}


export const { auth, signIn, signOut} = NextAuth({...authConfig,
    providers: [Credentials({
        async authorize(credentials) {
            const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6)}).safeParse(credentials);


            if(parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;

                const user = await getUser(email);
                if(!user) return null;
                const passwordMatch = await bcrypt.compare(password, user.password);
                if(passwordMatch) return user;
            }
            console.log('Invalid credentials provided.');

            return null;
        },
    }),
],
});


//better-auth setup
// export const auth1 = betterAuth({
//     emailAndPassword: {
//         enabled: true,
//         async sendResetPassword(data,request) {}
//     },
// },
// socialProviders: {
//     google: {
//         clientId: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!
//     },
//     github: {
//         clientID: process.env.GITHUB_CLIENT_ID!,
//         clientSecret: process.env.GITHUB_CLIENT_SECRET!
//     }
//     linkedin: {
//         clientId: process.env.LINKEDIN_CLIENT_ID!,
//         clientSecret: process.env.LINKEDIN_CLIENT_SECRET!
//     }
// },

// ));