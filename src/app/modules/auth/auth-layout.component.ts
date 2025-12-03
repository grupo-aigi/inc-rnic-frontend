
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth',
  imports: [RouterOutlet],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayout {}
