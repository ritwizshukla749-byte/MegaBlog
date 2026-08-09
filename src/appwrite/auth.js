import conf from "../conf/conf";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  //Account Creation
  async createAccount({ email, password, name }) {
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name,
    );

    if (userAccount) {
      //Call another method
      return this.login({ email, password });
    } else {
      return userAccount;
    }
  }

  //Login
  async login({ email, password }) {
    return await this.account.createEmailPasswordSession(email, password);
  }

  //Get Current User
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // 401 = no active session — an expected state when logged out.
      if (error?.code !== 401) {
        console.error("Appwrite service :: getCurrentUser :: error", error);
      }
    }

    return null;
  }


  //Logout
  async logout() {
    return await this.account.deleteSessions();
  }
}

const authService = new AuthService();

export default authService;
