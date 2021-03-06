import "reflect-metadata";
import { container } from "tsyringe";

// Register representations that use the generic base
// TODO GenericRepresentationComponent needs to have a factory instead of this approach of being the orchestrator and the component
// TODO put these in a separate file for dependency injection
container.register('ContentRepresentation', { useValue: new GenericRepresentationComponent(null!, new Base64Representation(), () => new Base64Representation()) });
container.register('ContentRepresentation', { useValue: new GenericRepresentationComponent(null!, new WebpageRepresentationComponent(container.resolve(LinkPreviewService)), () => new WebpageRepresentationComponent(container.resolve(LinkPreviewService))) });

// Import pasta type providers
// TODO get rid of?
import { JsonPastaTypeProvider } from "./providers/pasta-type-providers/json-pasta-type.provider";
import { Base64PastaTypeProvider } from "./providers/pasta-type-providers/base64-pasta-type.provider";
import { LinkPastaTypeProvider } from "./providers/pasta-type-providers/link-pasta-type.provider";

JsonPastaTypeProvider;
Base64PastaTypeProvider;
LinkPastaTypeProvider;


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
import { GenericRepresentationComponent } from "./components/generic-representation/generic-representation.component";
import { Base64Representation } from "./representations/base64-representation";
import { WebpageRepresentationComponent } from "./components/content-representation/webpage/webpage-representation.component"
import { LinkPreviewService } from "./services/link-preview/link-preview.service";




HtmlClipboardRepresentation;
CabinetLoaderComponent;
PastaDrawerComponent;
TextContentRepresentationComponent;
JsonContentRepresentationComponent;
ImageContentRepresentationComponent;
ImageTextRepresentationComponent;
WebpageRepresentationComponent; // WIP
