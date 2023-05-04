import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { CodeRedirectComponent } from './components/code-redirect/code-redirect.component';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user/user.module';
import { JwtService } from './jwt.service';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  imports: [CommonModule],
  providers: [AuthService, JwtService, AuthInterceptorService],
  declarations: [CodeRedirectComponent],
})
export class AuthModule {}
