import {
  Component,
  ViewChild,
  ElementRef,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import H from "@here/maps-api-for-javascript";
import onResize from "simple-element-resize-detector";
import { API_KEY, DEFAULT_POSITION, DEFAULT_ZOOM } from "../contacts/constants";

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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class JsmapComponent {
  /*  private map?: H.Map;
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
  } */

  @ViewChild("locator") locatorRef!: ElementRef;
  API_KEY_GOOGLE_MAP = "AIzaSyAw4byy1Evhmvxd7UU1sEJBapcDw60PFVs"
  private CONFIGURATION = {
    locations: [
      {
        title: "Автосервиз ТТ Авто Бургас",
        address1: "Southern Industrial Zone",
        address2: 'ul. "Industrialna" 5, 8002 Burgas, Bulgaria',
        coords: { lat: 42.48962415831665, lng: 27.453727335581956 },
        placeId: "ChIJfWqBMMGVpkARCXTa2ufVueo",
      },
    ],
    mapOptions: {
      center: { lat: 38.0, lng: -100.0 },
      fullscreenControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      zoom: 4,
      zoomControl: true,
      maxZoom: 17,
      mapId: "DEMO_MAP_ID",
    },
    mapsApiKey: this.API_KEY_GOOGLE_MAP,
    capabilities: {
      input: false,
      autocomplete: false,
      directions: false,
      distanceMatrix: false,
      details: false,
      actions: false,
    },
  };

  async ngAfterViewInit() {
    await customElements.whenDefined("gmpx-store-locator");
    const locator = this.locatorRef.nativeElement as any;
    locator.configureFromQuickBuilder(this.CONFIGURATION);
  }
}
