import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export function authenticationGuard() {
  return () => inject(AuthService).isLoggedIn
}