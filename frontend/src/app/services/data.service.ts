import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

const apiURL = "https://yab7fojaja.execute-api.us-east-1.amazonaws.com/dev/";

@Injectable({
  providedIn: "root",
})
export class DataService {
  constructor(private httpClient: HttpClient) {}

  // TODO
  public getData(operatorAddress: string = ""): Observable<any[]> {
    return this.httpClient.get<any[]>(apiURL).pipe(tap(x => console.log(x)));
  }
}
