import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { CodeRedirectComponent } from './components/code-redirect/code-redirect.component';
import { CommonModule } from '@angular/common';
import { JwtService } from './jwt.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [CommonModule],
  providers: [
    JwtService,
    AuthInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  declarations: [CodeRedirectComponent],
})
export class AuthModule {}
