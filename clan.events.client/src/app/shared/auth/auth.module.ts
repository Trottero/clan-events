import { NgModule } from '@angular/core';
import { CodeRedirectComponent } from './modules/code-redirect/code-redirect.component';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthRedirectComponent } from './modules/auth-redirect/auth-redirect.component';
import { JwtService } from './jwt.service';

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
  declarations: [CodeRedirectComponent, AuthRedirectComponent],
  exports: [AuthRedirectComponent],
})
export class AuthModule {}
