import debug from "@/debug";
import type {
  boundingBox,
  bounds,
  coords,
  merchant_map_result,
} from "@/interfaces";
import type { LoaderOptions } from "google-maps";
import { Loader } from "google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import merchant_map_client_instance from "@/merchant-map-client";
import { selectedId } from "./globals";
import "./useGeoIp"
import { useGeoIp } from "./useGeoIp";

class googleMapsHelper {
  isReady = false;

  elementMapWrapper: HTMLElement | null = null;
  elementMap: HTMLElement | null = null;
  mapPopups: HTMLElement | null = null;

  buttonZoomOut: Element | null = null;
  buttonZoomIn: Element | null = null;
  buttonLocation: Element | null = null;

  options: LoaderOptions = {
    libraries: ["geometry", "places"],
  };
  loader: Loader = new Loader(
    import.meta.env.VITE_GOOGLE_MAP_KEY,
    this.options
  );
  google: any; // todo type
  mapInstance: any; // todo type
  zoom = 6;
  center: coords = {
    lat: 47.8312596,
    lng: 12.8510535,
  };
  bounds: bounds = {
    Ra: {
      hi: 0,
      lo: 0,
    },
    ub: {
      hi: 0,
      lo: 0,
    },
  };
  boundingBox: boundingBox = {
    swLng: null,
    swLat: null,
    neLng: null,
    neLat: null,
  };
  markers: any[] = []; // todo type
  popups: any[] = []; // todo type
  markersUnclustered: any[] = [];
  cluster: any = null; // todo
  getBoundsTimeout: any = null; // todo type
  mapInteraction = false;

  async init() {
    if (this.elementMapWrapper == null) {
      debug("maps helper init: elementMapWrapper is null");
      return false;
    }

    if (this.elementMap == null) {
      debug("maps helper init: elementMap is null");
      return false;
    }

    this.buttonZoomOut =
      this.elementMapWrapper.querySelector(".button.zoom.out");
    this.buttonZoomIn = this.elementMapWrapper.querySelector(".button.zoom.in");
    this.buttonLocation =
      this.elementMapWrapper.querySelector(".button.location");

    // init google maps
    this.loader.load().then((google) => {
      this.google = google;

      // create a maps instance
      this.mapInstance = new this.google.maps.Map(this.elementMap, {
        center: this.center,
        zoom: this.zoom,
        disableDefaultUI: true,
        mapId: import.meta.env.VITE_GOOGLE_MAP_ID,
      });

      // get the location from nimiq
      useGeoIp().locate().then((location) => {
        if (location.location){
          this.center = {
            lat: location.location.latitude,
            lng: location.location.longitude,
          };
  
          this.zoom = 7;

          // set the location
          this.mapInstance.setCenter(this.center);
          this.mapInstance.setZoom(this.zoom); // calls getBounds()

          this.initCluster();
          this.initEvents();
        }
      }).catch((err) => {
        debug(err);

        // continue init with the fallback location
        this.initCluster();
        this.initEvents();
      });
    }).catch((err) => {
      debug(err);
    });
  }

  initEvents() {
    this.google.maps.event.addListenerOnce(this.mapInstance, "idle", () => {
      debug("map: ready");
      this.isReady = true;
      this.getBounds();
    });

    this.google.maps.event.addListener(this.mapInstance, "idle", () => {
      debug("map: idle event");
      this.refreshCluster();
    });

    /* 
      bounds_changed fires too often
      using dragend / zoom_changed instead that fires when the interaction is done
    */
    this.google.maps.event.addListener(this.mapInstance, "dragend", () => {
      debug("map: dragged");
      this.getBounds();
    });

    this.google.maps.event.addListener(this.mapInstance, "zoom_changed", () => {
      debug(`map: zoomed to ${this.mapInstance.getZoom()}`);
      this.getBounds();
    });

    /* 
      Button Events
    */
    this.buttonZoomOut?.addEventListener("click", () => {
      const zoomLevel = this.mapInstance.getZoom();
      if (zoomLevel) this.mapInstance.setZoom(zoomLevel! - 1);
    });

    this.buttonZoomIn?.addEventListener("click", () => {
      const zoomLevel = this.mapInstance.getZoom();
      if (zoomLevel) this.mapInstance.setZoom(zoomLevel! + 1);
    });

    this.buttonLocation?.addEventListener("click", () => {
      this.getLocation();
    });

    window.addEventListener("resize", this.resizing);
    this.resizing();
  }

  resizing() {
    // nothing to do here atm
    // just in case
  }

  initCluster() {
    this.cluster = new MarkerClusterer({
      // https://www.npmjs.com/package/@googlemaps/markerclusterer
      // https://github.com/googlemaps/js-markerclusterer/blob/main/src/markerclusterer.ts
      //
      // todo, fine grain the cluster algorithm, currently too narrow
      // https://googlemaps.github.io/js-markerclusterer/interfaces/MarkerClustererOptions.html
      // https://googlemaps.github.io/js-markerclusterer/public/algorithms/
      map: this.mapInstance,
    });
  }

  /* 
    check if a coord is within a bounding box
  */
 isWithinBoundingBox(
  coords: coords,
  boundingBox: boundingBox = this.boundingBox
){
  if (!boundingBox || !coords){
    debug(['isWithinBoundingBox', 'no boundingBox or coords given']);
    return false;
  }

  if (
    !boundingBox.swLng ||
    !boundingBox.neLng ||
    !boundingBox.swLat ||
    !boundingBox.neLat
  ) {
    debug(['isWithinBoundingBox', 'boundingBox incomplete']);
    return false;
  }

  if (
    !coords.lng ||
    !coords.lat
  ) {
    debug(['isWithinBoundingBox', 'coords incomplete']);
    return false;
  }

  if(
    boundingBox.swLng <= coords.lng &&
    coords.lng <= boundingBox.neLng &&
    boundingBox.swLat <= coords.lat &&
    coords.lat <= boundingBox.neLat
  ) {
    return true;
  }

  return false;
 }

  /* 
    gets the current viewport of the map
  */
  getBounds() {
    this.mapInteraction = true;

    if (this.mapInteraction) {
      clearTimeout(this.getBoundsTimeout);

      this.getBoundsTimeout = setTimeout(() => {
        this.bounds = this.mapInstance.getBounds();

        this.boundingBox = {
          swLng: this.bounds.getSouthWest().lng(),
          swLat: this.bounds.getSouthWest().lat(),
          neLng: this.bounds.getNorthEast().lng(),
          neLat: this.bounds.getNorthEast().lat(),
        };

        debug(['current boundings', JSON.stringify(this.boundingBox)]);

        merchant_map_client_instance.getResults();

        this.mapInteraction = false;
      }, 400);
    }
  }

  /* 
    sets the map to a specific location and zooms in
  */
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLatLng: coords = new this.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.mapInstance.setCenter(currentLatLng);
        this.mapInstance.setZoom(15); // calls getBounds()
      });
    }
  }

  resetMarkers() {
    this.resetPopups();

    this.cluster.clearMarkers();

    for (const key in this.markers) {
      if (Object.prototype.hasOwnProperty.call(this.markers, key)) {
        this.markers[key].setMap(null);
      }
    }

    this.markers = [];
  }

  resetPopups() {
    for (const key in this.popups) {
      if (Object.prototype.hasOwnProperty.call(this.popups, key)) {
        this.popups[key].setMap(null);
      }
    }

    this.popups = [];
  }

  setMarkerSingle(
    coordinates: number[],
    parentId: number,
    childId: number,
    type: string,
    title: string
  ) {
    const currentMarker = new this.google.maps.Marker({
      position: {
        lat: coordinates[1],
        lng: coordinates[0],
      },
      map: this.mapInstance,
      parentId: `${parentId}`,
      childId: `${childId}`,
      title: title,
      type: type,
      clickable: true,
      opacity: 0,
    });

    this.markers.push(currentMarker);
  }

  renderMarkers(resultSet: merchant_map_result) {
    this.resetMarkers();

    if (resultSet.data.length > 0) {
      for (const key in resultSet.data) {
        if (Object.prototype.hasOwnProperty.call(resultSet.data, key)) {
          const location = resultSet.data[key];

          if (location.pickups.length > 0) {
            for (const keyInner in location.pickups) {
              if (
                Object.prototype.hasOwnProperty.call(location.pickups, keyInner)
              ) {
                const locationPickup = location.pickups[keyInner];

                if (
                  locationPickup.geo_location &&
                  this.isWithinBoundingBox(
                    {
                      lat: locationPickup.geo_location.coordinates[1],
                      lng: locationPickup.geo_location.coordinates[0],
                    }
                  )
                ) {
                  this.setMarkerSingle(
                    locationPickup.geo_location.coordinates,
                    location.id,
                    locationPickup.id,
                    "pickup",
                    location.label
                  );
                }
              }
            }

            for (const keyInner in location.shippings) {
              if (
                Object.prototype.hasOwnProperty.call(
                  location.shippings,
                  keyInner
                )
              ) {
                const locationShipping = location.shippings[keyInner];

                if (
                  locationShipping.geo_location &&
                  this.isWithinBoundingBox(
                    {
                      lat: locationShipping.geo_location.coordinates[1],
                      lng: locationShipping.geo_location.coordinates[0],
                    }
                  )
                ) {
                  this.setMarkerSingle(
                    locationShipping.geo_location.coordinates,
                    location.id,
                    locationShipping.id,
                    "shipping",
                    location.label
                  );
                }
              }
            }
          }
        }
      }

      this.cluster.addMarkers(this.markers);
      this.getMarkersUnclustered();
    }
  }

  getMarkersUnclustered() {
    this.markersUnclustered = [];

    for (const key in this.markers) {
      if (Object.prototype.hasOwnProperty.call(this.markers, key)) {
        const marker = this.markers[key];
        if (marker.getMap() !== null) {
          this.markersUnclustered.push(marker);
        }
      }
    }

    // creating infoWindows only for unclustered markers
    // to probably save ressources
    this.setPopups();
  }

  refreshCluster() {
    this.cluster.clearMarkers();
    this.cluster.addMarkers(this.markers);
    this.resetPopups();
    this.getMarkersUnclustered();
  }

  setPopups() {
    // google.maps.OverlayView is not available while constructing this class
    // https://developers.google.com/maps/documentation/javascript/examples/overlay-popup

    class Popup extends this.google.maps.OverlayView {
      position: google.maps.LatLng;
      containerDiv: HTMLDivElement;

      constructor(
        position: google.maps.LatLng,
        title: string,
        parentId: number
      ) {
        super();

        this.position = position;

        this.containerDiv = document.createElement("div");
        this.containerDiv.classList.add("map-popup");

        // re-apply selected state after redrawing
        if (parentId == selectedId.value)
          this.containerDiv.classList.add("selected");

        this.containerDiv.dataset.id = parentId.toString();

        const containerContent = document.createElement("div");
        containerContent.textContent = title;

        this.containerDiv.append(containerContent);

        this.containerDiv.addEventListener("click", () => {
          googleMapsHelperInstance.selectPopup(parentId);
        });

        // Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
      }
      draw() {
        const divPosition = this.getProjection().fromLatLngToDivPixel(
          this.position
        );
        // Hide the popup when it is far out of view.
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
            ? "block"
            : "none";

        if (display === "block") {
          this.containerDiv.style.left = divPosition.x + "px";
          this.containerDiv.style.top = divPosition.y + "px";
        }

        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
      }
      onAdd() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
      }
      onRemove() {
        if (this.containerDiv.parentElement) {
          this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
      }
    }

    for (const key in this.markersUnclustered) {
      if (Object.prototype.hasOwnProperty.call(this.markersUnclustered, key)) {
        const currentMarker = this.markersUnclustered[key];

        const currentPopup = new Popup(
          currentMarker.position,
          currentMarker.title,
          currentMarker.parentId
        );
        this.popups.push(currentPopup);

        currentPopup.setMap(this.mapInstance);
      }
    }
  }

  navigateItem(
    bounds: boundingBox,
    numberLocations: number = 0
  ) {
    if (!bounds)
      return false;

    const boundingBox = new this.google.maps.LatLngBounds(
      new this.google.maps.LatLng(bounds.neLat, bounds.neLng),
      new this.google.maps.LatLng(bounds.swLat, bounds.swLng)
    );

    this.mapInstance.setCenter(boundingBox.getCenter());

    // more than one location, fit bounding box, otherwise fixed zoom
    if (numberLocations > 1)
      this.mapInstance.fitBounds(boundingBox);
    else
      this.mapInstance.setZoom(17);
  }

  selectPopup(parentId: number = selectedId.value) {
    if (parentId == -1)
      debug("select Entry, no parentID given");

    selectedId.value = parentId;

    const entryObjects = document.querySelectorAll(`.map-popup`);
    for (const key in entryObjects) {
      if (Object.prototype.hasOwnProperty.call(entryObjects, key)) {
        const element = entryObjects[key] as HTMLElement;

        if (element.dataset.id == parentId?.toString())
          element.classList.add("selected");
        else
          element.classList.remove("selected");
      }
    }

    for (const key in this.markers) {
      if (Object.prototype.hasOwnProperty.call(this.markers, key)) {
        const element = this.markers[key];
        if (element.parentId == parentId) {
          this.mapInstance.setZoom(17);
          this.mapInstance.setCenter(element.position);

          if (window.innerWidth <= 768){
            const elList = document.querySelector('#map-list-wrap');
            elList?.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }
        }
      }
    }
  }
}

const googleMapsHelperInstance = new googleMapsHelper();

export default googleMapsHelperInstance;
