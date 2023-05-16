import { NgModule } from '@angular/core';
import { CodeRedirectComponent } from './components/code-redirect/code-redirect.component';
import { CommonModule } from '@angular/common';
import { JwtService } from './jwt.service';
import { AuthInterceptorService } from './auth-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthRedirectComponent } from './components/auth-redirect/auth-redirect.component';

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
