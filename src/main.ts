import "./styles/index.css";
import { map, polyline, tileLayer, type LatLngExpression } from "leaflet";

interface GetFootprintsResponse {
  footprints: LatLngExpression[];
}

function loadWorldMap(footprints: LatLngExpression[]) {
  const foorprintsMap = map("footprints");

  tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(foorprintsMap);

  var footprintPolyline = polyline(footprints, {
    color: "blue",
  }).addTo(foorprintsMap);

  // Zoom the map to the polyline's extent
  foorprintsMap.fitBounds(footprintPolyline.getBounds());
}

fetch("data/footprints.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((response: GetFootprintsResponse) => {
    loadWorldMap(response.footprints);
  });

interface GetTimelineItemsResponse {
  timelineItems: TimelineItem[];
}

interface TimelineItem {
  startDate: string;
  country: string;
  duration: string;
  description: string;
}

function generateTimeline(timelineItems: TimelineItem[]) {
  const container = document.getElementById("timeline");
  if (container) {
    timelineItems.forEach((timelineItemData: TimelineItem, index: number) => {
      const timelineItemTemplate = document.getElementById(
        index % 2 == 0 ? "timeline-item-left" : "timeline-item-right"
      ) as HTMLTemplateElement;
      const cloneTimelineItem = timelineItemTemplate!.content.cloneNode(
        true
      ) as HTMLDivElement;
      const countryElement = cloneTimelineItem.querySelector(
        "[data-country]"
      ) as HTMLHeadingElement;
      countryElement.textContent = timelineItemData.country;

      const descriptionElement = cloneTimelineItem.querySelector(
        "[data-description]"
      ) as HTMLParagraphElement;
      descriptionElement.textContent = timelineItemData.description;

      container.appendChild(cloneTimelineItem);
    });
  }
}

fetch("data/timeline-items.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((response: GetTimelineItemsResponse) => {
    generateTimeline(response.timelineItems);
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });
