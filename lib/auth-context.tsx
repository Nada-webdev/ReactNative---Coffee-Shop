import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "appwrite"; 
import { account } from "./appwriteConfig";

//starting with types 
type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoadingUser: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;  //null:there is no err  string:we return err msg
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>; //in signOut we are not returning  any err msg to user
};

//the context will allow the share of the data in componants without passing props 
const AuthContext = createContext<AuthContextType | undefined>(undefined);



//Building the logique of signUp,signIn, and signOut using appwrite functions calls
//like :.create .createSession  .deleteSession ....
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const session = await account.get(); //account. we are using the one created in appwrite.ts and accessing the functions given by appwrite
      setUser(session); //assign session to user
    } catch (error) {
      if (error instanceof Error) {
        console.log("No active session or invalid token:", error.message);
      } else {
        console.log("Unknown error:", error);
      }
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password); //creating account
      await signIn(email, password); //if user is sign up we are making the sign in auto
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured during signup";
    }
  };
  const signIn = async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password); //creating session 
      const session = await account.get();
      setUser(session);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }

      return "An error occured during sign in";
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession("current"); //delete session 
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    //provider is giving all its children access to the authentication logic and state
    <AuthContext.Provider
      value={{ user, isLoadingUser, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}


//later we gonna use this hook (signIn,signUp) in auth.tsx
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be inside of the AuthProvider");
  }

  return context;
}
