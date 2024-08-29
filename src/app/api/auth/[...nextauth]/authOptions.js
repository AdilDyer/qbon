import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  // callbacks: {
  //   async session({ session, token, user }) {
  //     // Attach admin status to the session for multiple admins
  //     session.user.isAdmin = process.env.ADMIN_EMAIL.split(",").includes(
  //       session.user.email
  //     );
  //     return session;
  //   },
  // },
  callbacks: {
    async session({ session }) {
      // Attach admin status to the session
      session.user.isAdmin = session.user.email === process.env.ADMIN_EMAIL;
      return session;
    },
  },
};
