import { Injectable, NgZone, inject } from "@angular/core";
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subject, from, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  UserData?: User;
  isLogedInSubject = new Subject<boolean>();
  isLogedIn$ = this.isLogedInSubject.asObservable();

  private auth = inject(Auth);
  private router = inject(Router);
  public ngZone = inject(NgZone);

  constructor() {
    onAuthStateChanged(this.auth, (user: any) => {
      if (user) {
        this.UserData = user;
        localStorage.setItem("user", JSON.stringify(this.UserData));
        JSON.parse(localStorage.getItem("user")!);
        this.isLogedInSubject.next(true);
      } else {
        localStorage.setItem("user", "null");
        JSON.parse(localStorage.getItem("user")!);
        this.isLogedInSubject.next(false);
      }
    });
  }

  //get User
  //get Authenticated user from firebase
  getAuthFire() {
    return this.auth.currentUser;
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  //get Authenticated user from Local Storage
  getAuthLocal() {
    const token = localStorage.getItem("user");
    const user = JSON.parse(token as string);
    return user;
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem("user");
    const user = JSON.parse(token as string);
    return user !== null ? true : false;
  }

  async register(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.UserData = result.user;
      this.ngZone.run(() => {
        /* Call the SendVerificaitonMail() function when new user sign
       up and returns promise */
        /* this.sendEmailVerification(); */
        this.router.navigate(["/home"]);
      });
    } catch (error) {
      window.alert(error);
    }
  }

  login(email: string, password: string) {
    /* try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      this.UserData = result.user;

      this.ngZone.run(() => {
        this.isLogedInSubject.next(true);
        this.router.navigate(["/home"]);
      });
    } catch (error) {
      window.alert(error);
    } */

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((userCreden) => {
        this.UserData = userCreden.user;
        this.ngZone.run(() => {
          this.isLogedInSubject.next(true);
          this.router.navigate(["/home"]);
        });
      })
    );
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(["/login"]);
    });
  }

  async sendPasswordResetEmails(email: string) {
    try {
      const result = await sendPasswordResetEmail(this.auth, email);
      window.alert("Password reset email sent, check your inbox.");
    } catch (error) {
      window.alert(error);
    }
  }

  sendEmailVerification(): void {
    return this.sendEmailVerification();
  }
}
