import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserService } from './user.service';

@NgModule({
  imports: [CommonModule],
  providers: [UserService],
})
export class UserModule {}
