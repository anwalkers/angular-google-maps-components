import { NgModule, Inject } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { MapModule } from "./map/map.module";

import { BROWSER_GLOBALS_PROVIDERS } from './utilities/browser-global';

@NgModule({
  imports: [BrowserModule, FormsModule, MapModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [...BROWSER_GLOBALS_PROVIDERS]
})
export class AppModule {}
