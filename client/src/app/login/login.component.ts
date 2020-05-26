import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinUrl = "http://localhost:8000/auth/login"
  email: string;
  password: any;
  loginIn: boolean;
  returnUrl: string;
  errorMessage: string = "";

  constructor(public router: Router, public route: ActivatedRoute) {
    this.route.queryParams
      .subscribe(params => {
        this.returnUrl = params['return'] || '/forums'
      })

  }

  ngOnInit(): void { }

  submitLoginForm() {
    let user = {
      email: this.email,
      password: this.password
    }

    fetch(this.signinUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(user)
    }).then(response => {
      
      if (response.ok) {
        return response.json()
      }
      return response.json().then((error) => {
        throw new Error(error.message)
      })

    }).then((result) => {
      localStorage.setItem('token', result.token)

      setTimeout(() => {
        this.loginIn = false;
        console.log(result)
        this.router.navigateByUrl(this.returnUrl)
      }, 1000);

    }).catch((error) => {

      setTimeout(() => {
        this.loginIn = false;
        this.errorMessage = error.message;
        console.log(this.errorMessage)
      }, 1000);

    })
  }


}
