import { Component, OnInit } from "@angular/core";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  constructor(private dataService: DataService) {}

  async ngOnInit() {
    // TODO
    const weight = await this.dataService.getWeight();
    console.log("WEIGHT:", weight);
  }
}
