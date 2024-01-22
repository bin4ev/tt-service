import {
  Component,
  ViewChild,
  ElementRef,
} from "@angular/core";
import H from "@here/maps-api-for-javascript";
import onResize from "simple-element-resize-detector";

const API_KEY = "xJNiolYoXS5cgxyqRubcBAb0g5orfnwYi9J0FUPHnNA";
const DEFAULT_ZOOM = 16;
const DEFAULT_POSITION = { lat: 42.49027206029531, lng: 27.45525035767127 } as const;
const landmarks = [
  {
    name: "TT-AUTO-88",
    lat: 42.4897761,
    lng: 27.4546318,
    label: "tt-service",
  },
];

@Component({
  selector: "app-jsmap",
  templateUrl: "./jsmap.component.html",
  styleUrls: ["./jsmap.component.scss"],
  standalone: true,
})
export class JsmapComponent {
  private map?: H.Map;
  initialMapOptions = {
    pixelRatio: window.devicePixelRatio,
    zoom: DEFAULT_ZOOM,
    center: DEFAULT_POSITION,
  }

  @ViewChild("map") mapDiv?: ElementRef;

  ngAfterViewInit(): void {
    if (!this.map && this.mapDiv) {
      const platform = new H.service.Platform({
        apikey: API_KEY,
      });

      const layers = platform.createDefaultLayers();
      const map = new H.Map(
        this.mapDiv.nativeElement,
        (layers as any).vector.normal.map,
        this.initialMapOptions
      );

      onResize(this.mapDiv.nativeElement, () => map.getViewPort().resize());
      this.map = map;
      this.setLandmarks();
      map.addEventListener("mapviewchange",  (ev: H.map.ChangeEvent) => this._handleMapChange(ev));
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    }
  }

  setLandmarks() {
    landmarks.forEach((landmark) => {
      // For each marker, select the icon based on the corresponding landmark label:
      const icon = new H.map.Icon(
        "/assets/images/marker/marker-" + landmark.label + ".jpg",
        // Adjust the marker size to your needs:
        { size: { w: 60, h: 60 } }
      );
      const marker = new H.map.Marker(
        { lat: landmark.lat, lng: landmark.lng },
        { data: landmark.name, icon: icon }
      );
      this.map?.addObject(marker);
    });
  }

  _handleMapChange(event: H.map.ChangeEvent) {
    if (event.newValue.lookAt) {
      const lookAt = event.newValue.lookAt;
      this.map?.setZoom(lookAt.zoom);
      this.map?.setCenter({
        lat: lookAt.position.lat,
        lng: lookAt.position.lng,
      });
    }
  }
}
