import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupUrl = "http://localhost:8000/auth/signup";

  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm_password: string;

  constructor(public router: Router) { }

  ngOnInit(): void { }

  submitSignUpForm() {
    let user = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
    }
    if (user.password == this.confirm_password) {
      fetch(this.signupUrl, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'content-type': "application/json"
        }
      }).then((response) => {
        if (response.ok) {
          return response.json()
        }
        return response.json().then((error) => {
          throw new Error(error.message)
        })
      }).then((result) => {
        localStorage.setItem('token', result.token)
        this.router.navigate(['/dashboard'])
      }).catch((error) => {
        console.log(error)
      })
    }
    else {
      return
      alert("password does not match")
    }
  }

}
