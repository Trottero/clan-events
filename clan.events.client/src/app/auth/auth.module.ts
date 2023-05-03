import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { CodeRedirectComponent } from './components/code-redirect/code-redirect.component';
import { CommonModule } from '@angular/common';
import { UserModule } from '../user/user.module';

@NgModule({
  imports: [CommonModule, UserModule],
  providers: [AuthService],
  declarations: [CodeRedirectComponent],
})
export class AuthModule {}
