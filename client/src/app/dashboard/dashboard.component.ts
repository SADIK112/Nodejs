import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  API_URL = "http://localhost:8000/";
  user: any = {}

  constructor(public router: Router) { }

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

}
