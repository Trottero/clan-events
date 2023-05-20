import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';

@NgModule({
  imports: [CommonModule, AuthModule],
  providers: [UserService],
})
export class UserModule {}
