/**
 * Real-world country geometry, converted once from TopoJSON (Natural Earth
 * 110m, via the world-atlas npm package) to GeoJSON features. This replaces
 * the old hand-authored 22-country polygon approximation — every country in
 * the topology renders with its actual boundary shape.
 */
import { feature } from 'topojson-client';
import worldTopology from '../data/geo/countries-110m.json';

const countriesObject = worldTopology.objects.countries;

export const WORLD_FEATURE_COLLECTION = feature(worldTopology, countriesObject);

export function getCountryFeatureByIso(isoNumeric) {
  return WORLD_FEATURE_COLLECTION.features.find((f) => f.id === isoNumeric);
}
