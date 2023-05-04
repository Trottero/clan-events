import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { CodeRedirectComponent } from './components/code-redirect/code-redirect.component';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user/user.module';
import { JwtService } from './jwt.service';

@NgModule({
  imports: [CommonModule],
  providers: [AuthService, JwtService],
  declarations: [CodeRedirectComponent],
})
export class AuthModule {}
