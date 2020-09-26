import { Component, HostListener, OnInit } from "@angular/core";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"],
})
export class PageNotFoundComponent implements OnInit {
  public innerWidth: number;
  public innerHeigth: number;
  public mouseX: number;
  public mouseY: number;
  public xAxis: number;
  public yAxis: number;

  constructor() {}

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.innerHeigth = window.innerHeight;
    this.mouseY = this.yAxis = 0;
    this.mouseX = this.xAxis = 0;
  }

  @HostListener("document:mousemove", ["$event"])
  onMouseMove(event) {
    this.mouseY = event.pageY;
    this.mouseX = event.pageX / -this.innerWidth;
    this.yAxis = ((this.innerHeigth / 2 - this.mouseY) / this.innerHeigth) * 300;
    this.xAxis = -this.mouseX * 100 - 100;
  }
}
