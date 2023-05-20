import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthRedirectComponent } from './auth/modules/auth-redirect/auth-redirect.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, UserModule, AuthModule],
  exports: [AuthRedirectComponent],
})
export class SharedModule {}
