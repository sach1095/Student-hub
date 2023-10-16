import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '../models/users';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate {
  public user?: User | null;

  constructor(private router: Router, private userService: UserService) {}

  private async fetchLoggedUser() {
    this.user = await firstValueFrom(this.userService.getLoggedUser());
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const isInitCompleted = await firstValueFrom(this.userService.isInitCompleted$);
    if (!isInitCompleted) {
      // Vous pourriez vouloir rediriger vers une page de chargement ou maintenir l'utilisateur sur la même page jusqu'à ce que l'initialisation soit terminée
      return false;
    }

    await this.fetchLoggedUser();
    const isLoggedIn = this.user ? true : false;
    if (!isLoggedIn) this.router.navigate(['/login']);
    return true;
  }
}
