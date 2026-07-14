
"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { NetworkTopologyDto } from "../api/network.service"
import { useNetworkMapStore } from "../model/network-map.store"
import { NetworkMapToolbar } from "./NetworkMapToolbar"
import { NetworkDetailsPanel } from "./NetworkDetailsPanel"

interface NetworkMapProps {
  data: NetworkTopologyDto;
}

export function NetworkMap({ data }: NetworkMapProps) {
  const mapContainerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<maplibregl.Map | null>(null)
  const markersRef = React.useRef<maplibregl.Marker[]>([])
  
  const { statusFilter, showLinks, showLabels, setSelectedNodeId } = useNetworkMapStore()

  // Initialize Map
  React.useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [-103.3496, 20.6596],
      zoom: 11,
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', () => {
      // Add source for links
      map.addSource('links', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });

      // Add layer for links
      map.addLayer({
        id: 'links-layer',
        type: 'line',
        source: 'links',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.7
        }
      });
    });

    return () => {
      map.remove();
    }
  }, []);

  // Update Data (Nodes & Links)
  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Filter nodes
    const filteredNodes = statusFilter 
      ? data.nodes.filter(n => n.status === statusFilter)
      : data.nodes;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Draw Nodes
    filteredNodes.forEach(node => {
      const el = document.createElement('div');
      
      let colorClass = 'bg-muted';
      if (node.status === 'active') colorClass = 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
      if (node.status === 'degraded') colorClass = 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
      if (node.status === 'offline') colorClass = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse';

      el.className = `w-4 h-4 rounded-full border-2 border-background ${colorClass} cursor-pointer transition-transform hover:scale-125`;
      
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedNodeId(node.id);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([node.lng, node.lat])
        .addTo(map);

      if (showLabels) {
        // Label logic can be complex with DOM markers, sticking to a simple tooltip or just letting the panel do it.
        // For NOC, usually labels are native text layers. We will keep DOM markers simple.
      }

      markersRef.current.push(marker);
    });

    // Draw Links
    if (map.isStyleLoaded()) {
      updateLinks();
    } else {
      map.once('load', updateLinks);
    }

    function updateLinks() {
      if (!map) return;
      const features = showLinks ? data.links.map(link => {
        const sourceNode = data.nodes.find(n => n.id === link.sourceId);
        const targetNode = data.nodes.find(n => n.id === link.targetId);
        if (!sourceNode || !targetNode) return null;

        let color = '#3b82f6'; // default blue
        if (link.status === 'active') color = '#22c55e';
        if (link.status === 'degraded') color = '#f59e0b';
        if (link.status === 'offline') color = '#ef4444';

        return {
          type: 'Feature',
          properties: { id: link.id, color, status: link.status },
          geometry: {
            type: 'LineString',
            coordinates: [
              [sourceNode.lng, sourceNode.lat],
              [targetNode.lng, targetNode.lat]
            ]
          }
        };
      }).filter(Boolean) : [];

      const source = map.getSource('links') as maplibregl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          features: features as any
        });
      }
    }

  }, [data, statusFilter, showLinks, showLabels, setSelectedNodeId]);

  const handleCenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [-103.3496, 20.6596], zoom: 11 });
    }
  }

  return (
    <div className="relative w-full h-[600px] lg:h-[700px] rounded-xl overflow-hidden border border-border shadow-sm">
      <NetworkMapToolbar onCenter={handleCenter} />
      <NetworkDetailsPanel nodes={data.nodes} links={data.links} />
      <div ref={mapContainerRef} className="w-full h-full bg-muted/20" />
    </div>
  )
}
