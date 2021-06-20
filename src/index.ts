import "reflect-metadata";
import { container } from "tsyringe";

// Register representations that use the generic base
// TODO GenericRepresentationComponent needs to have a factory instead of this approach of being the orchestrator and the component
container.register('ContentRepresentation', { useValue: new GenericRepresentationComponent(null!, new Base64Representation(), () => new Base64Representation()) });

// app
import './app/app';

// components (FYI, order of these represents order in which they will appear... For now)
import { HtmlClipboardRepresentation } from "./components/content-representation/html-representation/html-clipboard-representation.component";
import { CabinetLoaderComponent } from "./components/cabinet-loader/cabinet-loader.component";
import { ImageContentRepresentationComponent } from "./components/content-representation/image-content/image-content-representation.component";
import { ImageTextRepresentationComponent } from "./components/content-representation/image-text/image-text-representation.component";
import { JsonContentRepresentationComponent } from "./components/content-representation/json/json-content-representation.component";
import { TextContentRepresentationComponent } from "./components/content-representation/text/text-content-representation.component";
import { PastaDrawerComponent } from "./components/pasta-drawer-app/pasta-drawer.component";
import { WebpageRepresentationComponent } from "./components/content-representation/webpage/webpage-representation.component";
import { GenericRepresentationComponent } from "./components/generic-representation/generic-representation.component";
import { Base64Representation } from "./representations/base64-representation";


HtmlClipboardRepresentation;
CabinetLoaderComponent;
PastaDrawerComponent;
TextContentRepresentationComponent;
JsonContentRepresentationComponent;
ImageContentRepresentationComponent;
ImageTextRepresentationComponent;
WebpageRepresentationComponent; // WIP

