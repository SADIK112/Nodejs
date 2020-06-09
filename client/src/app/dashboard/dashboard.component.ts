import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  API_URL = "http://localhost:8000/";

  user: any = {};
  title: string;
  message: string;

  constructor(public router: Router) { 
    this.getNotes()
  }

  ngOnInit(): void {

    const token = localStorage.getItem('token')

    fetch(this.API_URL, {
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(result => {
        console.log(result)
        if (result.user) {
          this.user = result.user
        }
        else {
          localStorage.removeItem('token');
          this.router.navigate(['/login'])
        }
      })
  }

  submitForm() {
    let notes = {
      title: this.title,
      message: this.message
    }

    const token = localStorage.getItem('token')

    fetch(`${this.API_URL}api/v1/notes`, {
      method: "post",
      body: JSON.stringify(notes),
      headers: {
        'content-type': "application/json",
        authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(note => console.log(note))
  }

  getNotes() {
    const token = localStorage.getItem('token')

    fetch(`${this.API_URL}api/v1/notes`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(notes => console.log(notes))
  }

}
