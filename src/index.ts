import "reflect-metadata";



// app
import './app/app';

// components (FYI, order of these represents order in which they will appear... For now)
import { CabinetLoaderComponent } from "./components/cabinet-loader/cabinet-loader.component";
import { ImageContentRepresentationComponent } from "./components/content-representation/image-content/image-content-representation.component";
import { ImageTextRepresentationComponent } from "./components/content-representation/image-text/image-text-representation.component";
import { JsonContentRepresentationComponent } from "./components/content-representation/json/json-content-representation.component";
import { TextContentRepresentationComponent } from "./components/content-representation/text/text-content-representation.component";
import { PastaDrawerComponent } from "./components/pasta-drawer-app/pasta-drawer.component";
import { HtmlClipboardRepresentation } from "./components/content-representation/html-representation/html-clipboard-representation.component";
// import { WebpageRepresentationComponent } from "./components/content-representation/webpage/webpage-representation.component";

CabinetLoaderComponent;
PastaDrawerComponent;
TextContentRepresentationComponent;
JsonContentRepresentationComponent;
ImageContentRepresentationComponent;
ImageTextRepresentationComponent;
HtmlClipboardRepresentation;
// WebpageRepresentationComponent; // WIP

